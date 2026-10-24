# PCNS NFC setup and troubleshooting

## Recommended: store a PCNS anchor URL on each tag

PCNS uses a stable link such as:

`https://niha4rika15-eng.github.io/Local_mapping_system-emergent-VScode/?anchor=lm_XXXXXXXX`

The exact URL is generated from the saved landmark's ID. Do not type the placeholder above literally.

1. Open the published PCNS site in the browser you will use at the campus.
2. Sign in to Admin and add a landmark with the correct coordinates and floor. Save it.
3. In **Saved landmarks**, choose **Copy NFC link**. Keep the URL associated with that physical tag/landmark.
4. On a Web NFC-capable Android browser, choose **Write tag** and hold a writable, NDEF-compatible tag near the phone when prompted. After the write succeeds, tap the tag and verify the correct anchor opens.
5. On iPhone, open the Shortcuts app, edit the automation for that physical tag, and set its **Open URLs** action to the copied PCNS link for that landmark. iOS Safari does not expose the Web NFC API to ordinary websites, so the OS-level Shortcut is the supported workaround.
6. When prompted, confirm the anchor to enter Indoor mode.

## Important constraints

- The web page cannot read arbitrary NFC chip UIDs on every browser. Web NFC reads NDEF records and is available only in compatible browsers. Legacy UID mappings remain supported where the browser exposes a serial number, but the preferred identifier is a PCNS URL or JSON payload.
- A tag must be writable and NDEF-compatible to be programmed by the browser's **Write tag** action. Some access cards, locked tags, or non-NDEF tags cannot be written this way.
- iPhone Shortcuts automations are configured per physical tag. The website does not receive the tag's UID from Shortcuts; the chosen URL carries the landmark ID instead.
- This GitHub Pages build stores landmarks and calibration data in each browser's local storage. Import the same JSON backup in every browser/device used for tag links. The static build does not include a configured cloud database.
- If Android displays **Direct NFC scan unavailable**, open the site in Google Chrome directly (not an in-app browser), enable NFC in Android settings, grant site permissions, and use a writable NDEF tag. For a browser without Web NFC, a URL tag opens the anchor page at the operating-system level without the in-page scanner.

## Troubleshooting messages

- **Direct NFC scan unavailable**: `NDEFReader` is not available to the current browser. This is browser support, not proof that the tag is broken.
- **NFC permission required**: allow NFC permission and retry.
- **Tag read, anchor missing**: the tag was read, but PCNS could not match its URL, text, JSON payload, or legacy UID to a saved landmark. Use **Write tag** or update the tag payload.
- **Anchor not available on this device**: import the JSON backup containing the same landmark ID, then scan the tag/open its URL again.
