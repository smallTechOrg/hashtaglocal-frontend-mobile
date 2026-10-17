# EAS Build Guide

## Quick Start

**Check login status:**
```bash
npx eas-cli whoami
```

**Build commands:**
```bash
# Development build (with dev tools)
npx eas-cli build -p android --profile development

# Preview build (for testing)
npx eas-cli build -p android --profile preview

# Production build
npx eas-cli build -p android --profile production
```

## Project Info
- Account: `smalltech`
- Project ID: `18f89762-0ed6-4b80-9076-c91679fc6eb4`
- Slug: `hashtaglocal`
- Android package / iOS bundle: `com.smalltech.hashtaglocal`

## Build Profiles

| Profile | Purpose | Environment |
|---------|---------|-------------|
| `development` | Dev builds with Expo Dev Client | development |
| `preview` | Internal testing/staging | preview |
| `production` | App store releases | production |

## Configuration

**app.config.js:**
- JavaScript-based config with environment variable support
- **DO NOT** hardcode secrets - use EAS env vars
- Safe to commit to git

**Native Dependencies:**
- `react-native-maps` - Requires rebuild when added/updated
- Google Maps API key stored as EAS secret

## Environment Variables & Secrets

**List environment variables** (must specify environment):
```bash
npx eas-cli env:list --environment development
npx eas-cli env:list --environment preview
npx eas-cli env:list --environment production
```

**List secrets (deprecated, use env:list):**
```bash
npx eas-cli secret:list
```

**Create secret:**
```bash
npx eas-cli env:create --scope project --name SECRET_NAME --value "value" --type string
```

Example:
npx eas-cli env:create --scope project --name EXPO_PUBLIC_GOOGLE_CLIENT_ID --value "xyz.apps.googleusercontent.com" --type string --environment preview

**Update secret:**
```bash
npx eas-cli env:update SECRET_NAME --value "new-value"
```

**Delete secret:**
```bash
npx eas-cli env:delete SECRET_NAME
```

**Current environment variables:**

| Variable | Type | Needed in | Consumed at |
|---|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | string | preview, production | JS bundle time |
| `EXPO_PUBLIC_GOOGLE_AUTH_REDIRECT_URI` | string | preview, production | JS bundle time |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | string | preview, production | JS bundle time |
| `GOOGLE_MAPS_API_KEY` | string | **all three** | native build (app.config.js) |
| `GOOGLE_SERVICES_JSON` | file | **all three** | native build (app.config.js) |
| `GOOGLE_SERVICE_INFO_PLIST` | file | **all three** (iOS) | native build (app.config.js) |

> **`EXPO_PUBLIC_*` vs the rest.** `EXPO_PUBLIC_*` values are inlined into the JS
> bundle by Metro. For development builds Metro runs on your machine, so they come
> from the local `.env` — that is why they have no `development` entry on EAS.
> Preview and production bundle on EAS servers, so they must exist there.
>
> Everything else (`GOOGLE_MAPS_API_KEY`, the two Firebase files) is read while
> `app.config.js` is evaluated on the EAS build machine, where `.env` does not
> exist. Those must be set in **all three** environments, including development.

> **Note:** Local `.env` file is NOT used in EAS builds - only for `expo start`

## Firebase Config Files

`google-services.json` and `GoogleService-Info.plist` are gitignored, so EAS never
receives them with the project upload. They must be uploaded as **file variables**,
once per environment.

Use `--visibility plaintext`. Neither file is secret material — both ship inside every
APK/IPA and can be extracted by anyone. `secret` visibility makes them unreadable and
undownloadable afterwards, which only costs you debuggability when a build misbehaves.

> **4 KiB limit — trim the file after downloading.** EAS rejects file variables over
> 4096 bytes (`Files can't be larger than 4 KiB`). The `google-services.json` that
> Firebase hands you contains a `client` entry for *every* Android app in the
> `ai-agent-boilerplate0` project — currently `com.madhyamakist.hashtaglocalfrontend`,
> `com.smalltech.hashtaglocal` and `com.smalltech.thorough` — which comes to ~4.5 KB.
> Keep only the `com.smalltech.hashtaglocal` client (~1.6 KB). The Google Services
> Gradle plugin matches on `applicationId` and ignores the others, so nothing is lost:
>
> ```bash
> python -c "import json;d=json.load(open('google-services.json'));d['client']=[c for c in d['client'] if c['client_info']['android_client_info']['package_name']=='com.smalltech.hashtaglocal'];open('google-services.json','w').write(json.dumps(d,indent=2))"
> ```

```bash
# Android
npx eas-cli env:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --visibility plaintext --environment development
npx eas-cli env:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --visibility plaintext --environment preview
npx eas-cli env:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --visibility plaintext --environment production

# iOS
npx eas-cli env:create --scope project --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleService-Info.plist --visibility plaintext --environment development
npx eas-cli env:create --scope project --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleService-Info.plist --visibility plaintext --environment preview
npx eas-cli env:create --scope project --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleService-Info.plist --visibility plaintext --environment production
```

**`app.config.js` must reference the secrets** (already updated):
```js
// Android
googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",

// iOS
googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist",
```

Locally (during `expo start`) the files are read directly from disk. On EAS the env var path is used.

> **Do not put `googleServicesFile` in `eas.json` build profiles.** It is not valid
> there and current eas-cli rejects the whole file with
> `"build.production.android.googleServicesFile" is not allowed`, which blocks every
> `eas` command. `app.config.js` is the single place Firebase config is wired, for all
> platforms and all profiles.

## Installation

**Android:**
1. QR code shown in terminal after build completes
2. Download APK from build page
3. Install (may need to enable "Install from unknown sources")

**iOS:**
1. Requires proper provisioning profile
2. Install via TestFlight or direct install

## Useful Commands

```bash
# View build history
npx eas-cli build:list

# View specific build
npx eas-cli build:view [BUILD_ID]

# Cancel build
npx eas-cli build:cancel

# Check CLI version
npx eas-cli --version
```

## Troubleshooting

**Command not found:**
Use `npx eas-cli` instead of `eas`

**Not logged in:**
```bash
npx expo login
```

**Slow builds:**
Free tier has slower queue priority (10-20 min typical)

## Resources
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Environment Variables](https://docs.expo.dev/build-reference/variables/)
- [Project Dashboard](https://expo.dev/accounts/smalltech/projects/hashtaglocal)

