import React, { useContext, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { createLiveSession } from '../../services/liveSessionService';
import {
  requestCameraPermission,
  requestMicrophonePermission,
  showPermissionDeniedAlert,
} from '../../services/permissionsService';

export default function CreateLiveSessionScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [recordSession, setRecordSession] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleStart = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Add a title for the live session.');
      return;
    }

    setCreating(true);

    try {
      const [cameraGranted, micGranted] = await Promise.all([
        requestCameraPermission(),
        requestMicrophonePermission(),
      ]);

      if (!cameraGranted) {
        showPermissionDeniedAlert('camera');
        setCreating(false);
        return;
      }

      if (!micGranted) {
        showPermissionDeniedAlert('microphone');
        setCreating(false);
        return;
      }

      const session = await createLiveSession({
        title: title.trim(),
        hostId: currentUser.id,
        hostName: currentUser.username || currentUser.firstName || 'Host',
        recordSession,
      });

      navigation.replace('LiveSession', {
        session,
        isHost: true,
      });
    } catch (error) {
      console.error('Failed to start live session:', error);
      Alert.alert('Unable to start live session');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Go Live</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Start a vertical live learning room with camera and voice controls.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="Live session title"
          placeholderTextColor={colors.textMuted}
        />

        <View
          style={[
            styles.optionRow,
            { backgroundColor: colors.cardSecondary, borderColor: colors.border },
          ]}
        >
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>
              Record Session
            </Text>
            <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
              Save a local recording manifest after the live ends.
            </Text>
          </View>
          <Switch
            value={recordSession}
            onValueChange={setRecordSession}
            thumbColor="#ffffff"
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleStart}
          disabled={creating}
        >
          <Text style={styles.primaryButtonText}>
            {creating ? 'Starting...' : 'Start Live Session'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  hero: {
    borderRadius: 28,
    padding: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  optionRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
