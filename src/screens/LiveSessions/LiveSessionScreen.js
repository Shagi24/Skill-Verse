import React, { useContext, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import LiveControlBar from '../../components/Live/LiveControlBar';
import { endLiveSession } from '../../services/liveSessionService';
import { createRecordingManifest } from '../../services/recordingService';

export default function LiveSessionScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const { session, isHost } = route.params;
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [ending, setEnding] = useState(false);

  const sessionLabel = useMemo(
    () => (isHost ? 'You are live' : `Watching ${session.hostName}`),
    [isHost, session.hostName]
  );

  const handleLeave = async () => {
    if (ending) {
      return;
    }

    setEnding(true);

    try {
      if (isHost) {
        await endLiveSession(session.id);

        if (session.recordSession) {
          const recording = await createRecordingManifest(session);
          if (recording) {
            Alert.alert(
              'Session ended',
              'A placeholder recording file was saved. Open Recordings to download or delete it.'
            );
          }
        }
      }

      navigation.goBack();
    } catch (error) {
      console.error('Failed to leave live session:', error);
      navigation.goBack();
    } finally {
      setEnding(false);
    }
  };

  return (
    <View style={styles.screen}>
      {cameraEnabled ? (
        <CameraView style={StyleSheet.absoluteFill} facing="front" />
      ) : (
        <View style={[styles.cameraOffState, { backgroundColor: colors.background }]}>
          <Text style={[styles.cameraOffText, { color: colors.text }]}>
            Camera is turned off
          </Text>
        </View>
      )}

      <View style={styles.overlay}>
        <View
          style={[
            styles.headerCard,
            { backgroundColor: 'rgba(15, 23, 42, 0.55)', borderColor: 'rgba(255,255,255,0.12)' },
          ]}
        >
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.subtitle}>{sessionLabel}</Text>
          <Text style={styles.meta}>
            Host: {session.hostName} {'\u2022'} @{currentUser.username || currentUser.firstName}
          </Text>
          <Text style={styles.meta}>
            TODO: Replace local camera preview with real streaming transport.
          </Text>
        </View>

        <LiveControlBar
          colors={{
            ...colors,
            card: 'rgba(15, 23, 42, 0.76)',
            text: '#ffffff',
          }}
          micEnabled={micEnabled}
          cameraEnabled={cameraEnabled}
          onToggleMic={() => setMicEnabled((current) => !current)}
          onToggleCamera={() => setCameraEnabled((current) => !current)}
          onLeave={handleLeave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  cameraOffState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOffText: {
    fontSize: 18,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 30,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#e2e8f0',
    fontSize: 15,
    marginBottom: 4,
  },
  meta: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
});
