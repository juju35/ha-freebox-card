import assert from "node:assert/strict";
import { test } from "node:test";
import { load } from "./load.mjs";

const { discover, parseDate, uptimeSec, FreeboxCard, sameSig } = load("freebox-card.js", [
  "discover",
  "parseDate",
  "uptimeSec",
  "FreeboxCard",
  "sameSig",
]);

const ENTRY = "entry";
const devices = {
  router: { id: "router", name: "Freebox v9 (r1)", model_id: "fbxgw9-r1", config_entries: [ENTRY] },
  phone: { id: "phone", name: "phone", config_entries: ["other_entry"] },
  nas: { id: "nas", name: "nas", config_entries: [ENTRY] },
};
const entities = {
  "sensor.down": { entity_id: "sensor.down", platform: "freebox", device_id: "router", translation_key: "rate_down" },
  "device_tracker.router": { entity_id: "device_tracker.router", platform: "freebox", device_id: "router" },
  "device_tracker.nas": { entity_id: "device_tracker.nas", platform: "freebox", device_id: "nas" },
  // Most client trackers have no device in Home Assistant.
  "device_tracker.laptop": { entity_id: "device_tracker.laptop", platform: "freebox", device_id: null },
  "device_tracker.tablet": { entity_id: "device_tracker.tablet", platform: "freebox", device_id: null },
};
const st = (state, attributes = {}) => ({ state, attributes });
const baseStates = () => {
  const s = {
    "sensor.down": st("100", { unit_of_measurement: "kB/s" }),
    "device_tracker.router": st("home", { uptime: "2026-10-24T08:00:00" }),
    "device_tracker.nas": st("home"),
    "device_tracker.laptop": st("home"),
    "device_tracker.tablet": st("not_home"),
    "light.kitchen": st("off"),
  };
  for (const [id, v] of Object.entries(s)) v.entity_id = id;
  return s;
};

test("client trackers without a device are counted with a single Freebox", () => {
  const box = discover({ states: baseStates(), entities, devices }, undefined);
  assert.deepEqual([...box.trackers].sort(), ["device_tracker.laptop", "device_tracker.nas", "device_tracker.tablet"]);
  assert.equal(box.scalars.router, "device_tracker.router");
});

test("client trackers without a device are not assigned when there are two Freeboxes", () => {
  const devs = { ...devices, router2: { id: "router2", name: "Freebox 2", config_entries: ["entry2"] } };
  const ents = {
    ...entities,
    "sensor.down2": { entity_id: "sensor.down2", platform: "freebox", device_id: "router2", translation_key: "rate_down" },
  };
  const states = { ...baseStates(), "sensor.down2": { entity_id: "sensor.down2", ...st("1") } };
  const box = discover({ states, entities: ents, devices: devs }, "router");
  assert.deepEqual([...box.trackers], ["device_tracker.nas"]);
});

test("discovery is cached across state changes and refreshed on registry changes", () => {
  const states = baseStates();
  const a = discover({ states, entities, devices }, "router");
  const b = discover({ states: { ...states, "light.kitchen": st("on") }, entities, devices }, "router");
  assert.equal(a, b);
  const c = discover({ states, entities: { ...entities }, devices }, "router");
  assert.notEqual(a, c);
});

test("a naive uptime date is read in the Home Assistant time zone", () => {
  // 08:00 in Paris in October (UTC+2) is 06:00 UTC.
  assert.equal(parseDate("2026-10-24T08:00:00", "Europe/Paris"), Date.parse("2026-10-24T06:00:00Z"));
  assert.equal(parseDate("2026-01-15T08:00:00", "Europe/Paris"), Date.parse("2026-01-15T07:00:00Z"));
  assert.equal(parseDate("2026-10-24T08:00:00", "UTC"), Date.parse("2026-10-24T08:00:00Z"));
  assert.equal(parseDate("2026-10-24 08:00:00", "America/New_York"), Date.parse("2026-10-24T12:00:00Z"));
});

test("a date with an offset is parsed as is", () => {
  assert.equal(parseDate("2026-10-24T08:00:00+00:00", "Europe/Paris"), Date.parse("2026-10-24T08:00:00Z"));
});

test("uptimeSec uses the time zone", () => {
  const boot = new Date(Date.now() - 3600e3);
  const pad = (n) => String(n).padStart(2, "0");
  const utcNaive = `${boot.getUTCFullYear()}-${pad(boot.getUTCMonth() + 1)}-${pad(boot.getUTCDate())}T${pad(boot.getUTCHours())}:${pad(boot.getUTCMinutes())}:${pad(boot.getUTCSeconds())}`;
  const sec = uptimeSec({ attributes: { uptime: utcNaive } }, "UTC");
  assert.ok(Math.abs(sec - 3600) < 5, `got ${sec}`);
});

test("an unrelated state change keeps the render signature", () => {
  const states = baseStates();
  const make = (s) => {
    const el = new FreeboxCard();
    el._config = {};
    el._hass = { states: s, entities, devices, language: "en", config: { time_zone: "UTC" } };
    return el;
  };
  const before = make(states)._signature();
  assert.ok(sameSig(before, make({ ...states, "light.kitchen": st("on") })._signature()));
  assert.ok(!sameSig(before, make({ ...states, "sensor.down": { ...states["sensor.down"], state: "5" } })._signature()));
});

test("the model is detected from the device and can be forced with the model option", () => {
  const { boxModel, MODELS } = load("freebox-card.js", ["boxModel", "MODELS"]);
  const box = (dev) => ({ device: dev });
  assert.equal(boxModel(box(devices.router), {}).id, "ultra");
  assert.equal(boxModel(box({ model_id: "fbxgw8-r1" }), {}).id, "pop");
  assert.equal(boxModel(box({ name: "Freebox v7 (r1)" }), {}).id, "delta");
  assert.equal(boxModel(box({ model: "Freebox Server Mini 4K" }), {}).id, "mini_4k");
  assert.equal(boxModel(box({ model_id: "fbxgw-r2" }), {}).id, "revolution");
  assert.equal(boxModel(box({ name: "Some router" }), {}), undefined);
  assert.equal(boxModel(box(devices.router), { model: "revolution" }).name, "Freebox Revolution");
  assert.equal(boxModel(box(devices.router), { model: "unknown" }).id, "ultra");
  assert.equal(MODELS.map((m) => m.id).join(), "ultra,pop,delta,revolution,mini_4k");
});

test("every model has its picture in the build", async () => {
  const { MODELS, IMG_BOX } = load("freebox-card.js", ["MODELS", "IMG_BOX"]);
  const { existsSync } = await import("node:fs");
  for (const m of MODELS) {
    assert.equal(IMG_BOX[m.id], `__IMG_BOX_${m.id.toUpperCase()}__`);
    assert.ok(existsSync(new URL(`../images/freebox-${m.id.replace(/_/g, "-")}.webp`, import.meta.url)), m.id);
  }
});
