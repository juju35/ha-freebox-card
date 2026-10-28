import assert from "node:assert/strict";
import { test } from "node:test";
import { load } from "./load.mjs";

const { discover, listBoxes, parseDate, uptimeSec, InternetBoxCard, sameSig } = load("internet-box-card.js", [
  "discover",
  "listBoxes",
  "parseDate",
  "uptimeSec",
  "InternetBoxCard",
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
    const el = new InternetBoxCard();
    el._config = {};
    el._hass = { states: s, entities, devices, language: "en", config: { time_zone: "UTC" } };
    return el;
  };
  const before = make(states)._signature();
  assert.ok(sameSig(before, make({ ...states, "light.kitchen": st("on") })._signature()));
  assert.ok(!sameSig(before, make({ ...states, "sensor.down": { ...states["sensor.down"], state: "5" } })._signature()));
});

test("boxes of other operators are discovered from their own entity keys", () => {
  // Livebox: rate_down/up, wifi, missed calls, reboot and clear-calls buttons by their own translation keys.
  const lbDevices = { lb: { id: "lb", name: "Livebox 6", model: "Livebox 6", config_entries: ["e"] } };
  const lbEnt = (entity_id, translation_key) => ({ entity_id, platform: "livebox", translation_key, device_id: "lb" });
  const lbEntities = {
    "sensor.l_down": lbEnt("sensor.l_down", "down_rate"),
    "sensor.l_up": lbEnt("sensor.l_up", "up_rate"),
    "switch.l_wifi": lbEnt("switch.l_wifi", "wifi_switch"),
    "sensor.l_callers": lbEnt("sensor.l_callers", "callers"),
    "button.l_restart": lbEnt("button.l_restart", "restart_btn"),
    "button.l_clear": lbEnt("button.l_clear", "cmissed_clear_btn"),
  };
  const lbStates = {};
  for (const id of Object.keys(lbEntities)) lbStates[id] = st("1");
  const lb = discover({ states: lbStates, entities: lbEntities, devices: lbDevices }, "lb");
  assert.equal(lb.operator.name, "Livebox");
  assert.equal(lb.scalars.rate_down, "sensor.l_down");
  assert.equal(lb.scalars.wifi, "switch.l_wifi");
  assert.equal(lb.scalars.missed, "sensor.l_callers");
  assert.equal(lb.scalars.reboot, "button.l_restart");
  assert.equal(lb.scalars.mark_read, "button.l_clear");

  // SFR Box: DSL sync rates by translation key, reboot by device_class "restart", temperature by device_class.
  const sfrDevices = { sfr: { id: "sfr", name: "SFR Box 8", model: "NB6VAC", config_entries: ["e"] } };
  const sfrEntities = {
    "sensor.s_down": { entity_id: "sensor.s_down", platform: "sfr_box", translation_key: "dsl_rate_down", device_id: "sfr" },
    "sensor.s_up": { entity_id: "sensor.s_up", platform: "sfr_box", translation_key: "dsl_rate_up", device_id: "sfr" },
    "sensor.s_temp": { entity_id: "sensor.s_temp", platform: "sfr_box", translation_key: null, device_id: "sfr" },
    "button.s_reboot": { entity_id: "button.s_reboot", platform: "sfr_box", translation_key: null, device_id: "sfr" },
  };
  const sfrStates = {
    "sensor.s_down": st("50000"),
    "sensor.s_up": st("5000"),
    "sensor.s_temp": st("45", { device_class: "temperature" }),
    "button.s_reboot": st("unknown", { device_class: "restart" }),
  };
  const sfr = discover({ states: sfrStates, entities: sfrEntities, devices: sfrDevices }, "sfr");
  assert.equal(sfr.operator.name, "SFR Box");
  assert.equal(sfr.scalars.rate_down, "sensor.s_down");
  assert.equal(sfr.scalars.reboot, "button.s_reboot");
  assert.deepEqual([...sfr.temps].map((t) => t.id), ["sensor.s_temp"]);

  // Bbox: legacy integration with no translation keys, discovered by entity-id suffix.
  const bbDevices = { bb: { id: "bb", name: "Bbox", config_entries: ["e"] } };
  const bbEntities = {
    "sensor.b_down": { entity_id: "sensor.bbox_currently_used_download_bandwidth", platform: "bbox", translation_key: null, device_id: "bb" },
    "sensor.b_up": { entity_id: "sensor.bbox_currently_used_upload_bandwidth", platform: "bbox", translation_key: null, device_id: "bb" },
  };
  const bbStates = {
    "sensor.bbox_currently_used_download_bandwidth": st("500"),
    "sensor.bbox_currently_used_upload_bandwidth": st("50"),
  };
  const bb = discover({ states: bbStates, entities: bbEntities, devices: bbDevices }, "bb");
  assert.equal(bb.operator.name, "Bbox");
  assert.equal(bb.scalars.rate_down, "sensor.bbox_currently_used_download_bandwidth");
  assert.equal(bb.scalars.rate_up, "sensor.bbox_currently_used_upload_bandwidth");

  // Bbox for real: the legacy integration registers no device and no unique_id, so its sensors are only in
  // hass.states (not the entity registry). It is discovered and listed from states by the entity-id prefix.
  const bbOnly = { states: bbStates, entities: {}, devices: {} };
  assert.deepEqual(
    [...listBoxes(bbOnly)].map((b) => ({ value: b.value, label: b.label })),
    [{ value: "sensor.bbox", label: "Bbox" }]
  );
  const bb2 = discover(bbOnly);
  assert.equal(bb2.operator.name, "Bbox");
  assert.equal(bb2.id, "sensor.bbox");
  assert.equal(bb2.device, null);
  assert.equal(bb2.scalars.rate_down, "sensor.bbox_currently_used_download_bandwidth");
  assert.equal(bb2.scalars.rate_up, "sensor.bbox_currently_used_upload_bandwidth");
});

test("the reboot button is discovered by its translation key, its device class, or the default entity id", () => {
  // Registry: translation_key "reboot".
  const ents = {
    ...entities,
    "button.reboot": { entity_id: "button.reboot", platform: "freebox", device_id: "router", translation_key: "reboot" },
  };
  const states = { ...baseStates(), "button.reboot": st("unknown") };
  assert.equal(discover({ states, entities: ents, devices }, "router").scalars.reboot, "button.reboot");

  // Registry: no translation key, device_class "restart".
  const ents2 = {
    ...entities,
    "button.boot": { entity_id: "button.boot", platform: "freebox", device_id: "router", translation_key: null },
  };
  const states2 = { ...baseStates(), "button.boot": st("unknown", { device_class: "restart" }) };
  assert.equal(discover({ states: states2, entities: ents2, devices }, "router").scalars.reboot, "button.boot");

  // No registry (old frontend): the default English entity id.
  const fb = {
    "device_tracker.freebox": st("home", { connection_type: "ftth", firmware_version: "1.0", uptime: "2026-10-24T08:00:00" }),
    "sensor.freebox_download_speed": st("10", { unit_of_measurement: "kB/s" }),
    "button.freebox_reboot": st("unknown"),
  };
  for (const [id, v] of Object.entries(fb)) v.entity_id = id;
  assert.equal(discover({ states: fb }, undefined).scalars.reboot, "button.freebox_reboot");
});

test("the model is detected from the device and can be forced with the model option", () => {
  const { boxModel, MODELS } = load("internet-box-card.js", ["boxModel", "MODELS"]);
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

test("every model of every operator has its drawn picture, also shown in the README", async () => {
  const { OPERATORS, IMG_BOX } = load("internet-box-card.js", ["OPERATORS", "IMG_BOX"]);
  const { readFileSync } = await import("node:fs");
  for (const op of Object.values(OPERATORS)) {
    for (const m of op.models) {
      assert.match(IMG_BOX[m.id], /^data:image\/svg\+xml,/, m.id);
      // images/<operator>-<model>.svg is the README copy of the same drawing (npm run screenshots writes it).
      const base = (op.platform === "freebox" ? `freebox-${m.id}` : m.id).replace(/_/g, "-");
      const file = readFileSync(new URL(`../images/${base}.svg`, import.meta.url), "utf8");
      assert.equal(file.trim(), decodeURIComponent(IMG_BOX[m.id].slice("data:image/svg+xml,".length)), m.id);
    }
  }
});
