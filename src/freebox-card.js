/*
 * Freebox Card for Home Assistant
 * https://github.com/juju35/ha-freebox-card
 *
 * Lovelace cards for the Freebox integration (https://www.home-assistant.io/integrations/freebox/).
 * Entities are discovered automatically from the entity registry (platform "freebox" and
 * translation key), whatever the language and the entity ids.
 */

const VERSION = "__VERSION__";
const IMG_BOX = "__IMG_BOX__";
const IMG_LOGO = "__IMG_LOGO__";
const FREE_URL = "https://www.free.fr";
const ADMIN_URL = "https://mafreebox.freebox.fr";

const ICONS = {
  down: "M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z",
  up: "M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z",
  temp: "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  fan: "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
  timer: "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z",
  network: "M13,19H14A1,1 0 0,1 15,20H22V22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H4A1,1 0 0,1 3,16V12A1,1 0 0,1 4,11H20A1,1 0 0,1 21,12V16A1,1 0 0,1 20,17H13V19M4,3H20A1,1 0 0,1 21,4V8A1,1 0 0,1 20,9H4A1,1 0 0,1 3,8V4A1,1 0 0,1 4,3M9,7H10V5H9V7M9,15H10V13H9V15M5,5V7H7V5H5M5,13V15H7V13H5Z",
  ip: "M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  devices: "M3,6H21V4H3C1.9,4 1,4.9 1,6V18A2,2 0 0,0 3,20H7V18H3V6M13,12H9V13.78C8.39,14.33 8,15.11 8,16C8,16.89 8.39,17.67 9,18.22V20H13V18.22C13.61,17.67 14,16.88 14,16C14,15.12 13.61,14.33 13,13.78V12M11,17.5A1.5,1.5 0 0,1 9.5,16A1.5,1.5 0 0,1 11,14.5A1.5,1.5 0 0,1 12.5,16A1.5,1.5 0 0,1 11,17.5M22,8H16A1,1 0 0,0 15,9V19A1,1 0 0,0 16,20H22A1,1 0 0,0 23,19V9A1,1 0 0,0 22,8M21,18H17V10H21V18Z",
  wifi: "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  wifi_off: "M2.28,3L1,4.27L2.47,5.74C2.04,6 1.61,6.29 1.2,6.6L3,9C3.39,8.7 3.82,8.42 4.26,8.16L6.5,10.4C5.9,10.68 5.33,11 4.8,11.4L6.6,13.8C7.14,13.4 7.73,13.06 8.35,12.79L10.88,15.32C10,15.5 9.13,15.79 8.4,16.2L12,21L14.88,17.17L19.73,22L21,20.72L3.28,3H2.28M12,3C10.08,3 8.24,3.3 6.5,3.85L8.97,6.32C9.95,6.11 10.96,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C11.62,9 11.25,9 10.88,9.05L14.15,12.32C15.32,12.6 16.43,13.09 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  phone: "M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z",
  phone_missed: "M23.71,16.67C20.66,13.77 16.54,12 12,12C7.46,12 3.34,13.77 0.29,16.67C0.11,16.85 0,17.1 0,17.38C0,17.66 0.11,17.9 0.29,18.08L2.77,20.56C2.95,20.74 3.2,20.85 3.5,20.85C3.75,20.85 4,20.75 4.18,20.57C4.97,19.83 5.86,19.21 6.84,18.71C7.17,18.55 7.4,18.21 7.4,17.81V14.71C8.85,14.24 10.39,14 12,14C13.6,14 15.15,14.24 16.6,14.72V17.82C16.6,18.22 16.83,18.56 17.16,18.72C18.14,19.21 19.04,19.84 19.82,20.58C20,20.76 20.25,20.86 20.5,20.86C20.8,20.86 21.05,20.75 21.23,20.57L23.71,18.09C23.89,17.91 24,17.66 24,17.38C24,17.1 23.89,16.85 23.71,16.67M6.5,5.5L12,11L19,4L18,3L12,9L7.5,4.5H11V3H5V9H6.5V5.5Z",
  database: "M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z",
  chip: "M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z",
  services: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
};

const STRINGS = {
  en: {
    network: "Network",
    system: "System",
    storage: "Storage",
    services: "Services",
    download: "Download",
    upload: "Upload",
    uptime: "Uptime:",
    firmware: "Firmware",
    devices: "Connected devices",
    devices_short: "Devices",
    wifi: "Wi-Fi",
    wifi_on: "Wi-Fi on",
    wifi_off: "Wi-Fi off",
    on: "On",
    off: "Off",
    missed_calls: "Missed calls",
    calls: "Calls",
    missed: "missed",
    fan: "Fan",
    temperature: "Temp.",
    used: "used",
    free: "free",
    raid: "RAID",
    raid_ok: "OK",
    raid_degraded: "Degraded",
    online: "Online",
    offline: "Offline",
    hours: "h",
    days: "d",
    minutes: "min",
    no_box: "No Freebox entities found. Is the Freebox integration installed?",
    unknown_box: "Freebox not found",
    // Editor
    box: "Freebox (Freebox integration device)",
    title: "Title (optional, defaults to the Freebox model)",
    show_image: "Show Freebox picture",
    admin: "Open Freebox OS",
    admin_url: "Freebox OS address (optional, opened when clicking the picture)",
    show_logo: "Show Free logo",
    show_network: "Show network",
    show_system: "Show system (temperatures, fans)",
    show_storage: "Show storage",
    show_services: "Show services (Wi-Fi, calls, devices)",
    rate_unit: "Rate unit",
    unit_bytes: "Bytes (kB/s, MB/s)",
    unit_bits: "Bits (kb/s, Mb/s)",
    language: "Language",
    lang_auto: "Automatic",
  },
  fr: {
    network: "Réseau",
    system: "Système",
    storage: "Stockage",
    services: "Services",
    download: "Réception",
    upload: "Envoi",
    uptime: "Allumée depuis",
    firmware: "Firmware",
    devices: "Appareils connectés",
    devices_short: "Appareils",
    wifi: "Wi-Fi",
    wifi_on: "Wi-Fi activé",
    wifi_off: "Wi-Fi désactivé",
    on: "Activé",
    off: "Désactivé",
    missed_calls: "Appels manqués",
    calls: "Appels",
    missed: "manqués",
    fan: "Ventilateur",
    temperature: "Temp.",
    used: "utilisés",
    free: "libres",
    raid: "RAID",
    raid_ok: "OK",
    raid_degraded: "Dégradé",
    online: "En ligne",
    offline: "Hors ligne",
    hours: "h",
    days: "j",
    minutes: "min",
    no_box: "Aucune entité Freebox trouvée. L'intégration Freebox est-elle installée ?",
    unknown_box: "Freebox introuvable",
    box: "Freebox (appareil de l'intégration Freebox)",
    title: "Titre (facultatif, modèle de la Freebox par défaut)",
    show_image: "Afficher la photo de la Freebox",
    admin: "Ouvrir Freebox OS",
    admin_url: "Adresse de Freebox OS (facultatif, ouverte au clic sur la photo)",
    show_logo: "Afficher le logo Free",
    show_network: "Afficher le réseau",
    show_system: "Afficher le système (températures, ventilateurs)",
    show_storage: "Afficher le stockage",
    show_services: "Afficher les services (Wi-Fi, appels, appareils)",
    rate_unit: "Unité des débits",
    unit_bytes: "Octets (ko/s, Mo/s)",
    unit_bits: "Bits (kb/s, Mb/s)",
    language: "Langue",
    lang_auto: "Automatique",
  },
};

const RATE_UNITS = {
  en: { bytes: ["B/s", "kB/s", "MB/s", "GB/s"], bits: ["b/s", "kb/s", "Mb/s", "Gb/s"] },
  fr: { bytes: ["o/s", "ko/s", "Mo/s", "Go/s"], bits: ["b/s", "kb/s", "Mb/s", "Gb/s"] },
};

// Commercial names of the Freebox models, from the model id (fbxgw9-r1) or the pretty name (Freebox v9 (r1)).
const MODELS = [
  [/fbxgw9|v9\b/i, "Freebox Ultra"],
  [/fbxgw8|v8\b/i, "Freebox Pop"],
  [/fbxgw7|v7\b/i, "Freebox Delta"],
  [/fbxgw2|mini/i, "Freebox mini 4K"],
  [/fbxgw-r|v6\b/i, "Freebox Revolution"],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = (config && config.language) || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

const t = (hass, config, key) => STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key;

const num = (s) => {
  if (!s) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
};

const RATE_FACTORS = {
  "b/s": 1, "bit/s": 1 / 8, "kbit/s": 125, "mbit/s": 125e3, "gbit/s": 125e6,
  "kb/s": 1e3, "mb/s": 1e6, "gb/s": 1e9, "kib/s": 1024, "mib/s": 1024 ** 2, "gib/s": 1024 ** 3,
};

/** Data rate of a sensor in bytes per second, whatever the unit chosen in Home Assistant. */
const toBps = (s) => {
  const v = num(s);
  if (v === null) return null;
  const unit = String(s.attributes.unit_of_measurement || "kB/s").toLowerCase();
  return v * (RATE_FACTORS[unit] ?? 1e3);
};

const fmtRate = (bps, hass, config) => {
  if (bps === null || bps === undefined) return "—";
  const bits = config.rate_unit === "bits";
  const units = RATE_UNITS[lang(hass, config)][bits ? "bits" : "bytes"];
  let v = bits ? bps * 8 : bps;
  let i = 0;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  return `${v >= 100 || i === 0 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
};

const fmtUptime = (sec, hass, config) => {
  if (sec === null) return "—";
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d} ${t(hass, config, "days")} ${h} ${t(hass, config, "hours")}`;
  if (h > 0) return `${h} ${t(hass, config, "hours")} ${m} ${t(hass, config, "minutes")}`;
  return `${m} ${t(hass, config, "minutes")}`;
};

/** Seconds since the boot date exposed by the router device tracker ("uptime" attribute). */
const uptimeSec = (tracker) => {
  const raw = tracker?.attributes?.uptime;
  if (!raw) return null;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? Math.max(0, (Date.now() - ms) / 1000) : null;
};

const level = (v, warn, crit) => (v === null ? "" : v >= crit ? "crit" : v >= warn ? "warn" : "ok");

const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24"><path d="${path}"/></svg>`;

const fireMoreInfo = (node, entityId) => {
  if (!entityId) return;
  node.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
};

// ---------------------------------------------------------------------------
// Entity discovery
// ---------------------------------------------------------------------------

const _cache = new WeakMap();

const deviceName = (dev) => dev && (dev.name_by_user || dev.name);

/** Friendly name of an entity without its device name ("Freebox v9 (r1) Température CPU 0" -> "Température CPU 0"). */
const shortName = (hass, id, dev) => {
  const name = hass.states[id]?.attributes?.friendly_name || id.split(".")[1];
  for (const prefix of [dev?.name_by_user, dev?.name, "Freebox"]) {
    if (prefix && name.startsWith(`${prefix} `)) return name.slice(prefix.length + 1);
  }
  return name;
};

/** Without the device registry: keep the end of the name from its first temperature / fan word. */
const tail = (hass, id) => {
  const name = shortName(hass, id);
  return name.match(/(temp[ée]rature|temp\.|ventilateur|fan)\b.*$/i)?.[0] || name;
};

/** Freebox registry entries, or [] when the registry is not exposed. */
const registry = (hass) =>
  hass.entities ? Object.values(hass.entities).filter((e) => e.platform === "freebox" && !e.hidden && hass.states[e.entity_id]) : [];

/** List the Freebox routers: the devices of the "Download speed" sensors. */
const listBoxes = (hass) => {
  const seen = new Map();
  for (const e of registry(hass)) {
    if (e.translation_key === "rate_down" && e.device_id && !seen.has(e.device_id))
      seen.set(e.device_id, deviceName(hass.devices?.[e.device_id]) || e.device_id);
  }
  return [...seen.entries()].map(([value, label]) => ({ value, label }));
};

const emptyBox = () => ({ id: null, device: null, scalars: {}, temps: [], fans: [], partitions: [], raids: [], trackers: [] });

/** Map the entities of one Freebox to a structured object of entity ids. */
const discover = (hass, boxId) => {
  let byBox = _cache.get(hass.states);
  if (!byBox) {
    byBox = new Map();
    _cache.set(hass.states, byBox);
  }
  const key = boxId || "";
  if (byBox.has(key)) return byBox.get(key);

  const box = emptyBox();
  const entries = registry(hass).sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  if (entries.length && hass.devices) {
    const routers = listBoxes(hass).map((b) => b.value);
    const router = boxId ? (routers.includes(boxId) ? boxId : null) : routers[0];
    if (router) {
      const dev = hass.devices[router];
      const entryIds = new Set(dev?.config_entries || []);
      box.id = router;
      box.device = dev;
      for (const e of entries) {
        const id = e.entity_id;
        const domain = id.split(".")[0];
        const d = hass.devices[e.device_id];
        const own = e.device_id === router;
        // Disks are child devices of the router; client trackers share its config entry.
        const child = d && d.via_device_id === router;
        const sameEntry = d && (d.config_entries || []).some((c) => entryIds.has(c));
        if (domain === "device_tracker") {
          if (own) box.scalars.router = id;
          else if (sameEntry) box.trackers.push(id);
          continue;
        }
        if (!own && !child) continue;
        const k = e.translation_key;
        const a = hass.states[id].attributes;
        if (k === "rate_down" || k === "rate_up" || k === "missed" || k === "wifi") box.scalars[k] = id;
        else if (k === "partition_free_space") box.partitions.push({ id, device: d });
        else if (k === "raid_degraded") box.raids.push(id);
        else if (own && domain === "sensor" && !k && a.device_class === "temperature") box.temps.push({ id, name: shortName(hass, id, dev) });
        else if (own && domain === "sensor" && !k && /^(rpm|tr\/min)$/i.test(a.unit_of_measurement || ""))
          box.fans.push({ id, name: shortName(hass, id, dev) });
      }
    }
  } else if (!entries.length && !boxId) {
    // No registry (old frontend, tests): fall back on the default English entity ids.
    for (const id of Object.keys(hass.states).sort()) {
      const s = hass.states[id];
      const a = s.attributes || {};
      if (id.startsWith("device_tracker.") && a.connection_type !== undefined && a.firmware_version) box.scalars.router ??= id;
      else if (/^sensor\.freebox.*_download_speed$/.test(id)) box.scalars.rate_down ??= id;
      else if (/^sensor\.freebox.*_upload_speed$/.test(id)) box.scalars.rate_up ??= id;
      else if (/^sensor\.freebox.*_missed_calls$/.test(id)) box.scalars.missed ??= id;
      else if (/^switch\.freebox.*_wifi$/.test(id)) box.scalars.wifi ??= id;
      else if (/^sensor\.freebox/.test(id) && a.device_class === "temperature") box.temps.push({ id, name: tail(hass, id) });
      else if (/^sensor\.freebox/.test(id) && /^rpm$/i.test(a.unit_of_measurement || "")) box.fans.push({ id, name: tail(hass, id) });
    }
    if (box.scalars.rate_down) box.id = "freebox";
  }
  byBox.set(key, box);
  return box;
};

/** Commercial name of the Freebox ("Freebox Ultra"), else its device name. */
const modelName = (box) => {
  const dev = box.device;
  const ids = [dev?.model_id, dev?.hw_version, dev?.model, dev?.name].filter(Boolean).join(" ");
  for (const [re, name] of MODELS) if (re.test(ids)) return name;
  return deviceName(dev) || "Freebox";
};

/** Label of a partition: its friendly name without the device name and the "free space" words. */
const partitionLabel = (hass, p) =>
  shortName(hass, p.id, p.device)
    .replace(/\s*(free space|espace libre( de| sur)?|freier speicher)\s*/gi, " ")
    .trim() || deviceName(p.device) || "Disk";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const BASE_STYLE = `
  :host { --fb-red: #cd1e25; --fb-ok: var(--success-color, #43a047); --fb-warn: var(--warning-color, #ffa600); --fb-crit: var(--error-color, #db4437); }
  ha-card { overflow: hidden; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .muted { color: var(--secondary-text-color); }
  .clickable { cursor: pointer; }
  .ok { --c: var(--fb-ok); } .warn { --c: var(--fb-warn); } .crit { --c: var(--fb-crit); } .off { --c: var(--disabled-text-color, #9e9e9e); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--fb-ok)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;
          background: color-mix(in srgb, var(--c, var(--fb-ok)) 15%, transparent); color: var(--c, var(--fb-ok)); }
  .chip .icon { width: 14px; height: 14px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .bar { height: 4px; border-radius: 3px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
  .bar > div { height: 100%; border-radius: 3px; background: var(--c, var(--fb-red)); transition: width .6s ease; }
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 4px; }
  .titles { flex: 1; min-width: 0; }
  .titles .chips { margin-top: 4px; }
  .logo-link { display: flex; align-items: center; justify-content: center; flex: none; width: 36px; height: 36px; border-radius: 10px;
               background: #fff; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)); }
  .logo { display: block; width: 30px; height: auto; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .box-link { display: flex; flex: none; max-width: 40%; }
  .box { height: 48px; width: auto; max-width: 100%; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,.25)); }
  .tile { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 10px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .tile .icon { color: var(--c, var(--fb-red)); }
  .tile > div { min-width: 0; }
  .tile .k { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .v { font-size: 14px; font-weight: 500; white-space: nowrap; }
  .tile.down { --c: var(--fb-red); }
  .tile.up { --c: var(--info-color, #039be5); }
  .warning { padding: 16px; color: var(--fb-warn); }
`;

class FreeboxBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this.shadowRoot.addEventListener("click", (ev) => {
      const el = ev.composedPath().find((n) => n.dataset && n.dataset.entity);
      if (el) fireMoreInfo(this, el.dataset.entity);
    });
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    this._html = "";
    this._update();
  }

  _t(key) {
    return t(this._hass, this._config, key);
  }

  _s(id) {
    return id ? this._hass.states[id] : undefined;
  }

  _rate(id) {
    return fmtRate(toBps(this._s(id)), this._hass, this._config);
  }

  _update() {
    if (!this._hass || !this._config) return;
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      this.shadowRoot.innerHTML = html;
    }
  }

  _chips(box) {
    const sc = box.scalars;
    const chips = [];
    const router = this._s(sc.router);
    if (router) {
      const online = router.state === "home";
      const type = router.attributes.connection_type;
      chips.push(
        `<span class="chip clickable ${online ? "ok" : "crit"}" data-entity="${router.entity_id}"><span class="dot"></span>${esc(
          online ? this._t("online") : this._t("offline")
        )}${type ? ` · ${esc(String(type).toUpperCase())}` : ""}</span>`
      );
    }
    const wifi = this._s(sc.wifi);
    if (wifi) {
      const on = wifi.state === "on";
      chips.push(
        `<span class="chip clickable ${on ? "ok" : "off"}" data-entity="${wifi.entity_id}">${svgIcon(on ? ICONS.wifi : ICONS.wifi_off)}${esc(
          on ? this._t("wifi_on") : this._t("wifi_off")
        )}</span>`
      );
    }
    return chips.length ? `<div class="chips">${chips.join("")}</div>` : "";
  }

  _header(box, withChips) {
    const c = this._config;
    const router = this._s(box.scalars.router);
    const firmware = box.device?.sw_version || router?.attributes?.firmware_version;
    const devName = deviceName(box.device);
    const name = c.title || modelName(box);
    const adminUrl = /^https?:\/\//i.test(c.admin_url || "") ? c.admin_url : ADMIN_URL;
    const sub = [devName && devName !== name ? devName : null, firmware ? `${this._t("firmware")} ${firmware}` : null]
      .filter(Boolean)
      .join(" · ");
    return `
      <div class="header">
        ${
          c.show_logo !== false
            ? `<a class="logo-link" href="${FREE_URL}" target="_blank" rel="noopener noreferrer" title="free.fr"><img class="logo" src="${IMG_LOGO}" alt="Free"></a>`
            : ""
        }
        <div class="titles">
          <div class="name">${esc(name)}</div>
          <div class="sub">${esc(sub)}</div>
          ${withChips ? this._chips(box) : ""}
        </div>
        ${
          c.show_image !== false
            ? `<a class="box-link" href="${esc(adminUrl)}" target="_blank" rel="noopener noreferrer" title="${esc(
                this._t("admin")
              )}"><img class="box" src="${IMG_BOX}" alt="Freebox"></a>`
            : ""
        }
      </div>`;
  }

  _noBox() {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(
      this._config.box ? `${this._t("unknown_box")}: ${this._config.box}` : this._t("no_box")
    )}</div></ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Full card
// ---------------------------------------------------------------------------

const ring = (pct) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  const p = pct === null ? 0 : Math.max(0, Math.min(100, pct));
  return `<svg class="ring" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="${r}" class="track"/>
    <circle cx="32" cy="32" r="${r}" class="value" stroke-dasharray="${((p / 100) * c).toFixed(1)} ${c.toFixed(1)}"/>
  </svg>`;
};

const FULL_STYLE = `
  .content { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 12px; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); margin-bottom: 6px; }
  .section-title .icon { width: 16px; height: 16px; }
  .grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 6px; }
  .facts { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 12px; margin-top: 6px; }
  .facts > span { display: inline-flex; align-items: center; gap: 4px; min-width: 0; }
  .facts .icon { width: 14px; height: 14px; color: var(--secondary-text-color); }
  .gauges { display: grid; grid-template-columns: repeat(auto-fit, minmax(68px, 1fr)); gap: 6px; }
  .gauge { display: flex; flex-direction: column; align-items: center; position: relative; }
  .gauge .val .icon { width: 12px; height: 12px; }
  .ring { width: 52px; height: 52px; transform: rotate(-90deg); }
  .ring circle { fill: none; stroke-width: 6; }
  .ring .track { stroke: var(--divider-color, rgba(127,127,127,.25)); }
  .ring .value { stroke: var(--c, var(--fb-red)); stroke-linecap: round; transition: stroke-dasharray .6s ease; }
  .gauge .val { position: absolute; top: 0; height: 52px; display: flex; align-items: center; justify-content: center; }
  .gauge .val b { font-size: 14px; font-weight: 500; }
  .gauge .lbl { font-size: 12px; color: var(--secondary-text-color); margin-top: 0; text-align: center; white-space: nowrap;
                overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .fans { margin-top: 8px; gap: 6px; }
  .part { margin-bottom: 8px; display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 8px; align-items: center; }
  .part .row { grid-column: 1; grid-row: 1; }
  .part:last-child { margin-bottom: 0; }
  .row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .row .grow { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .part .bar { margin: 4px 0 0; grid-column: 1 / -1; grid-row: 2; }
  .part .detail { font-size: 11px; color: var(--secondary-text-color); display: flex; justify-content: flex-end; grid-column: 2; grid-row: 1; gap: 8px; }
  .tile.svc { --c: var(--secondary-text-color); }
  .tile.svc.ok { --c: var(--fb-ok); } .tile.svc.warn { --c: var(--fb-warn); }
  .spin { animation: spin 1.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
`;

class FreeboxCard extends FreeboxBase {
  static getConfigElement() {
    return document.createElement("freebox-card-editor");
  }

  static getStubConfig(hass) {
    const box = hass ? listBoxes(hass)[0] : null;
    return box ? { box: box.value } : {};
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _render() {
    const box = discover(this._hass, this._config.box);
    if (!box.id) return this._noBox();
    const c = this._config;
    const parts = [];
    if (c.show_network !== false) parts.push(this._network(box));
    if (c.show_system !== false) parts.push(this._system(box));
    if (c.show_storage !== false) parts.push(this._storage(box));
    if (c.show_services !== false) parts.push(this._services(box));
    return `<style>${BASE_STYLE}${FULL_STYLE}</style>
      <ha-card>
        ${this._header(box, true)}
        <div class="content">${parts.filter(Boolean).join("")}</div>
      </ha-card>`;
  }

  _network(box) {
    const sc = box.scalars;
    if (!sc.rate_down && !sc.rate_up) return "";
    const tile = (id, cls, icon, k) =>
      `<div class="tile clickable ${cls}" data-entity="${id || ""}">${svgIcon(icon)}<div><div class="k">${k}</div><div class="v">${this._rate(
        id
      )}</div></div></div>`;
    const router = this._s(sc.router);
    const facts = [];
    if (router?.attributes?.IPv4)
      facts.push(
        `<span class="clickable" data-entity="${router.entity_id}" title="${esc(router.attributes.IPv6 || "")}">${svgIcon(ICONS.ip)}${esc(
          router.attributes.IPv4
        )}</span>`
      );
    const up = uptimeSec(router);
    if (up !== null)
      facts.push(
        `<span class="clickable" data-entity="${router.entity_id}">${svgIcon(ICONS.timer)}${this._t("uptime")} ${fmtUptime(
          up,
          this._hass,
          this._config
        )}</span>`
      );
    return `<div>
      <div class="section-title">${svgIcon(ICONS.network)}${this._t("network")}</div>
      <div class="grid2">
        ${tile(sc.rate_down, "down", ICONS.down, this._t("download"))}
        ${tile(sc.rate_up, "up", ICONS.up, this._t("upload"))}
      </div>
      ${facts.length ? `<div class="facts">${facts.join("")}</div>` : ""}
    </div>`;
  }

  _system(box) {
    if (!box.temps.length && !box.fans.length) return "";
    // "Température CPU 0" -> "CPU 0", "Température 1" -> "Temp. 1"; CPU sensors first.
    const temps = box.temps
      .map(({ id, name }) => {
        const short = name.replace(/^(temp[ée]rature|temp\.?)\s+/i, "");
        return { id, name, label: /^\d+$/.test(short) ? `${this._t("temperature")} ${short}` : short };
      })
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
    const gauges = temps.map(({ id, name, label }) => {
      const v = num(this._s(id));
      return `<div class="gauge clickable ${level(v, 75, 90)}" data-entity="${id}" title="${esc(name)}">
        ${ring(v)}
        <div class="val"><b>${v === null ? "—" : `${Math.round(v)}°`}</b></div>
        <div class="lbl">${esc(label)}</div>
      </div>`;
    });
    const fans = box.fans.map(({ id, name }) => {
      const rpm = num(this._s(id));
      return `<div class="tile clickable" data-entity="${id}">${svgIcon(ICONS.fan, rpm ? "spin" : "")}<div><div class="k">${esc(
        name
      )}</div><div class="v">${rpm === null ? "—" : `${Math.round(rpm)} rpm`}</div></div></div>`;
    });
    return `<div>
      <div class="section-title">${svgIcon(ICONS.temp)}${this._t("system")}</div>
      ${gauges.length ? `<div class="gauges">${gauges.join("")}</div>` : ""}
      ${fans.length ? `<div class="tiles fans">${fans.join("")}</div>` : ""}
    </div>`;
  }

  _storage(box) {
    const rows = box.partitions.map((p) => {
      const free = num(this._s(p.id));
      const used = free === null ? null : Math.max(0, Math.min(100, 100 - free));
      const cls = level(used, 80, 90);
      return `<div class="part clickable ${cls}" data-entity="${p.id}">
        <div class="row"><span class="dot ${cls || "ok"}"></span><span class="grow">${esc(partitionLabel(this._hass, p))}</span>
          <span class="muted">${esc(p.device?.model || "")}</span></div>
        <div class="bar"><div style="width:${used ?? 0}%"></div></div>
        <div class="detail"><span>${used === null ? "—" : `${used.toFixed(0)}% ${this._t("used")}`}</span>
          <span>${free === null ? "" : `${free.toFixed(0)}% ${this._t("free")}`}</span></div>
      </div>`;
    });
    for (const id of box.raids) {
      const degraded = this._s(id)?.state === "on";
      rows.push(`<div class="row clickable" data-entity="${id}"><span class="dot ${degraded ? "crit" : "ok"}"></span>
        <span class="grow">${esc(shortName(this._hass, id, box.device))}</span>
        <span class="chip ${degraded ? "crit" : "ok"}">${this._t(degraded ? "raid_degraded" : "raid_ok")}</span></div>`);
    }
    if (!rows.length) return "";
    return `<div><div class="section-title">${svgIcon(ICONS.database)}${this._t("storage")}</div>${rows.join("")}</div>`;
  }

  _services(box) {
    const sc = box.scalars;
    const tiles = [];
    const wifi = this._s(sc.wifi);
    if (wifi) {
      const on = wifi.state === "on";
      tiles.push(`<div class="tile svc clickable ${on ? "ok" : ""}" data-entity="${wifi.entity_id}">${svgIcon(
        on ? ICONS.wifi : ICONS.wifi_off
      )}<div><div class="k">${this._t("wifi")}</div><div class="v">${this._t(on ? "on" : "off")}</div></div></div>`);
    }
    const missed = this._s(sc.missed);
    if (missed) {
      const n = num(missed) ?? 0;
      tiles.push(`<div class="tile svc clickable ${n > 0 ? "warn" : ""}" data-entity="${missed.entity_id}">${svgIcon(
        n > 0 ? ICONS.phone_missed : ICONS.phone
      )}<div><div class="k">${this._t("calls")}</div><div class="v">${n} ${this._t("missed")}</div></div></div>`);
    }
    if (box.trackers.length) {
      const home = box.trackers.filter((id) => this._s(id)?.state === "home").length;
      tiles.push(`<div class="tile svc ok"><span>${svgIcon(ICONS.devices)}</span><div><div class="k">${this._t(
        "devices_short"
      )}</div><div class="v">${home} / ${box.trackers.length}</div></div></div>`);
    }
    if (!tiles.length) return "";
    return `<div><div class="section-title">${svgIcon(ICONS.services)}${this._t("services")}</div><div class="tiles">${tiles.join(
      ""
    )}</div></div>`;
  }
}

// ---------------------------------------------------------------------------
// Mini card
// ---------------------------------------------------------------------------

const MINI_STYLE = `
  .header { padding: 12px 12px 4px; }

  .box-link { max-width: 35%; }
  .box { height: 44px; }
  .name { font-size: 16px; }
  .content { padding: 4px 12px 12px; display: flex; flex-direction: column; gap: 8px; }
  .grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .tile { padding: 6px 8px; gap: 8px; }
  .tile .v { font-size: 14px; }
  .foot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 4px 8px; font-size: 12px;
          color: var(--secondary-text-color); margin-top: 2px; }
  .foot span { display: inline-flex; align-items: center; gap: 3px; }
  .foot .icon { width: 14px; height: 14px; }
  .foot .ok .icon { color: var(--fb-ok); } .foot .warn { color: var(--fb-warn); } .foot .crit { color: var(--fb-crit); }
`;

class FreeboxMiniCard extends FreeboxBase {
  static getConfigElement() {
    return document.createElement("freebox-mini-card-editor");
  }

  static getStubConfig(hass) {
    return FreeboxCard.getStubConfig(hass);
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { columns: 6, min_columns: 6 };
  }

  _render() {
    const box = discover(this._hass, this._config.box);
    if (!box.id) return this._noBox();
    const c = this._config;
    const sc = box.scalars;
    const parts = [];
    if (c.show_network !== false && (sc.rate_down || sc.rate_up)) {
      const tile = (id, cls, icon, k) =>
        `<div class="tile clickable ${cls}" data-entity="${id || ""}">${svgIcon(icon)}<div><div class="k">${k}</div><div class="v">${this._rate(
          id
        )}</div></div></div>`;
      parts.push(`<div class="grid2">${tile(sc.rate_down, "down", ICONS.down, this._t("download"))}${tile(
        sc.rate_up,
        "up",
        ICONS.up,
        this._t("upload")
      )}</div>`);
    }
    const foot = [];
    const router = this._s(sc.router);
    if (router) {
      const online = router.state === "home";
      foot.push(`<span class="clickable ${online ? "ok" : "crit"}" data-entity="${router.entity_id}"><span class="dot"></span>&nbsp;${esc(
        String(router.attributes.connection_type || this._t(online ? "online" : "offline")).toUpperCase()
      )}</span>`);
    }
    if (c.show_system !== false && box.temps.length) {
      let hottest = null;
      for (const tmp of box.temps) {
        const v = num(this._s(tmp.id));
        if (v !== null && (!hottest || v > hottest.v)) hottest = { v, id: tmp.id };
      }
      if (hottest)
        foot.push(`<span class="clickable ${level(hottest.v, 75, 90)}" data-entity="${hottest.id}">${svgIcon(ICONS.temp)}${Math.round(
          hottest.v
        )}°C</span>`);
    }
    const wifi = this._s(sc.wifi);
    if (wifi)
      foot.push(`<span class="clickable ${wifi.state === "on" ? "ok" : ""}" data-entity="${wifi.entity_id}">${svgIcon(
        wifi.state === "on" ? ICONS.wifi : ICONS.wifi_off
      )}${this._t("wifi")}</span>`);
    const missed = this._s(sc.missed);
    if (missed && (num(missed) ?? 0) > 0)
      foot.push(`<span class="clickable warn" data-entity="${missed.entity_id}">${svgIcon(ICONS.phone_missed)}${num(missed)}</span>`);
    const up = uptimeSec(router);
    if (up !== null) foot.push(`<span>${svgIcon(ICONS.timer)}${fmtUptime(up, this._hass, this._config)}</span>`);
    return `<style>${BASE_STYLE}${MINI_STYLE}</style>
      <ha-card>
        ${this._header(box, false)}
        <div class="content">
          ${parts.join("")}
          ${foot.length ? `<div class="foot">${foot.join("")}</div>` : ""}
        </div>
      </ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

class FreeboxEditorBase extends HTMLElement {
  static get toggles() {
    return [];
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const boxOptions = this._hass ? listBoxes(this._hass) : [];
    const tr = (k) => t(this._hass, this._config, k);
    return [
      {
        name: "box",
        selector: { select: { mode: "dropdown", custom_value: true, options: boxOptions } },
      },
      { name: "title", selector: { text: {} } },
      { name: "admin_url", selector: { text: { type: "url" } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "show_image", selector: { boolean: {} } },
          { name: "show_logo", selector: { boolean: {} } },
          ...this.constructor.toggles.map((name) => ({ name, selector: { boolean: {} } })),
        ],
      },
      {
        name: "rate_unit",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "bytes", label: tr("unit_bytes") },
              { value: "bits", label: tr("unit_bits") },
            ],
          },
        },
      },
      {
        name: "language",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "", label: tr("lang_auto") },
              { value: "en", label: "English" },
              { value: "fr", label: "Français" },
            ],
          },
        },
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => t(this._hass, this._config, s.name);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const config = { ...ev.detail.value };
        for (const [k, v] of Object.entries(config)) {
          // Keep the YAML minimal: drop empty values and options left at their default.
          if (v === "" || v === undefined || v === null || (k.startsWith("show_") && v === true) || (k === "rate_unit" && v === "bytes"))
            delete config[k];
        }
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { rate_unit: "bytes", ...this._config };
    for (const name of ["show_image", "show_logo", ...this.constructor.toggles]) if (data[name] === undefined) data[name] = true;
    if (!data.box && this._hass) data.box = listBoxes(this._hass)[0]?.value;
    this._form.hass = this._hass;
    this._form.data = data;
    this._form.schema = this._schema();
  }
}

class FreeboxCardEditor extends FreeboxEditorBase {
  static get toggles() {
    return ["show_network", "show_system", "show_storage", "show_services"];
  }
}

class FreeboxMiniCardEditor extends FreeboxEditorBase {
  static get toggles() {
    return ["show_network", "show_system"];
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("freebox-card", FreeboxCard);
define("freebox-mini-card", FreeboxMiniCard);
define("freebox-card-editor", FreeboxCardEditor);
define("freebox-mini-card-editor", FreeboxMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "freebox-card",
    name: "Freebox Card",
    description: "Monitor a Freebox: download / upload, temperatures, fans, storage, Wi-Fi, calls and connected devices.",
  },
  {
    type: "freebox-mini-card",
    name: "Freebox Mini Card",
    description: "Compact Freebox overview: download / upload, connection, temperature, Wi-Fi and uptime.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type))
    window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-freebox-card" });
}

console.info(
  `%c FREEBOX-CARD %c v${VERSION} `,
  "color: white; background: #cd1e25; font-weight: 700;",
  "color: #cd1e25; background: white; font-weight: 700;"
);
