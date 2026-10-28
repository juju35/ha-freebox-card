import assert from "node:assert/strict";
import { test } from "node:test";
import { load } from "./load.mjs";

const { STRINGS, RATE_UNITS } = load("internet-box-card.js", ["STRINGS", "RATE_UNITS"]);

const LANGS = ["en", "fr", "de", "es"];
const enKeys = Object.keys(STRINGS.en).sort();

test("I18N parity: every language has exactly the English keys", () => {
  for (const l of LANGS) {
    assert.ok(STRINGS[l], `missing language ${l}`);
    assert.deepEqual(Object.keys(STRINGS[l]).sort(), enKeys, `key mismatch in ${l}`);
    for (const [k, v] of Object.entries(STRINGS[l])) assert.ok(typeof v === "string" && v.trim(), `${l}.${k} is empty`);
  }
});

test("I18N parity: every language has rate units", () => {
  for (const l of Object.keys(STRINGS)) {
    assert.ok(RATE_UNITS[l], `missing rate units for ${l}`);
    assert.equal(RATE_UNITS[l].bytes.length, RATE_UNITS.en.bytes.length);
    assert.equal(RATE_UNITS[l].bits.length, RATE_UNITS.en.bits.length);
  }
});
