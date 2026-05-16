import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const RECORDINGS_KEY = 'SKILLVERSE_RECORDINGS';

function normalizeRecording(recording) {
  return {
    id: recording.id ?? Date.now().toString(),
    title: recording.title ?? 'Session Recording',
    sessionId: recording.sessionId ?? '',
    createdAt: recording.createdAt ?? new Date().toISOString(),
    fileUri: recording.fileUri ?? '',
    mimeType: recording.mimeType ?? 'application/json',
    size: recording.size ?? 0,
  };
}

export async function getRecordings() {
  try {
    const recordingsJson = await AsyncStorage.getItem(RECORDINGS_KEY);
    return recordingsJson ? JSON.parse(recordingsJson).map(normalizeRecording) : [];
  } catch (error) {
    console.error('Failed to load recordings:', error);
    return [];
  }
}

export async function saveRecordings(recordings) {
  try {
    await AsyncStorage.setItem(
      RECORDINGS_KEY,
      JSON.stringify(recordings.map(normalizeRecording))
    );
  } catch (error) {
    console.error('Failed to save recordings:', error);
  }
}

export async function createRecordingManifest(session) {
  try {
    const fileName = `skillverse-recording-${Date.now()}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    const payload = {
      type: 'mock-recording',
      sessionId: session.id,
      title: session.title,
      hostName: session.hostName,
      createdAt: new Date().toISOString(),
      note: 'TODO: Replace this placeholder recording manifest with a real recorded video file when live streaming backend is connected.',
    };

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2));

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const recording = normalizeRecording({
      id: Date.now().toString(),
      title: `${session.title} Recording`,
      sessionId: session.id,
      fileUri,
      size: fileInfo.exists ? fileInfo.size ?? 0 : 0,
    });

    const recordings = await getRecordings();
    await saveRecordings([recording, ...recordings]);

    return recording;
  } catch (error) {
    console.error('Failed to create recording manifest:', error);
    return null;
  }
}

export async function downloadRecordingToLibrary(recording) {
  try {
    const asset = await MediaLibrary.createAssetAsync(recording.fileUri);
    return asset;
  } catch (error) {
    console.error('Failed to save recording to media library:', error);
    throw error;
  }
}

export async function deleteRecording(recordingId) {
  const recordings = await getRecordings();
  const target = recordings.find((recording) => recording.id === recordingId);

  if (target?.fileUri) {
    try {
      const info = await FileSystem.getInfoAsync(target.fileUri);
      if (info.exists) {
        await FileSystem.deleteAsync(target.fileUri, { idempotent: true });
      }
    } catch (error) {
      console.error('Failed to delete recording file:', error);
    }
  }

  const updatedRecordings = recordings.filter((recording) => recording.id !== recordingId);
  await saveRecordings(updatedRecordings);
}
