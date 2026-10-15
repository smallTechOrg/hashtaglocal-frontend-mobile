# #local Frontend Mobile 

**#local** is a mobile app for reporting local civic issues, finding nearby issues and events on a map, and chatting with your neighbourhood.
This guide takes you from zero to running the app on your phone. No technical background is needed; just follow the steps in order.
⏱️ About 1–2 hours the first time, mostly waiting for downloads.

## Tech stack

- **Expo** – Platform to build, run and update the app
- **React Native** – Framework for the mobile app (Android and iOS)
- **TypeScript** – Programming language for the app code
- **Expo Router** – Screen navigation
- **NativeWind (Tailwind CSS)** – Styling
- **React Native Maps** – Google Maps for issues and events
- **EAS Build and EAS Update** – Building the app and pushing updates

# Prerequisites

Do these once before you start the setup guide.

### Set up your workspace (Git, Node.js, VS Code)

Follow the team's workspace setup guide: **https://github.com/smallTechOrg/workspace-setup-windows**

Complete these sections:
- **[git](https://github.com/smallTechOrg/workspace-setup-windows/blob/main/git.md)**: installs Git and Git Bash.
- **[js](https://github.com/smallTechOrg/workspace-setup-windows/blob/main/js.md)**: installs nvm, Node.js and npm.

> ⚠️ You need the Node.js version listed in the project's `.tool-versions` file. Install and switch to it with `nvm install <version>` and `nvm use <version>`.

### Create an Expo account and join the team

Expo runs and builds the app. The project belongs to the **`smalltech`** team on Expo, so you need to join it.

<details>
<summary>Create your Expo account</summary>

1. Go to **https://expo.dev/signup**.
2. Fill in the details and sign up.
</details>

<details>
<summary>Join the <code>smalltech</code> organisation</summary>

1. **Send your Expo username (or email) to the project admin** and ask them to invite you to the **`smalltech`** organisation, with at least the **Developer** role.
2. You'll get an invitation email from Expo. Click the link and **accept** (you must be logged in to expo.dev).
3. **Check:** on https://expo.dev, click your profile picture/name in the top-left. You should be able to switch to **smalltech**. Then open **Projects** and you should see **hashtaglocal**.
</details>


### A phone

- **Android:** any Android phone. You'll install a test version of the app on it in [Step 5](#step-5-install-the-app-on-your-phone-development-build).
- **iPhone:** it must be registered on the team's Apple Developer account first (see [Step 5](#step-5-install-the-app-on-your-phone-development-build)).


---

# Setup Guide

## Step 1: Clone the repository  

Clone the repository:
```bash
git clone https://github.com/smallTechOrg/hashtaglocal-frontend-mobile.git
cd hashtaglocal-frontend-mobile
```

---

## Step 2: Install the project's packages

The app uses many ready-made code packages.  

```bash
npm install
```

---

## Step 3: Log in to Expo from the terminal

This connects your computer to your Expo account so you can run and build the project.

```bash
npx expo login
```

**What happens:**
1. If asked `Need to install the following packages... Ok to proceed? (y)`, type `y` and press Enter.
2. Sign in  
3. You should see: `Logged in as your-username`.

**Check it worked:**
```bash
npx expo whoami
```
It should print your Expo username.

---

## Step 4: Create the `.env` file

Create `.env` file. And insert this:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:8080
```

---

## Step 5: Install the app on your phone (development build)

You need the project's own **development build**.

**What a development build is:** a test version of #local that you install on your phone once. Each time you open it, it loads the newest code from your computer.

### Android

#### Build it in the cloud

```bash
eas build --profile development --platform android
```

When the build finishes, scan the QR code with your phone and install the app.

### iPhone

iPhones only allow test apps on **registered devices**, which needs the team's paid Apple Developer account. Ask the team to:
1. Register your iPhone (they'll send you a link to open on the phone, created with `eas device:create`).
2. Make a new iOS development build that includes your device.

Then install it from the link they send. Everything else in this guide is the same.

---

## Step 6: Start the app

1. Make sure your **computer and phone are on the same Wi-Fi network**.
2. In the VS Code terminal, run:
   ```bash
   npx expo start
   ```
3. **What you'll see:** after a few seconds, a big **QR code** and lines like:
   ```
   › Metro waiting on exp://192.168.1.6:8081

     EXPO_PUBLIC_API_BASE_URL=http://192.168.1.6:8080

   › Scan the QR code above to open the project in a development build.
   › Press a │ open Android
   › Press r │ reload app
   ```
   **Leave this terminal running.** 
4. Open the app on your phone. Either:
   - **Scan the QR code** in the terminal with your phone's camera (or Google Lens) and tap the link. It opens #local, **or**
   - Open the **#local** app. You'll see a screen titled **"Development servers"**. Tap the server that appears (it shows your computer's address). If none appears, tap **"Enter URL manually"** and type the `http://192.168.x.x:8081` address shown in the terminal.
5. **The first load takes 1–3 minutes.** You'll see a progress bar ("Bundling 45%..."). Later loads are much faster.
6. When it finishes, you'll see the **#local login screen**. 🎉

To use remotely, when not on same network:
```bash
npx expo start --tunnel
```

---

**Setup complete!** 🎉


**Useful keys** while `npx expo start` is running (click inside the terminal first):

| Key | What it does |
|---|---|
| `r` | Reload the app on your phone (use if something looks stuck) |
| `m` | Open the developer menu on your phone |
| `j` | Open the debugger |
| `Ctrl + C` | **Stop** the server. Do this when you're finished. |


If *you need a new development build*, repeat [Step 5](#step-5-install-the-app-on-your-phone-development-build).

## Run Backend

Create `.env` file. And insert this:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:8080
```

Replace the IP with the output you get when you run `npx expo start`. Example:
```
› Metro waiting on exp://192.168.1.100:8081
```

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080
```

Re-start the app after you've made this change.

---

# Troubleshooting

| Problem | Fix |
|---|---|
| `node` / `git` not recognized | Redo [Set up your workspace](#set-up-your-workspace-git-nodejs-vs-code), then reopen VS Code. |
| `running scripts is disabled` (Windows) | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`. |
| App crashes or a module is missing | Use the development build, not Expo Go ([Step 5](#step-5-install-the-app-on-your-phone-development-build)). |
| Phone can't connect to the server | Use the same Wi-Fi, allow Node.js through the firewall, or run `npx expo start --tunnel`. |
| Nothing loads / old `.env` values | Check `.env`, then run `npx expo start --clear`. |

Still stuck? Email **contact@smalltech.in** with the error message and step number.

---

Imports use the `/` alias for the project root (`tsconfig.json`).

## Config Setup

Add `EXPO_PUBLIC_GOOGLE_CLIENT_ID` to the `.env` file. Get it from a team member.

## Map API Key

Can be accessed through these links:
- https://console.cloud.google.com/google/maps-apis/api-list?project=ai-agent-boilerplate0
- **#local-app**: https://console.cloud.google.com/google/maps-apis/credentials?project=ai-agent-boilerplate0

## npm scripts

| Script | Command | Description |
|---|---|---|
| `npm start` | `expo start` | Start Metro |
| `npm run android` | `expo run:android` | Local native Android build + run (needs Android Studio, `ANDROID_HOME` and `GOOGLE_MAPS_API_KEY` in `.env`) |
| `npm run ios` | `expo run:ios` | Local native iOS build (macOS + Xcode + CocoaPods) |
| `npm run web` | `expo start --web` | Not a supported target |
| `npm run lint` | `expo lint` | ESLint (`eslint-config-expo`) |
| `npm test` | `jest` | Unit tests |
| `npm run test:watch` | `jest --watch` | Watch mode |
| `npm run test:coverage` | `jest --coverage` | Coverage |

## Builds

Uses [EAS Build](https://docs.expo.dev/build/introduction/) with three profiles:

| Profile | Command | Output | Use for |
|---|---|---|---|
| `development` | `eas build --profile development --platform android` | APK | Local dev with dev client |
| `preview` | `eas build --profile preview --platform android` | APK | Internal QA, quick testing |
| `production` | `eas build --profile production --platform android` | AAB | Play Store submission |

## OTA Updates (EAS Update)

> **Use this to ship JS fixes without going through the Play Store. After a fix, this is almost always the right command instead of a full rebuild.**

### What it is

Expo apps have two layers:
1. **Native shell**: the compiled Android/iOS binary. Changing this requires a full rebuild + store submission.
2. **JavaScript bundle**: all React components, screens, business logic, API calls. This can be updated independently.

EAS Update pushes a new JS bundle directly to installed apps. On the next app launch, users silently receive the update. No Play Store download, no review wait.

### When to use OTA vs full rebuild

**Use `eas update` (OTA) for:**
- Any change in `.ts` / `.tsx` files: screens, components, utils, API clients
- Bug fixes, UI tweaks, logic changes, new JS-only packages

**Do a full `eas build` when:**
- You changed `app.config.js` (scheme, permissions, plugins, version)
- You added a package that includes native code (new camera lib, etc.)
- You changed anything in `android/` or `ios/`

### How to push an update

```bash
# Push to production (Play Store users)
eas update --branch production --message "Fix: describe what changed"

# Push to preview channel (internal testers with preview APK)
eas update --branch preview --message "Test: describe what changed"
```

### How users receive updates

- On app launch, the app checks for a new bundle in the background
- If found, it downloads silently
- Update applies on the **next** app restart (not the current session)
- If download fails (no internet), the app keeps running the previous bundle safely

### Channels

| EAS build profile | Update channel | Who gets it |
|---|---|---|
| `production` | `production` | Play Store users |
| `preview` | `preview` | Internal testers with preview APK |

### Typical workflow

```
Bug reported → fix code → eas update --branch production --message "Fix: <what>" → done
```

No rebuild. No Play Store submission. Users get it on next launch.

## Testing and linting

```bash
npm test
npm run test:coverage
npm run lint
npx tsc --noEmit        # type-check
```

---

Support: **contact@smalltech.in**
