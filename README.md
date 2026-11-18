# PhoneLock static download website

This folder is a standalone static site. It contains only the landing page, its CSS/JavaScript, a favicon, and the PhoneLock Customer APK. It does not include the PhoneLock API server or sample customer records.

Visible website text animates one character at a time as it enters the viewport and repeats when visitors scroll away and back. The animation respects the visitor's reduced-motion preference.

The download in this folder is the exact **PhoneLock Customer 1.8** APK requested. Version 1.8 is older; the Play Store app uninstall issue was fixed in 1.9. The page warns visitors before they download 1.8.

The Firebase helper starts with blank fields. Values entered there are only used by the visitor's browser for copying; they are not saved or sent by the site. The live PhoneLock URL and API key are intentionally not embedded in this public website. Secure Firebase Database Rules before using live project settings.

## Preview locally

From this folder, run any static file server, for example:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000`.

## Free public hosting

For a temporary public URL without registering an account, run these in two PowerShell windows:

```powershell
py -m http.server 8000
cloudflared tunnel --url http://127.0.0.1:8000
```

Run the first command from this folder. Cloudflare prints a random `trycloudflare.com` address. The site is reachable only while both commands are running and this PC stays online; the address can change the next time it starts.

For a persistent free address, publish the contents of this folder through GitHub Pages or another static host. That requires an account with the selected provider. A custom address such as `namindu.xyz` also requires registering the domain; confirm its availability and cost with a registrar.

Do not expose the `www/` server as a public website; it has separate APIs. This folder is intentionally static and isolated.

## App disclosure

The page describes the Customer app's Device Owner pairing and control implications. Confirm the app permissions, customer agreement, and release process before distributing it. The download button points to `downloads/PhoneLock-customer-1.8.apk`; keep that relative path and filename unchanged when uploading.
