# Mobile Deployment Guide — Neubite Frontend

This guide covers running the Neubite frontend as a native iOS app using Capacitor and Xcode. No Android Studio or Java required.

---

## Prerequisites

- Mac with **Xcode** installed (download from the Mac App Store)
- **CocoaPods** installed:
  ```bash
  sudo gem install cocoapods
  ```
- Node.js 20+
- Backend running and accessible (locally or via ALB URL)

---

## Phase 1 — Configure the Backend URL

The iOS simulator can reach your Mac's localhost directly. Update `neubite.frontend/.env` before building:

**For local backend (simulator testing):**
```
VITE_AI_API_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000/api
```

**For production backend (AWS ALB):**
```
VITE_AI_API_URL=http://neubite-alb-xxxx.us-east-2.elb.amazonaws.com/api
VITE_API_URL=http://neubite-alb-xxxx.us-east-2.elb.amazonaws.com/api
```

> Note: For a real device (not simulator), `localhost` won't work — you must use the ALB URL or your Mac's local network IP (`http://192.168.x.x:3000/api`).

---

## Phase 2 — Install Capacitor

Run these inside the `neubite.frontend` directory:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

---

## Phase 3 — Initialise Capacitor

```bash
npx cap init neubite com.neubite.app --web-dir dist
```

This creates a `capacitor.config.ts` file at the root of the frontend.

---

## Phase 4 — Add iOS Platform

```bash
npx cap add ios
```

This creates the `ios/` folder with the native Xcode project inside.

---

## Phase 5 — Build and Sync

Every time you make frontend changes, run:

```bash
npm run build
npx cap sync
```

- `npm run build` — compiles React/Vite into `dist/`
- `npx cap sync` — copies `dist/` into the native iOS project and updates plugins

---

## Phase 6 — Open in Xcode

```bash
npx cap open ios
```

This opens the `ios/App/App.xcworkspace` file in Xcode.

---

## Phase 7 — Run on Simulator

1. In Xcode, select a simulator from the device dropdown at the top (e.g. **iPhone 16**)
2. Click the **Run** button (▶) or press `Cmd + R`
3. The simulator will launch and the app will open

---

## Everyday Development Workflow

After making changes to the frontend code:

```bash
npm run build && npx cap sync
```

Then press **Cmd + R** in Xcode to re-run on the simulator. No need to re-run `cap init` or `cap add ios` again.

---

## Troubleshooting

**CocoaPods errors on `cap sync`:**
```bash
cd ios/App && pod install
```

**Xcode says "No signing certificate":**
- Go to Xcode → **Signing & Capabilities** tab
- Select your Apple ID team (you can use a free Apple ID for simulator builds — no paid developer account needed)

**App shows blank white screen:**
- The `dist/` folder is missing — run `npm run build` first
- Check browser console in Safari → **Develop → Simulator → App** for JS errors

**API calls failing on simulator:**
- Make sure your local backend is running (`npm run start:dev` in `neubite.backend`)
- Confirm `.env` is set to `http://localhost:3000/api`

---

## Building for a Real Device

1. You need a paid **Apple Developer account** ($99/year)
2. Register your device UDID in the Apple Developer portal
3. Update `.env` to use the ALB URL (not localhost)
4. In Xcode → **Signing & Capabilities** → select your team
5. Connect your iPhone → select it from the device dropdown → Run
