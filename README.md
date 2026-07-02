# My chatr — Sales Demo App

A bilingual (EN/FR) Chatr Wireless demo app for sales presentations. Runs on **web** and **mobile** (Expo Go / EAS) with mock data — no real backend required.

## Quick start

```bash
npm install
npm start          # Expo dev server — scan QR for device
npm run web        # Web browser
```

## Demo accounts

| Email | Scenario |
|-------|----------|
| `demo@chatr.ca` | Standard user, Auto-Pay on |
| `heavy@chatr.ca` | 90% data used — upsell moment |
| `roam@chatr.ca` | Active EU roaming add-on |
| `new@chatr.ca` | Just activated, first top-up |

Password: any value (demo mode)

## Demo mode

- Long-press the dot on the Dashboard header, or open **More → Demo mode**
- Switch scenarios in under 5 seconds for live pitches

## Core journeys

1. Browse plans → plan detail → change plan
2. SIM activation wizard (4 steps)
3. Sign in / register
4. Dashboard with usage alerts and promos
5. Usage monitoring with charts
6. Top-up, Auto-Pay, saved cards
7. Add-ons marketplace
8. Profile and account settings
9. Coverage map (region list)
10. Store locator with directions
11. Support FAQ + mock chat
12. Demo scenario switcher

## Deploy web (Vercel)

```bash
npx expo export --platform web
```

Deploy the `dist/` folder — `vercel.json` is included.

## Tech stack

- Expo SDK 57 + Expo Router
- NativeWind (Tailwind)
- Zustand + AsyncStorage
- i18next (EN/FR)
- Mock data in `lib/mock/`
