# ZoDeals customer app (React Native + Expo)

Native Android app for the ZoDeals customer site (`zodeals_userfrontend`).
It talks to the **same backend** (`https://api.zodeals.in`). No backend or website changes are needed.

## What is in the app
Home (admin hero banners, featured stores, top deals, deals of the day, categories, latest deals, coupons,
reviews, footer info), Stores, Categories, All Deals, Search (stores, A-Z), Store offers, Category coupons,
Coupon details (copy code, go to site, "is it working?" votes, comments, newsletter, related offers),
Favourites, Notifications, Profile (edit + photo), Login, Sign up (no OTP), Forgot password (email OTP),
Pin code, Become an agent, About, FAQ, Terms, Privacy, Refund and Pricing policies, Merchant Partnership link.

## Run it on a phone (testing)
```
cd zodeals_app
npm install --legacy-peer-deps
npx expo install --fix
npx expo start
```
Install **Expo Go** on an Android phone and scan the QR code.

## Build an APK
GitHub: Actions tab -> **Build Android app (zodeals_app)** -> Run workflow. Download the `zodeals-android-apk` artifact.
(The APK from this workflow is for testing. It is signed with a debug key.)

## Publish on Google Play
1. Create a Google Play developer account ($25, one time).
2. Build a signed release bundle (.aab). Easiest: `npm i -g eas-cli`, `eas login`, `eas build -p android --profile production`.
3. In Play Console create the app, upload the .aab, add screenshots, a privacy policy URL and the Data safety form
   (the app collects email, name, phone and an optional profile photo).
4. Change `android.package` in `app.json` (currently `in.zodeals.app`) BEFORE the first upload. It cannot change later.

## Config
- `src/config.js`: API URL and the vendor / partner links.
- `src/content/pages.js`: policy / FAQ text (generated from the website).
- `src/theme.js`: colours (blue gradient #13A2EA -> #5A6EF1, Inter font).
