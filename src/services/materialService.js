import AsyncStorage from '@react-native-async-storage/async-storage';

const POST_MATERIALS_KEY = 'POST_MATERIALS';

export async function saveMaterials(materials) {
  try {
    const materialsJson = JSON.stringify(materials);
    await AsyncStorage.setItem(POST_MATERIALS_KEY, materialsJson);
  } catch (error) {
    console.error('Failed to save materials:', error);
  }
}

export async function getMaterials() {
  try {
    const materialsJson = await AsyncStorage.getItem(POST_MATERIALS_KEY);
    return materialsJson ? JSON.parse(materialsJson) : [];
  } catch (error) {
    console.error('Failed to load materials:', error);
    return [];
  }
}