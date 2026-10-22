# Changelog

## 1.5.2

### Maintenance
- Tooling only, no functional change: Biome linting, pre-commit and a Lint CI (duplication checks). Card source modernized (optional chaining, template literals), identical behavior.

## 1.5.1

### Changes
- The mini card gets the button too: a small check next to the missed calls count in its footer marks them as read.

## 1.5.0

### New
- A check button on the calls tile marks the missed calls as read: it presses the Freebox integration's **Mark calls as read** button and only shows when there are missed calls. The rest of the tile still opens the missed calls sensor.

### Changes
- The service tiles size to their content, so "2 manqués" keeps room next to the button.

## 1.4.0

### Changes
- More compact layout with the same information, like the other ha-* cards: 12 px card padding, 36 px header icon, 16 px name and 12 px subtitle, 11 px pills, tighter tiles and sections.
- Box picture 64 → 48 px, Free logo tile 36 px, temperature gauges 64 → 52 px; storage on one line with its bar underneath.
- The mini card picks up the smaller pills and subtitle.

## 1.3.0

### Changes
- The Free logo sits in a 40 px tile left of the title, like the logos of the other ha-* cards, instead of above it.
- HACS now asks for Home Assistant 2024.8 or later, the version that brought the sections view the card supports; the README says so under **Prerequisites**.

### Fixes
- "Uptime: 10 d" in English, without the French space before the colon.

### Maintenance
- CHANGELOG headings use the same plain English set as the other ha-* repositories.

## 1.2.0

### Changes
- The warning color falls back to Home Assistant's default `#ffa600` (was `#ffa000`), like the other ha-* cards. The upload tile uses `--info-color` instead of a fixed blue.

### Development
- The built card is no longer committed in `dist/`: CI builds it on every push, and the release workflow builds it and attaches it to the release, which is where HACS downloads it from.
- Releases are published when `version` in `package.json` has no tag yet: bump the version, add its CHANGELOG section and push, like the other ha-* repositories (the manual Release workflow run is no longer needed).
- Issue templates, and stale, release notes and merged-branch cleanup workflows, shared with the other repositories.

## 1.1.1

### Maintenance
- Validate workflow and README badges aligned with the other ha-* repositories. Nothing changes for users.

## 1.1.0

### What's new
- Click the Free logo to open [free.fr](https://www.free.fr), and the Freebox picture to open the Freebox OS admin interface (in a new tab).
- New `admin_url` option (also in the visual editor) to change the Freebox OS address, `https://mafreebox.freebox.fr` by default.

## 1.0.0

First release of the Freebox cards for Home Assistant, built for the [Freebox integration](https://www.home-assistant.io/integrations/freebox/).

| Freebox Card | Freebox Mini Card |
|---|---|
| ![freebox-card](https://raw.githubusercontent.com/juju35/ha-freebox-card/main/screenshots/card.png) | ![freebox-mini-card](https://raw.githubusercontent.com/juju35/ha-freebox-card/main/screenshots/mini-card.png) |

### What's new
- **Freebox Card** (`custom:freebox-card`): model and firmware, connection status and type, download / upload rates, public IP and uptime, temperature gauges, fans, disk partitions and RAID status, Wi-Fi, missed calls and connected devices.
- **Freebox Mini Card** (`custom:freebox-mini-card`): compact overview with download / upload, connection, hottest temperature, Wi-Fi, missed calls and uptime.
- **Automatic discovery** of the integration entities through the entity registry (translation keys): no entity to pick, translated entity ids and several Freebox supported.
- **Visual editor** for both cards: Freebox, title, sections to display, rate unit (bytes or bits) and language.
- Orange / red colors when temperatures or disk usage cross a threshold.
- Click any value to open its history (more-info dialog).
- Light and dark mode, English and French.
- Single file with no external dependency, the Freebox picture and the Free logo are embedded.

### Installation
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=juju35&repository=ha-freebox-card&category=plugin)

Open the link above (or add `https://github.com/juju35/ha-freebox-card` as a **Dashboard** custom repository in HACS), click **Download**, then reload your browser. Manual install: copy `freebox-card.js` from the assets below to `/config/www/` and add `/local/freebox-card.js` as a JavaScript Module resource.

### Quick start
```yaml
type: custom:freebox-card
```

```yaml
type: custom:freebox-mini-card
```

All options are described in the [README](https://github.com/juju35/ha-freebox-card#configuration).
