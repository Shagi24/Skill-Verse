# SkillVerse

SkillVerse is a React Native app built with Expo, React Navigation, and Firebase.

## Prerequisites

- Node.js 20 LTS or newer
- npm
- Expo Go or an Android/iOS simulator

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Then use:

- `a` to open Android
- `i` to open iOS on macOS
- `w` to open web

## Project Structure

```text
src/
  screens/
  components/
  navigation/
  context/
  services/
  utils/
  assets/
```

## Notes

- Update `src/services/firebase.js` with your real Firebase config before connecting backend features.
- This starter currently uses placeholder authentication state in `src/context/AuthContext.js`.
- If Expo reports dependency version mismatches, run:

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```
