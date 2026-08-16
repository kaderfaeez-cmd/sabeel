# Getting Sabeel into the app stores

Live at **https://www.sabeel-thepath.com**

The short version: **Android is straightforward, iOS is not.** Google explicitly supports
wrapping a web app; Apple explicitly rejects it unless the app does things a website
cannot. That asymmetry drives everything below.

---

## What is already done

- Installable PWA: manifest with `id`, `scope`, `display_override`, maskable icon
- Service worker with an offline app shell and an `/offline` page
- Full icon set (16 → 512, apple-touch, maskable)
- `/.well-known/assetlinks.json` served from a route, reading the fingerprint from
  `SABEEL_ANDROID_FINGERPRINT`
- Canonical origin fixed to the real domain

You can already install Sabeel from Chrome or Safari today — "Add to Home Screen" gives a
standalone app with the lantern icon. That costs nothing and needs no store.

---

## Android — Play Store

Sabeel ships as a **Trusted Web Activity**: a thin Android shell that renders the real
site full-screen with no browser chrome. Google supports this pattern deliberately.

### 1. Play Console account — **you must do this**
$25, one-time, at <https://play.google.com/console>. Requires identity verification, which
can take a few days.

> **The gate most people hit:** for a *personal* developer account created recently,
> Google requires a closed test with **at least 12 testers opted in for 14 continuous
> days** before you may apply for production access. Start recruiting those 12 people
> early — it is a calendar constraint, not a technical one. A registered organisation
> account is exempt but needs a D-U-N-S number.

### 2. Generate the Android package
Easiest on Windows — <https://www.pwabuilder.com>:
1. Enter `https://www.sabeel-thepath.com`
2. Package for Android → keep package name **`com.sabeelthepath.app`**
   (this must match `PACKAGE_NAME` in the assetlinks route)
3. Download the `.aab` and the signing key — **keep the key safe, it cannot be reissued**

Or with Bubblewrap if you prefer a CLI:
```bash
npx @bubblewrap/cli init --manifest https://www.sabeel-thepath.com/site.webmanifest
```

### 3. Connect the domain to the app
After the first upload, Play Console → **Release → Setup → App signing** shows a
**SHA-256 certificate fingerprint**. Add it in Vercel:

```bash
npx vercel env add SABEEL_ANDROID_FINGERPRINT production
```

Paste the fingerprint, redeploy, then confirm:
```bash
curl https://www.sabeel-thepath.com/.well-known/assetlinks.json
```
It should list the fingerprint. **Until it does, the app shows a browser URL bar across
the top** — which is the single most common reason a TWA looks broken.

### 4. Store listing
Needs: short and full description, a 512×512 icon (`public/android-chrome-512x512.png`),
a 1024×500 feature graphic, and at least two phone screenshots. A privacy policy URL is
required — Sabeel stores everything on-device and has no account, which makes that policy
short and genuinely honest.

---

## iOS — App Store

Harder, and worth being clear-eyed about.

**Apple Guideline 4.2 (Minimum Functionality)** rejects apps that are essentially a
repackaged website. A plain WebView wrapper of Sabeel would very likely be rejected.

### What would make it defensible
Sabeel has a real case, but it has to actually be built:

- **Offline reading** — already true, and worth stating in the review notes
- **Local prayer-time notifications** — the strongest argument, and *not yet built*.
  Scheduled on-device from the calculated times, honouring the constitution's rule that
  the Adhan never plays unless the user turns it on.
- **Home screen widget** — next prayer time. Genuinely native, genuinely useful.

Without at least the notifications, I would expect a rejection.

### What it takes
- **Apple Developer Program — $99/year**, yours to create
- **A Mac.** Xcode is required to build and submit. Options if you do not have one:
  cloud Mac (MacStadium, ~$60/mo), a borrowed Mac, or a CI service like Codemagic or
  EAS Build that provides macOS runners
- A Capacitor wrapper (`@capacitor/ios`) around the deployed site, plus
  `@capacitor/local-notifications` for prayer times

### Honest recommendation
Ship Android first. It is cheap, supported, and the 14-day testing window runs in the
background while iOS work happens. Treat iOS as a second project that needs native
features built rather than a packaging exercise.

---

## What I cannot do for you

- Create either developer account (payment details and identity verification)
- Submit to the App Store (needs macOS)
- Recruit the 12 Play testers

## What I can do next

- Build local prayer-time notifications (needed for iOS, and good for Android)
- Build the Capacitor iOS project so it is ready the moment a Mac is available
- Write the privacy policy page and the store listing copy
- Generate the screenshots and feature graphic
