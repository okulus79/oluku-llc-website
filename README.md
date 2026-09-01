# Oluku LLC Global Logistics — Website + Mobile App Starter

This package contains:
- `website/`: responsive business website and installable PWA.
- `mobile-app/`: Expo/React Native starter for an iOS/Android app.

Security & deploy guidance: see [SECURITY_AND_DEPLOY.md](C:/Users/lukem/Downloads/Oluku_LLC_Website_and_App_Starter/SECURITY_AND_DEPLOY.md) for immediate token revocation steps, how to create minimal-scope GitHub tokens, and secure deploy instructions using the included scripts.

## Website
Open `website/index.html` in a browser, or deploy the `website` folder to a static host.

This repository is already configured for static deploys to Netlify/Vercel from the repo root:
- `netlify.toml` publishes the `website/` directory
- `vercel.json` uses `website/` as the output directory
- `website/package.json` includes a local preview command for public-facing testing

The website includes:
- Oluku-branded navy/gold visual system
- Services section
- Quote request form UI
- Shipment tracking UI (demo until connected to a carrier/TMS API)
- Contact section
- Mobile navigation
- PWA manifest + service worker

## Mobile app
Install Node.js and Expo, then from `mobile-app` run one of the following (pick the command that matches your OS and shell):

For macOS / Linux:
`npm install`
`npx expo start`

For Windows PowerShell (to avoid script execution policy errors):
`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; cd "mobile-app"; npm install; .\\node_modules\\.bin\\expo.cmd start`

Tip: Using the local CLI binary (\\node_modules\\.bin\\expo.cmd) avoids PowerShell wrapper issues when npx or global expo are blocked by policy.

Restarting the dev server
- macOS / Linux
  1) cd mobile-app
  2) npm install (if dependencies changed)
  3) npx expo start --web --port 19006

- Windows (PowerShell - recommended)
  1) Open PowerShell and run:
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  2) cd "C:\\path\\to\\Oluku_LLC_Website_and_App_Starter\\mobile-app"
  3) npm install (if dependencies changed)
  4) .\\node_modules\\.bin\\expo.cmd start --web --port 19006

- Quick Windows helper (already included in this repo):
  Run `mobile-app\start-expo-windows.cmd` to start the Expo web server using the project-local CLI and a temporary process-scoped policy bypass.

Notes
- If PowerShell blocks script execution for npx/npm wrappers, the process-scoped Set-ExecutionPolicy command above lets the current session run the local expo wrapper without changing system policy.
- If Metro reports cache or TypeScript errors after dependency changes, restart with `expo start --web --clear` to rebuild caches.

## Production integrations to add
1. Connect quote form to a business email/CRM.
2. Connect tracking to the chosen carrier/TMS API.
3. Add payment/invoicing if customers will pay online.
4. Add customer accounts and shipment history.
5. Add push notifications for shipment milestones.
6. Replace demo tracking status with real shipment events.
7. Point `www.olukullic.com` to the deployed website.

Brand/contact details used in this prototype are based on the supplied Oluku LLC flyer.
