# SkillVerse React Native Expo Project Specification

## Project Overview

**App Name:** SkillVerse

**Purpose:**  
SkillVerse is a skill-sharing and learning platform where users can create accounts, build profiles, publish skills they can teach, browse available skill posts, join learning sessions, upload materials, and message other users.

## Core Technology Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation
- **Backend:** Firebase
- **Firebase Services Used:**
  - Authentication
  - Firestore
  - Storage

## Recommended High-Level App Architecture

The project should be organized by feature and shared app layers so it remains scalable as new modules are added.

- `app/` or `src/` as the main source root
- `navigation/` for all navigator definitions
- `screens/` for full-screen UI components
- `components/` for shared reusable UI pieces
- `features/` for domain-based modules such as auth, profile, skills, sessions, chat, and materials
- `services/` for Firebase and external service wrappers
- `store/` or `context/` for app-wide state if needed later
- `utils/` for helpers, constants, and formatting logic
- `assets/` for images, icons, fonts, and static media

For this project, using `src/` as the main source directory is recommended.

---

## Full Folder Structure

```text
SkillVerse/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── .env
├── .gitignore
├── assets/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── splash/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppButton.js
│   │   │   ├── AppInput.js
│   │   │   ├── AppText.js
│   │   │   ├── AppHeader.js
│   │   │   ├── LoadingIndicator.js
│   │   │   └── EmptyState.js
│   │   ├── skillPosts/
│   │   │   ├── SkillCard.js
│   │   │   ├── SkillPostList.js
│   │   │   └── SkillCategoryChip.js
│   │   ├── sessions/
│   │   │   ├── SessionCard.js
│   │   │   ├── SessionScheduleItem.js
│   │   │   └── JoinSessionButton.js
│   │   ├── chat/
│   │   │   ├── MessageBubble.js
│   │   │   ├── ChatInput.js
│   │   │   └── ConversationListItem.js
│   │   └── materials/
│   │       ├── MaterialCard.js
│   │       ├── UploadPicker.js
│   │       └── FilePreview.js
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── profile/
│   │   │   ├── CreateProfileScreen.js
│   │   │   ├── EditProfileScreen.js
│   │   │   ├── MyProfileScreen.js
│   │   │   └── UserProfileScreen.js
│   │   ├── skills/
│   │   │   ├── HomeScreen.js
│   │   │   ├── BrowseSkillsScreen.js
│   │   │   ├── SkillDetailsScreen.js
│   │   │   ├── CreateSkillPostScreen.js
│   │   │   ├── EditSkillPostScreen.js
│   │   │   └── MySkillPostsScreen.js
│   │   ├── sessions/
│   │   │   ├── SessionDetailsScreen.js
│   │   │   ├── JoinedSessionsScreen.js
│   │   │   ├── MyTeachingSessionsScreen.js
│   │   │   └── SessionParticipantsScreen.js
│   │   ├── materials/
│   │   │   ├── UploadMaterialScreen.js
│   │   │   ├── MaterialLibraryScreen.js
│   │   │   └── MaterialViewerScreen.js
│   │   ├── chat/
│   │   │   ├── ConversationsScreen.js
│   │   │   └── ChatScreen.js
│   │   └── settings/
│   │       ├── SettingsScreen.js
│   │       └── AccountSettingsScreen.js
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── AppNavigator.js
│   │   ├── HomeStackNavigator.js
│   │   ├── SkillsStackNavigator.js
│   │   ├── SessionsStackNavigator.js
│   │   ├── ChatStackNavigator.js
│   │   ├── ProfileStackNavigator.js
│   │   └── linking.js
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── validations/
│   │   │   └── types/
│   │   ├── profile/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── validations/
│   │   │   └── types/
│   │   ├── skills/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── validations/
│   │   │   └── types/
│   │   ├── sessions/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── validations/
│   │   │   └── types/
│   │   ├── materials/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── validations/
│   │   │   └── types/
│   │   └── chat/
│   │       ├── api/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── validations/
│   │       └── types/
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.js
│   │   │   ├── auth.js
│   │   │   ├── firestore.js
│   │   │   └── storage.js
│   │   ├── upload/
│   │   │   └── fileUploadService.js
│   │   └── messaging/
│   │       └── chatService.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── UserContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUserProfile.js
│   │   ├── useSkillPosts.js
│   │   ├── useSessions.js
│   │   └── useChat.js
│   ├── utils/
│   │   ├── constants/
│   │   │   ├── colors.js
│   │   │   ├── routes.js
│   │   │   └── firebaseCollections.js
│   │   ├── helpers/
│   │   │   ├── dateHelpers.js
│   │   │   ├── validationHelpers.js
│   │   │   └── fileHelpers.js
│   │   └── formatters/
│   │       ├── profileFormatter.js
│   │       └── sessionFormatter.js
│   └── config/
│       ├── env.js
│       └── appConfig.js
└── README.md
```

---

## List of Required Screens

### Authentication

- `WelcomeScreen`
- `LoginScreen`
- `RegisterScreen`
- `ForgotPasswordScreen`

### User Profile

- `CreateProfileScreen`
- `EditProfileScreen`
- `MyProfileScreen`
- `UserProfileScreen`

### Skill Posts

- `HomeScreen`
- `BrowseSkillsScreen`
- `SkillDetailsScreen`
- `CreateSkillPostScreen`
- `EditSkillPostScreen`
- `MySkillPostsScreen`

### Sessions

- `SessionDetailsScreen`
- `JoinedSessionsScreen`
- `MyTeachingSessionsScreen`
- `SessionParticipantsScreen`

### Learning Materials

- `UploadMaterialScreen`
- `MaterialLibraryScreen`
- `MaterialViewerScreen`

### Messaging

- `ConversationsScreen`
- `ChatScreen`

### Settings

- `SettingsScreen`
- `AccountSettingsScreen`

---

## Navigation Design

The app should use a layered navigation structure with React Navigation.

### 1. Root Navigation

The root navigator decides whether the user sees:

- `AuthNavigator` when not logged in
- `AppNavigator` when authenticated

### 2. Auth Navigator

Suggested as a **stack navigator**.

Flow:

- `WelcomeScreen`
- `LoginScreen`
- `RegisterScreen`
- `ForgotPasswordScreen`

### 3. Main App Navigator

Suggested as a **bottom tab navigator** with stack navigators inside each tab.

Recommended tabs:

- `Home`
- `Skills`
- `Sessions`
- `Messages`
- `Profile`

### 4. Tab-Level Stack Navigators

#### Home Stack

- `HomeScreen`
- `BrowseSkillsScreen`
- `SkillDetailsScreen`
- `UserProfileScreen`

#### Skills Stack

- `BrowseSkillsScreen`
- `SkillDetailsScreen`
- `CreateSkillPostScreen`
- `EditSkillPostScreen`
- `MySkillPostsScreen`
- `UploadMaterialScreen`
- `MaterialLibraryScreen`
- `MaterialViewerScreen`

#### Sessions Stack

- `JoinedSessionsScreen`
- `MyTeachingSessionsScreen`
- `SessionDetailsScreen`
- `SessionParticipantsScreen`

#### Messages Stack

- `ConversationsScreen`
- `ChatScreen`
- `UserProfileScreen`

#### Profile Stack

- `MyProfileScreen`
- `CreateProfileScreen`
- `EditProfileScreen`
- `SettingsScreen`
- `AccountSettingsScreen`

### 5. Suggested Navigation Logic

- After successful login or registration, users enter `AppNavigator`
- If a user has no completed profile, route them to `CreateProfileScreen`
- Selecting a skill post opens `SkillDetailsScreen`
- From skill details, users can join a session
- From sessions or profiles, users can open chat with another user
- Uploading materials should be accessible from skill post management or session-related flows

---

## File Naming Conventions

Use a consistent, feature-oriented naming system.

### General Rules

- Use **PascalCase** for screen and component files
- Use **camelCase** for hook, utility, service, and helper files
- Use clear singular nouns for components and descriptive names for screens
- Keep filenames aligned with exported module names

### Recommended Conventions

- Screens: `LoginScreen.js`, `SkillDetailsScreen.js`
- Components: `SkillCard.js`, `MessageBubble.js`
- Hooks: `useAuth.js`, `useSessions.js`
- Services: `chatService.js`, `fileUploadService.js`
- Firebase files: `auth.js`, `firestore.js`, `storage.js`
- Context files: `AuthContext.js`, `UserContext.js`
- Constants: `routes.js`, `colors.js`, `firebaseCollections.js`
- Helpers/formatters: `dateHelpers.js`, `profileFormatter.js`
- Navigators: `AuthNavigator.js`, `ProfileStackNavigator.js`

### Folder Naming Rules

- Use lowercase for folders
- Use plural folder names when the folder contains multiple related modules
- Group by feature where possible: `auth/`, `profile/`, `skills/`, `sessions/`, `chat/`, `materials/`

---

## Recommended Feature Modules

To match the app requirements, the architecture should revolve around these domains:

- **auth**: registration, login, session persistence
- **profile**: learner/teacher profile creation and updates
- **skills**: teaching posts, browsing, search, filtering
- **sessions**: joining, managing, and viewing learning sessions
- **materials**: uploading and viewing PDFs, images, and video files
- **chat**: one-to-one messaging between users

---

## Firebase Responsibility Split

### Firebase Authentication

Handles:

- User registration
- Login
- Logout
- Password reset
- Auth session persistence

### Firestore

Handles:

- User profiles
- Skill posts
- Session records
- Chat conversations
- Messages metadata
- Material metadata

### Storage

Handles:

- Profile images
- Uploaded PDFs
- Uploaded images
- Uploaded videos

---

## Architecture Notes

- Keep Firebase configuration isolated in `src/services/firebase/`
- Keep screen-level UI inside `screens/` and reusable parts inside `components/`
- Keep feature business logic grouped under `features/`
- Avoid placing Firebase calls directly inside screens
- Route names should be centralized in `src/utils/constants/routes.js`
- File upload logic should be separated from screen logic for reuse across profile, skills, and materials flows

---

## Summary

This architecture gives SkillVerse:

- A scalable Expo-based React Native structure
- Clean separation between screens, navigation, services, and features
- Clear support for authentication, profiles, skill posts, sessions, materials, and messaging
- A folder layout that is easy to maintain as the app grows

This specification is intentionally code-free and ready to use as the blueprint for the next step of scaffolding the Expo project.
