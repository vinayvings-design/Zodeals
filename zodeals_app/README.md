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
Targets Android API 36 (Expo SDK 58), as Google Play requires for new apps.

Checklist:
1. Play developer account ($25, one time).
2. **Change `android.package`** in `app.json` (now `in.zodeals.app`) BEFORE the first upload. It cannot change later. Raise `android.versionCode` for every upload.
3. Signed bundle (.aab): `npm i -g eas-cli`, `eas login`, then in `zodeals_app` run `eas build -p android --profile production`. EAS creates and stores the upload keystore. Keep it safe.
4. Play Console -> create app -> upload the .aab (start with Internal testing).
5. Store listing: 512x512 icon, 1024x500 feature graphic, 2-8 phone screenshots, short (80 chars) and full description.
6. Privacy policy URL: `https://zodeals.in/privacy-policy`
7. Account deletion: in the app (Account -> Delete account) and on the web: `https://zodeals.in/delete-account`. Enter that URL in Play Console -> App content -> Data safety. Check the wording of that page is right for you.
8. Data safety form: collects name, email, phone, optional profile photo; data is sent to your server over HTTPS; users can request deletion.
9. Complete App content: ads (no), target audience (18+), content rating questionnaire.
10. New personal developer accounts must run a closed test with 12+ testers for 14 days before applying for production.

## Config
- `src/config.js`: API URL and the vendor / partner links.
- `src/content/pages.js`: policy / FAQ text (generated from the website).
- `src/theme.js`: colours (blue gradient #13A2EA -> #5A6EF1, Inter font).
