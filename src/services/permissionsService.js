import { Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

export async function requestCameraPermission() {
  try {
    const permission = await Camera.requestCameraPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Failed to request camera permission:', error);
    return false;
  }
}

export async function requestMicrophonePermission() {
  try {
    const permission = await Camera.requestMicrophonePermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Failed to request microphone permission:', error);
    return false;
  }
}

export async function requestMediaLibraryPermission() {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Failed to request media library permission:', error);
    return false;
  }
}

export async function requestImageLibraryPermission() {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Failed to request image picker permission:', error);
    return false;
  }
}

export async function requestCalendarPermission() {
  try {
    const permission = await Calendar.requestCalendarPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Failed to request calendar permission:', error);
    return false;
  }
}

export function showPermissionDeniedAlert(label) {
  Alert.alert(
    'Permission Required',
    `SkillVerse needs ${label} permission to continue with this action.`
  );
}
