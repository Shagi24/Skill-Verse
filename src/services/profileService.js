import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'USER_PROFILE';

export async function saveProfile(profile) {
  try {
    const profileJson = JSON.stringify(profile);
    await AsyncStorage.setItem(PROFILE_KEY, profileJson);
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}

export async function getProfile() {
  try {
    const profileJson = await AsyncStorage.getItem(PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

export async function updateProfile(updates) {
  const existingProfile = await getProfile();
  const nextProfile = {
    ...(existingProfile ?? {}),
    ...updates,
  };

  await saveProfile(nextProfile);
  return nextProfile;
}
