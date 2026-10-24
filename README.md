# PCNS — Precision Campus Navigation System

PCNS is a mobile-responsive campus-navigation prototype built with vanilla JavaScript and Leaflet. It combines outdoor GPS, saved campus landmarks, NFC anchor handoff, indoor pedestrian dead reckoning (PDR), floor-aware display, and manual map-training markers.

## Improvements in this package

- **Cross-platform anchor links:** Web NFC can read/write NDEF URL records where supported. Every saved landmark can generate a stable `?anchor=<landmark-id>` URL. Use that URL in iPhone Shortcuts' NFC automation where direct Web NFC is unavailable.
- **Better scan diagnostics:** The app distinguishes unsupported browser APIs, insecure context, permissions, unreadable NDEF, and tags that do not match a saved anchor.
- **Tag setup tools:** Admin → Saved landmarks provides **Start here**, **Copy NFC link**, and **Write tag** actions. Existing UID matching remains supported as a legacy fallback.
- **Portable map backup:** Export/import a JSON bundle containing landmarks and calibration data so the same anchor IDs can be installed in each browser/device.
- **Supervised step-length regression:** Admin → Personalized PDR model accepts measured walks and fits a least-squares stride model. The learned coefficient is used by subsequent PDR steps and is persisted locally.
- **Tests and docs:** `tests/pcns-ml.test.cjs`, `docs/NFC_SETUP.md`, and `docs/ML_CALIBRATION.md`.

## Run locally

Requirements: Node.js and npm.

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`. Browser APIs such as geolocation, motion sensors, and Web NFC require compatible devices, permissions, and generally HTTPS or localhost. The public GitHub Pages deployment is already an HTTPS secure context.

Run the regression-model tests:

```bash
cd frontend
npm test
```

## Use real NFC tags

1. Add a saved landmark with its verified coordinates and floor in Admin.
2. In Saved landmarks, choose **Write tag** from a Web NFC-compatible Android browser and hold a writable NDEF tag near the phone. Or choose **Copy NFC link** and use a compatible NFC-writing app.
3. For an iPhone, configure the Shortcuts NFC automation for that physical tag to open the copied PCNS link. iOS Safari does not expose the Web NFC API to websites, so the OS-level Shortcut is the intended fallback.
4. Tap the tag or open its link. Confirm the matched anchor to enter indoor mode.
5. If using more than one browser/device, export the JSON backup from Admin and import it on the other device before using its anchor links.

Read [`docs/NFC_SETUP.md`](docs/NFC_SETUP.md) for supported-tag requirements and troubleshooting details.

## Train the PDR step-length model

The included model is a supervised linear regression that estimates distance from the detected step count:

`distance_m = learned_stride_length_m × detected_steps`

Walk a measured, straight route on a single floor and record detected steps and measured distance. Add at least two calibration samples in Admin and press **Train model**. Validate against a separate measured route. See [`docs/ML_CALIBRATION.md`](docs/ML_CALIBRATION.md).

This is a genuine, interpretable calibration model, but it is **not** a fully learned indoor-positioning model. A complete localization model needs a labelled sensor dataset (ground-truth positions synchronized with acceleration, gyroscope, heading, step, floor, and device information) and held-out validation trajectories.

## Persistence and security

- Landmarks, settings, markers, and the calibration model are stored in the current browser's `localStorage`. They are not synchronized between devices and are not automatically backed up. JSON import/export is the current transfer mechanism.
- The backend is still an optional health-check-only FastAPI service; no cloud database is configured. The GitHub Pages frontend remains static.
- The browser-side admin password is only a convenience gate, not secure authentication. Do not store sensitive information or treat the current client-side gate as a security boundary.
- The bundled `demo-floor.geojson` is illustrative E-Block demo geometry, not a surveyed floor plan. Verify campus coordinates, floor-plan geometry, anchor placement, and route measurements before relying on it for real navigation.
- PDR heading/step detection depends on device sensors and can drift. Hallway snapping is a visual correction, not indoor route finding or turn-by-turn guidance.

## Project layout

- `frontend/public/index.html` — application shell
- `frontend/public/pcns.css` — responsive UI styles
- `frontend/public/pcns.js` — outdoor GPS, NFC, PDR, training, storage, and admin logic
- `frontend/public/pcns-ml.js` — supervised step-length regression model
- `frontend/public/pcns-nfc.js` — tested NDEF text/URI decoder helpers
- `frontend/public/demo-floor.geojson` — sample floor geometry
- `backend/server.py` — optional API health check
- `docs/` — NFC and model-training guides
- `tests/` — ML regression and NDEF decoder tests
