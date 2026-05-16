import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import {
  deleteRecording,
  downloadRecordingToLibrary,
  getRecordings,
} from '../../services/recordingService';
import {
  requestMediaLibraryPermission,
  showPermissionDeniedAlert,
} from '../../services/permissionsService';

export default function RecordingsScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const loadRecordings = async () => {
      setRecordings(await getRecordings());
    };

    loadRecordings();
    const unsubscribe = navigation.addListener('focus', loadRecordings);
    return unsubscribe;
  }, [navigation]);

  const handleDownload = async (recording) => {
    const granted = await requestMediaLibraryPermission();
    if (!granted) {
      showPermissionDeniedAlert('media library');
      return;
    }

    try {
      await downloadRecordingToLibrary(recording);
      Alert.alert('Saved', 'Recording export completed.');
    } catch (error) {
      Alert.alert('Export failed', 'Unable to save recording to the device.');
    }
  };

  const handleDelete = (recording) => {
    Alert.alert('Delete recording', 'Remove this saved recording?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecording(recording.id);
          setRecordings(await getRecordings());
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No recordings yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Record a live session to store session exports here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.recordingCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {item.size} bytes
            </Text>
            <View style={styles.actionRow}>
              <Pressable
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => Linking.openURL(item.fileUri)}
              >
                <Text style={styles.actionButtonText}>Open</Text>
              </Pressable>
              <Pressable
                style={[styles.secondaryButton, { borderColor: colors.border }]}
                onPress={() => handleDownload(item)}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                  Download
                </Text>
              </Pressable>
              <Pressable
                style={[styles.secondaryButton, { borderColor: colors.border }]}
                onPress={() => handleDelete(item)}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.danger }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  recordingCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
