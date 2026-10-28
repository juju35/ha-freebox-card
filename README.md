# ha-freebox-card

[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![HACS Validation](https://github.com/juju35/ha-freebox-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-freebox-card/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-freebox-card/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-freebox-card/actions/workflows/validate.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-freebox-card)](https://github.com/juju35/ha-freebox-card/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center"><img src="images/free.png" alt="Free" width="160"></p>

Lovelace cards for Home Assistant to monitor an internet box at a glance: download / upload rates, connection, temperatures, fans, storage, Wi-Fi, missed calls and connected devices. Built for the Freebox, with discovery for the Livebox (Orange), SFR Box and Bbox (Bouygues) integrations too — each section shows only what its integration exposes.

The cards are built on top of the [Freebox integration](https://www.home-assistant.io/integrations/freebox/) of Home Assistant: entities are **discovered automatically**, you don't have to pick them one by one.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=juju35&repository=ha-freebox-card&category=plugin)

| Freebox Card | Freebox Mini Card |
|---|---|
| ![freebox-card](https://raw.githubusercontent.com/juju35/ha-freebox-card/main/screenshots/card.png) | ![freebox-mini-card](https://raw.githubusercontent.com/juju35/ha-freebox-card/main/screenshots/mini-card.png) |

## Features

- Two cards: a full **Freebox Card** and a compact **Freebox Mini Card**
- Detail button at the top right of the mini card: it shows the full Freebox card in its place (same Freebox and options), and the collapse button, or a click anywhere outside the card, brings the compact view back (`zoom: false` removes it)
- Automatic discovery of the Freebox integration entities, whatever the language of the entity ids (several Freebox supported)
- Picture and commercial name of the Freebox model (Ultra, Pop, Delta, Revolution, mini 4K), detected automatically or set with the `model` option, and firmware version
- Connection status and type (FTTH, xDSL…), public IPv4 (IPv6 on hover) and uptime
- Download / upload rates, in bytes (kB/s, MB/s) or bits (kb/s, Mb/s)
- Temperature gauges and fans speed
- Storage: free space of the disk partitions and RAID status
- Services: Wi-Fi state, missed calls and connected devices (the mini card footer always shows the missed calls, orange when there are some)
- A check button next to the missed calls (calls tile, mini card footer) marks them as read (the integration's **Mark calls as read** button), shown only when there are missed calls
- A restart button at the top right of the full card reboots the Freebox (the integration's **Reboot** button), after a confirmation popup; shown only when the integration exposes it
- Colors turn orange / red when a threshold is crossed (temperatures, disk usage, missed calls)
- Click any value (except the connected devices count, a total over several trackers) to open its Home Assistant history (more-info dialog)
- Click the Free logo to open free.fr, and the Freebox picture to open the Freebox OS admin interface
- Visual editor in the dashboard UI for both cards (no YAML needed)
- Light and dark mode, English and French
- Single file, no external dependency, the Freebox pictures and the Free logo are embedded

## Prerequisites

Home Assistant 2024.8 or later, and:

The [Freebox integration](https://www.home-assistant.io/integrations/freebox/) must be configured (it is built into Home Assistant: **Settings → Devices & services → Add integration → Freebox**).

The connected devices count uses the `device_tracker` entities of the integration, which are disabled by default: enable the ones you want to follow.

## Installation

### Via HACS (recommended)

Click the button below to add the repository directly:

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=juju35&repository=ha-freebox-card&category=plugin)

Then click **Download**, and reload your browser when HACS asks you to.

Or manually:

1. Open HACS → **⋮** (top right) → **Custom repositories**
2. Add `https://github.com/juju35/ha-freebox-card` — Type: **Dashboard**
3. Search for **Freebox Card** and click **Download**
4. Clear your browser cache and refresh

### Manual

1. Download `freebox-card.js` from the [latest release](https://github.com/juju35/ha-freebox-card/releases/latest)
2. Copy it to `/config/www/freebox-card.js`
3. Go to **Settings → Dashboards → ⋮ → Resources** → Add resource:
   - URL: `/local/freebox-card.js`
   - Type: **JavaScript Module**
4. Clear your browser cache and refresh

## Configuration

### Visual editor

Edit a dashboard, click **Add card** and search for **Freebox Card** or **Freebox Mini Card**. The Freebox is preselected; pick another one in the list if you have several, set an optional title, choose the sections to display, the rate unit and the language. The preview updates live, and options left at their default are kept out of the generated YAML.

### Minimal

```yaml
type: custom:freebox-card
```

```yaml
type: custom:freebox-mini-card
```

### Full options

```yaml
type: custom:freebox-card
box: 0123456789abcdef0123456789abcdef
title: My Freebox
model: delta
admin_url: https://mafreebox.freebox.fr
show_image: true
show_logo: true
show_network: true
show_system: true
show_storage: true
show_services: true
rate_unit: bits
language: fr
```

```yaml
type: custom:freebox-mini-card
box: 0123456789abcdef0123456789abcdef
title: My Freebox
model: delta
admin_url: https://mafreebox.freebox.fr
show_image: true
show_logo: true
show_network: true
show_system: true
zoom: true
rate_unit: bits
language: fr
```

### Options reference

| Option | Card | Default | Description |
|---|---|---|---|
| `box` | both | First Freebox found | Freebox to display: its device id (only needed with several Freebox, pick it in the visual editor) |
| `title` | both | Freebox model | Card title |
| `model` | both | Detected | Box model, for its picture and the default title. Freebox: `ultra`, `pop`, `delta`, `revolution`, `mini_4k`; Livebox, SFR Box and Bbox models in [Supported models](#supported-models). Needed for the Bbox, whose integration exposes no model |
| `admin_url` | both | `https://mafreebox.freebox.fr` | Freebox OS address opened when clicking the Freebox picture (for example `http://192.168.1.254`) |
| `show_image` | both | `true` | Show the Freebox picture |
| `show_logo` | both | `true` | Show the Free logo (opens free.fr when clicked) |
| `show_network` | both | `true` | Download / upload rates (and IPv4, uptime on the full card) |
| `show_system` | both | `true` | Temperatures and fans (hottest temperature on the mini card) |
| `show_storage` | full | `true` | Disk partitions and RAID status |
| `show_services` | full | `true` | Wi-Fi, missed calls and connected devices |
| `zoom` | mini | `true` | Detail button at the top right: shows the full card (every section) in place of the mini card, and back |
| `rate_unit` | both | `bytes` | Rates unit: `bytes` (kB/s, MB/s) or `bits` (kb/s, Mb/s) |
| `language` | both | Auto | Force language: `fr` or `en` (auto-detects from HA settings) |

## Supported models

The models supported by the [Freebox integration](https://www.home-assistant.io/integrations/freebox/) (Freebox OS). The model is detected from the Freebox device (model id such as `fbxgw9-r1`); set `model` to force another picture, for example when the detection fails. Without a detected model or `model` option, the card shows the Freebox Ultra picture.

| Freebox Ultra | Freebox Pop | Freebox Delta | Freebox Revolution | Freebox mini 4K |
|:---:|:---:|:---:|:---:|:---:|
| <img src="images/freebox-ultra.svg" alt="Freebox Ultra" width="140"> | <img src="images/freebox-pop.svg" alt="Freebox Pop" width="140"> | <img src="images/freebox-delta.svg" alt="Freebox Delta" width="140"> | <img src="images/freebox-revolution.svg" alt="Freebox Revolution" width="140"> | <img src="images/freebox-mini-4k.svg" alt="Freebox mini 4K" width="140"> |
| `ultra` (v9) | `pop` (v8) | `delta` (v7) | `revolution` (v6) | `mini_4k` |

The card also discovers the Livebox (Orange), SFR Box and Bbox (Bouygues) integrations. The box pictures below are original stylised silhouettes (no brand logos). The Bbox integration exposes no device model, so set its picture with the `model` option.

### Livebox (Orange)

| Livebox 7 | Livebox 6 | Livebox 5 | Livebox 4 | Livebox S |
|:---:|:---:|:---:|:---:|:---:|
| <img src="images/livebox-7.svg" alt="Livebox 7" width="120"> | <img src="images/livebox-6.svg" alt="Livebox 6" width="120"> | <img src="images/livebox-5.svg" alt="Livebox 5" width="120"> | <img src="images/livebox-4.svg" alt="Livebox 4" width="120"> | <img src="images/livebox-s.svg" alt="Livebox S" width="120"> |
| `livebox_7` | `livebox_6` | `livebox_5` | `livebox_4` | `livebox_s` |

### SFR Box

| SFR Box 8 | SFR Box 7 | SFR Box (NB6VAC) |
|:---:|:---:|:---:|
| <img src="images/sfr-box-8.svg" alt="SFR Box 8" width="120"> | <img src="images/sfr-box-7.svg" alt="SFR Box 7" width="120"> | <img src="images/sfr-nb6vac.svg" alt="SFR Box NB6VAC" width="120"> |
| `sfr_box_8` | `sfr_box_7` | `sfr_nb6vac` |

### Bbox (Bouygues)

| Bbox Fibre | Bbox Ultym | Bbox Miami |
|:---:|:---:|:---:|
| <img src="images/bbox-fibre.svg" alt="Bbox Fibre" width="120"> | <img src="images/bbox-ultym.svg" alt="Bbox Ultym" width="120"> | <img src="images/bbox-miami.svg" alt="Bbox Miami" width="120"> |
| `bbox_fibre` | `bbox_ultym` | `bbox_miami` |

## Screenshots

While the box is running, the card animates: the cooling fan spins at its live speed. It settles to a still card when it stops (and honours `prefers-reduced-motion`).

![fan](screenshots/fan.gif)

| Light | Dark |
|---|---|
| ![card](screenshots/card.png) | ![card dark](screenshots/card-dark.png) |
| ![mini card](screenshots/mini-card.png) | ![mini card dark](screenshots/mini-card-dark.png) |
| ![mini card, detail view](screenshots/mini-card-zoom.png) | ![mini card dark, detail view](screenshots/mini-card-zoom-dark.png) |

The last row is the mini card after a click on its detail button (top right): the full card, with the collapse button in the same place.

## How it works

The cards read the entity and device registries of Home Assistant and keep the entities of the supported box integrations (`freebox`, `livebox`, `sfr_box`, `bbox`). Each box's sensors are recognized by their integration's own translation keys (for the Freebox: `rate_down`, `rate_up`, `missed`, `wifi`, `partition_free_space`, `raid_degraded`), so entity ids translated in another language (for example `sensor.freebox_vitesse_de_telechargement`) and renamed entities are supported; the Bbox, whose integration uses no translation keys, is matched by entity-id instead. The box picture and the header name, colour and links follow the detected operator.

The Freebox itself is the device of the download speed sensor. Temperature and fan sensors, named by the Freebox, are recognized by their `temperature` device class and `rpm` unit, disk partitions by their parent device, and connected devices by the config entry they share with the Freebox (with a single Freebox, the connected devices trackers that have no device, the default of the integration, are counted too). The **Mark calls as read** and **Reboot** buttons are found by their translation key (the reboot button also by its `restart` device class). The connection type, IP addresses and uptime come from the attributes of the Freebox `device_tracker`. The integration gives the boot date without a time zone, in the system time zone of the Home Assistant process, and the card reads it in the time zone of Home Assistant (**Settings → System → General**). Both match on Home Assistant OS and Supervised; in a Docker container, start Home Assistant with `TZ` set to the same time zone (for example `-e TZ=Europe/Paris`), otherwise the uptime is off by the UTC offset. When the registry is not available, English entity ids (`sensor.freebox_download_speed`…) are used as a fallback.

Thresholds:

| Value | Orange | Red |
|---|---|---|
| Temperatures | 75 °C | 90 °C |
| Disk usage | 80 % | 90 % |
| Missed calls | 1 | — |

## Development

```bash
npm install
npm run build        # bundles src/freebox-card.js + images/free.webp into dist/freebox-card.js
npm run check        # builds and checks the card (run in CI)
npm run screenshots  # renders the cards with mock data (scripts/mock-states.mjs) into screenshots/ (and fan.gif, needs ffmpeg)
```

`dist/` is not committed: `npm run build` creates it locally, CI builds it on every push, and the release workflow attaches the built file to the release, which is where HACS downloads it from.

### Releasing

1. Bump `version` in `package.json`
2. Add a `## <version>` section at the top of [CHANGELOG.md](CHANGELOG.md)
3. Push to `main`: the **Release** workflow builds the card, creates the tag and the GitHub release with the changelog section as notes, and attaches `freebox-card.js`

## Translations

The cards auto-detect the language from your Home Assistant settings. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |

Contributions for additional languages are welcome!

## License

[MIT](LICENSE)

Free and Freebox are trademarks of Free SAS. This project is not affiliated with Free.
