import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import {
  RefreshCcw,
  Video,
  Zap,
} from 'lucide-react-native';
import { ThemeContext } from '../../context/ThemeContext';
import {
  requestCameraPermission,
  requestMicrophonePermission,
  showPermissionDeniedAlert,
} from '../../services/permissionsService';

export default function CameraScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [recording, setRecording] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!recording) {
      setElapsed(0);
      return undefined;
    }

    const intervalId = setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [recording]);

  const returnCapturedMedia = (capturedMedia) => {
    navigation.navigate({
      name: 'CreatePost',
      params: { capturedMedia },
      merge: true,
    });
  };

  const ensurePermissions = async (forVideo = false) => {
    const cameraGranted = await requestCameraPermission();
    if (!cameraGranted) {
      showPermissionDeniedAlert('camera');
      return false;
    }

    if (forVideo) {
      const microphoneGranted = await requestMicrophonePermission();
      if (!microphoneGranted) {
        showPermissionDeniedAlert('microphone');
        return false;
      }
    }

    return true;
  };

  const takePhoto = async () => {
    const okay = await ensurePermissions(false);
    if (!okay || !cameraRef.current?.takePictureAsync) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync();
      returnCapturedMedia({
        type: 'image',
        uri: photo.uri,
        mimeType: 'image/jpeg',
        name: `photo-${Date.now()}.jpg`,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to capture photo:', error);
      Alert.alert('Camera error', 'Unable to capture photo.');
    }
  };

  const toggleRecording = async () => {
    if (!recording) {
      const okay = await ensurePermissions(true);
      if (!okay || !cameraRef.current?.recordAsync) {
        return;
      }

      try {
        setRecording(true);
        const video = await cameraRef.current.recordAsync();
        returnCapturedMedia({
          type: 'video',
          uri: video.uri,
          mimeType: 'video/mp4',
          name: `video-${Date.now()}.mp4`,
        });
        navigation.goBack();
      } catch (error) {
        console.error('Failed to record video:', error);
        Alert.alert('Camera error', 'Unable to record video.');
      } finally {
        setRecording(false);
      }
      return;
    }

    cameraRef.current?.stopRecording?.();
  };

  return (
    <View style={styles.screen}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
        zoom={zoom}
      />
      <View style={styles.overlay}>
        <View style={styles.topControls}>
          <Pressable
            style={[styles.controlChip, { backgroundColor: 'rgba(15,23,42,0.7)' }]}
            onPress={() => setFlash((current) => (current === 'off' ? 'on' : 'off'))}
          >
            <Zap size={18} color="#ffffff" />
            <Text style={styles.controlChipText}>{flash === 'off' ? 'Flash Off' : 'Flash On'}</Text>
          </Pressable>
          <Pressable
            style={[styles.controlChip, { backgroundColor: 'rgba(15,23,42,0.7)' }]}
            onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
          >
            <RefreshCcw size={18} color="#ffffff" />
            <Text style={styles.controlChipText}>Flip</Text>
          </Pressable>
        </View>

        <View style={styles.centerControls}>
          {recording ? (
            <View style={styles.timerChip}>
              <Text style={styles.timerText}>
                00:{`${elapsed}`.padStart(2, '0')}
              </Text>
            </View>
          ) : null}
          <View style={styles.zoomControls}>
            <Pressable
              style={[styles.zoomButton, { backgroundColor: 'rgba(15,23,42,0.7)' }]}
              onPress={() => setZoom((current) => Math.max(0, Number((current - 0.1).toFixed(1))))}
            >
              <Text style={styles.zoomButtonText}>-</Text>
            </Pressable>
            <Text style={styles.zoomLabel}>{zoom.toFixed(1)}x</Text>
            <Pressable
              style={[styles.zoomButton, { backgroundColor: 'rgba(15,23,42,0.7)' }]}
              onPress={() => setZoom((current) => Math.min(1, Number((current + 0.1).toFixed(1))))}
            >
              <Text style={styles.zoomButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomControls}>
          <Pressable
            style={[styles.smallControl, { backgroundColor: 'rgba(15,23,42,0.7)' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.smallControlText}>Cancel</Text>
          </Pressable>

          <Pressable style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureInner} />
          </Pressable>

          <Pressable
            style={[
              styles.smallControl,
              { backgroundColor: recording ? colors.danger : 'rgba(15,23,42,0.7)' },
            ]}
            onPress={toggleRecording}
          >
            <Video size={18} color="#ffffff" />
            <Text style={styles.smallControlText}>{recording ? 'Stop' : 'Record'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 58,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerControls: {
    alignItems: 'center',
    gap: 16,
  },
  controlChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  controlChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  timerChip: {
    backgroundColor: 'rgba(239,68,68,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  zoomButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  zoomLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    minWidth: 48,
    textAlign: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallControl: {
    minWidth: 94,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  smallControlText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  captureButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
  },
});
