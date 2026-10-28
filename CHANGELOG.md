# Changelog

## 1.22.0 - 2026-10-28

### Changes
- **SFR Box pictures**: original stylised drawings of the SFR Box 8 (rounded cube with a glossy top and a mesh body), the SFR Box 7 (tall slim upright mesh box on a foot) and the NB6VAC / Box Plus/Power (low, wide, glossy box with a status-light column and a ventilation grille), detected from the device model. Stylised originals, no logos.

## 1.21.0 - 2026-10-28

### Fixes
- **Realistic Livebox pictures**: redrawn to match each model — the Livebox 6 and 7 are now dark anthracite upright boxes with a flat top, a fabric-effect finish, an orange status light line (the 7 adds a white dot) and a front screen; the Livebox 4 is a dark box with a rounded top and a front display; the Livebox 5 a light upright box; the Livebox S a small light box.

## 1.20.0 - 2026-10-28

### Changes
- **Livebox (Orange) support with per-model pictures**: the card now draws the Livebox models (4, 5, 6, 7, S) as original stylised pictures and shows its download / upload rate, Wi-Fi, missed calls (with a clear button) and reboot, with the Orange accent colour. The rate sensors are the line sync rate the integration exposes.

## 1.19.0 - 2026-10-28

### Changes
- **Other operators are now discovered** (foundation for multi-operator support): the cards recognise the Livebox (Orange, `livebox`), SFR Box (`sfr_box`) and Bbox (Bouygues, `bbox`) integrations in addition to the Freebox, each from its own entity keys (or entity-id patterns for the Bbox). The header adopts the detected operator's name, accent colour and admin/website links, with a tinted generic box icon when no brand logo is available. Freebox behaviour is unchanged. Per-model box pictures for the new operators come next.

## 1.18.0 - 2026-10-27

### Changes
- **Status pill moves under the title on narrow cards**: on a narrow full card (or zoomed mini) the "Online · FTTH" pill now drops below the title instead of squeezing it on the same line, so the Freebox name stays fully readable while the picture remains visible. On wider cards the pill stays on the title line as before.

## 1.17.0 - 2026-10-27

### Fixes
- **Wi-Fi no longer shown twice on the full card**: the Wi-Fi chip under the title duplicated the Services section's Wi-Fi tile. The chip is now shown only when the Services section is hidden (`show_services: false`); otherwise the Services tile is the single Wi-Fi indicator.

## 1.16.0 - 2026-10-27

### Fixes
- **Expanded view always shows the Freebox picture**: on the full card (and the zoomed mini) the picture now only shrinks on narrow cards and is never hidden, so it stays visible whenever the card is expanded. The title may be shortened on very narrow cards instead.

## 1.15.0 - 2026-10-27

### Fixes
- **Mini card keeps its Freebox picture**: the narrow-card rule that shrinks then hides the picture now applies only to the full card (and the zoomed mini), whose header also carries the status pill and restart button. The compact mini card — which has neither — always shows the picture again.

## 1.14.0 - 2026-10-27

### Fixes
- **Header on narrow cards**: the Freebox picture now yields space before the title — it shrinks, then is hidden on the narrowest cards (container queries) — so the name and status pill stay readable instead of the title being truncated to a few letters when the restart button, status pill and picture share a tight header.

## 1.13.0 - 2026-10-27

### Changes
- **Restart button**: a round button at the top right of the full card reboots the Freebox (the integration's **Reboot** button), after a confirmation popup shown at the top of the card. It appears only when the integration exposes the reboot button, which is discovered by its translation key or its `restart` device class.

## 1.12.0 - 2026-10-26

### Fixes
- **Mini card**: the detail button now sits flush top-right and vertically centred on the header, matching the other cards (it was pinned to the top and pulled slightly left).

## 1.11.0 - 2026-10-26

### Fixes
- **README**: the screenshots table labelled its right column "Dark (French)", but `scripts/screenshots.mjs` renders every screenshot (light and dark) in English (`language: "en"`). The label is now simply "Dark" to match the images.

## 1.10.0
### Changes
- The Free logo tile in the header is 40 × 40 px on the full card (was 36 px) and 32 × 32 px on the mini card, like the header icon of the other cards; the logo stays left of the title.
- The status pill ("Online · FTTH") sits in the header row, right of the title and before the Freebox picture, instead of under the title; the Wi-Fi chip stays under the title. The Free logo is top-aligned.
- The subtitle no longer gets cut off next to the Freebox picture: when the device name and firmware do not fit on one line, the firmware goes to a second line.
- The status pill is centred on the title line, not on the whole title block, when the subtitle takes two lines.
- Header geometry: the body starts 8 px below the header on both cards (was 4 px), the logo 12 px from the card's top edge.

### Maintenance
- Browser test for the status pill position.

## 1.9.0

### Changes
- The Freebox pictures are drawn instead of photos (Ultra, Pop, Delta, Revolution, mini 4K): rounded boxes as an extruded top shape, square boxes in parallel projection, each with its details (Ultra and Pop "free" pill, Delta dot-matrix clock on its tall curved front, yellow 13/37 display of the Revolution and mini 4K, Revolution red tab). Sharp at any size.

### Maintenance
- The README shows the same drawings (`images/freebox-<model>.svg`, written by `npm run screenshots`); a test checks they match the card. Screenshots regenerated.

## 1.8.1

### Fixes
- **Freebox Mini Card**: the missed calls are always shown in the footer when the Freebox reports them, as on the Calls tile of the full card: plain phone icon at 0, orange with the count and the "mark as read" button when there are some (they were hidden at 0).

### Maintenance
- The full and mini cards share the missed calls chip logic; browser test of the chip at 0.

## 1.8.0

### New
- Detail button at the top right of the **Freebox Mini Card**: it shows the full Freebox card in place of the mini card (same Freebox and options, every section), and the collapse button brings the compact view back. A click anywhere outside the card folds it back too; a click inside it, or in a dialog opened from it (more-info), does not. From the keyboard, the focus stays on the button.
- `zoom` option of the mini card (on by default; `zoom: false` removes the button), with its switch in the visual editor (**Detail button**).
- The card size given to the dashboard follows the view shown.

### Maintenance
- Browser test of the detail button; screenshots of the zoomed-in mini card.

## 1.7.2

### Fixes
- Screen readers can reach the **Mark calls as read** button of the missed calls tile (full card) and of the missed calls in the mini card footer: it is no longer inside an element announced as a single button. The keyboard target is now the label of the missed calls; a click anywhere on the tile still opens the more-info dialog.

### Maintenance
- Browser test for the missed calls controls; the duplication check job runs on Node 22.

## 1.7.1

### Changes
- The README header no longer shows the Freebox Ultra picture, whatever the model: the pictures of every model are in the **Supported models** section.

## 1.7.0

### New
- Pictures of every Freebox model supported by the Freebox integration: Ultra, Pop, Delta, Revolution and mini 4K. The card shows the picture of the detected model instead of always the Freebox Ultra.
- `model` option (`ultra`, `pop`, `delta`, `revolution`, `mini_4k`) to choose the model, for its picture and the default title; in the visual editor, the **Freebox model** dropdown defaults to **Automatic** and shows the detected model.

## 1.6.1

### Changes
- Running Home Assistant in Docker: start the container with `TZ` set to the time zone of Home Assistant (for example `-e TZ=Europe/Paris`), otherwise the uptime is off by the UTC offset. The README now documents this limit (the integration gives the boot date without a time zone); Home Assistant OS and Supervised are not affected.
- The README explains that, with a single Freebox, "Devices x / y" also counts the client trackers that have no device of their own.

### Fixes
- When a list changes order (temperatures, fans, partitions, service tiles, mini card footer), the keyboard focus stays on the same item instead of landing on another row. In browsers that cannot move an element without losing its focus, the focus is dropped rather than moved to another row.
- The README screenshots show the right uptime.

### Maintenance
- Browser tests (Chromium) for the in-place updates, run in CI; screenshots taken with a fixed clock and a fresh page per capture; duplication check skips the tests.

## 1.6.0

### Fixes
- "Devices x / y" now counts the Freebox client trackers that have no device of their own (most of them), so the figure goes up to the real number of clients. With several Freeboxes, those trackers stay uncounted rather than counted twice.
- Uptime is no longer shifted when the browser is in another time zone than Home Assistant.

### Changes
- The card only re-renders when something it shows changes, and updates the page in place: keyboard focus, hover and text selection survive updates, the bars, rings and chevrons animate again, and the box pictures are not decoded again on every poll. The uptime still ticks every minute.
- Keyboard access: clickable tiles and gauges can be reached with Tab and opened with Enter or Space, with a visible focus outline.
- A failure of **Mark calls as read** is logged instead of raising an unhandled error.
- The README says that the devices count is the one value that does not open a more-info dialog.

### Maintenance
- CI hardened: actions pinned by commit SHA, read-only token permissions, Dependabot for action updates, duplication report annotated on pull requests.
- Unit tests (`npm test`, run in CI); discovery cached on the registries instead of being recomputed on every state change.

## 1.5.2

### Maintenance
- Tooling only, no functional change: Biome linting, pre-commit and a Lint CI (duplication checks). Card source modernized (optional chaining, template literals), identical behavior.

## 1.5.1

### Changes
- The mini card gets the button too: a small check next to the missed calls count in its footer marks them as read.

## 1.5.0

### What's new
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
