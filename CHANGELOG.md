# Changelog

## 1.0.0

First release of the Freebox cards for Home Assistant, built for the [Freebox integration](https://www.home-assistant.io/integrations/freebox/).

| Freebox Card | Freebox Mini Card |
|---|---|
| ![freebox-card](https://raw.githubusercontent.com/juju35/ha-freebox-card/main/screenshots/card.png) | ![freebox-mini-card](https://raw.githubusercontent.com/juju35/ha-freebox-card/main/screenshots/mini-card.png) |

### ✨ Features

- **Freebox Card** (`custom:freebox-card`): model and firmware, connection status and type, download / upload rates, public IP and uptime, temperature gauges, fans, disk partitions and RAID status, Wi-Fi, missed calls and connected devices.
- **Freebox Mini Card** (`custom:freebox-mini-card`): compact overview with download / upload, connection, hottest temperature, Wi-Fi, missed calls and uptime.
- **Automatic discovery** of the integration entities through the entity registry (translation keys): no entity to pick, translated entity ids and several Freebox supported.
- **Visual editor** for both cards: Freebox, title, sections to display, rate unit (bytes or bits) and language.
- Orange / red colors when temperatures or disk usage cross a threshold.
- Click any value to open its history (more-info dialog).
- Light and dark mode, English and French.
- Single file with no external dependency, the Freebox picture and the Free logo are embedded.

### 📦 Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=juju35&repository=ha-freebox-card&category=plugin)

Open the link above (or add `https://github.com/juju35/ha-freebox-card` as a **Dashboard** custom repository in HACS), click **Download**, then reload your browser. Manual install: copy `freebox-card.js` from the assets below to `/config/www/` and add `/local/freebox-card.js` as a JavaScript Module resource.

### 🚀 Quick start

```yaml
type: custom:freebox-card
```

```yaml
type: custom:freebox-mini-card
```

All options are described in the [README](https://github.com/juju35/ha-freebox-card#configuration).
