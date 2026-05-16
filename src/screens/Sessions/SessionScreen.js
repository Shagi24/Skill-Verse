import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { CalendarPlus, FolderUp, Radio, SquarePlay } from 'lucide-react-native';
import { ThemeContext } from '../../context/ThemeContext';
import {
  addAssignmentSubmission,
  addSessionMaterial,
  deleteSession,
  getSessions,
} from '../../services/sessionService';

export default function SessionScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setSessions(await getSessions());
      } catch (error) {
        console.error('Error loading sessions:', error);
        setSessions([]);
      }
    };

    loadSessions();
    const unsubscribe = navigation.addListener('focus', loadSessions);
    return unsubscribe;
  }, [navigation]);

  const handleShareMaterial = async (session) => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
      type: ['application/pdf', 'image/*', 'video/*', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    await addSessionMaterial(session.id, {
      id: `${Date.now()}`,
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType,
      uploadedAt: new Date().toISOString(),
    });

    Alert.alert('Material shared', 'The file was added to the session.');
    setSessions(await getSessions());
  };

  const handleSubmitAssignment = async (session) => {
    const assignment = session.assignments?.[0];

    if (!assignment) {
      Alert.alert('No assignment', 'This session does not have an assignment yet.');
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    await addAssignmentSubmission(session.id, assignment.id, {
      id: `${Date.now()}`,
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType,
      createdAt: new Date().toISOString(),
    });

    Alert.alert('Assignment submitted', 'The file was attached to the session assignment.');
    setSessions(await getSessions());
  };

  const renderSession = ({ item }) => (
    <View
      style={[
        styles.sessionCard,
        { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.topic, { color: colors.text }]}>{item.title || item.topic}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {item.date} {'\u2022'} {item.time}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.savedToCalendar ? colors.successSoft : colors.primarySoft },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: item.savedToCalendar ? colors.success : colors.primary },
            ]}
          >
            {item.savedToCalendar ? 'Calendar' : 'Scheduled'}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textMuted }]}>
        {item.description}
      </Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryChip, { backgroundColor: colors.cardSecondary }]}>
          <Text style={[styles.summaryChipText, { color: colors.text }]}>
            {item.materials?.length || 0} files
          </Text>
        </View>
        <View style={[styles.summaryChip, { backgroundColor: colors.cardSecondary }]}>
          <Text style={[styles.summaryChipText, { color: colors.text }]}>
            {item.assignments?.[0]?.submissions?.length || 0} submissions
          </Text>
        </View>
        <View style={[styles.summaryChip, { backgroundColor: colors.cardSecondary }]}>
          <Text style={[styles.summaryChipText, { color: colors.text }]}>
            {item.recordSession ? 'Recording on' : 'Recording off'}
          </Text>
        </View>
      </View>

      <View style={styles.primaryRow}>
        <Pressable
          style={[styles.primaryAction, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('SessionDetails', { session: item })}
        >
          <Radio size={16} color="#ffffff" />
          <Text style={styles.primaryActionText}>View</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryAction, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('CreateSession', { session: item })}
        >
          <SquarePlay size={16} color={colors.text} />
          <Text style={[styles.secondaryActionText, { color: colors.text }]}>
            Edit
          </Text>
        </Pressable>
      </View>

      <View style={styles.secondaryRow}>
        <Pressable
          style={[styles.utilityAction, { backgroundColor: colors.cardSecondary }]}
          onPress={() => handleShareMaterial(item)}
        >
          <FolderUp size={16} color={colors.text} />
          <Text style={[styles.utilityActionText, { color: colors.text }]}>
            Share File
          </Text>
        </Pressable>
        <Pressable
          style={[styles.utilityAction, { backgroundColor: colors.cardSecondary }]}
          onPress={() =>
            Alert.alert('Delete Session', 'Remove this session from your schedule?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await deleteSession(item.id);
                  setSessions(await getSessions());
                },
              },
            ])
          }
        >
          <CalendarPlus size={16} color={colors.text} />
          <Text style={[styles.utilityActionText, { color: colors.text }]}>
            Delete
          </Text>
        </Pressable>
      </View>

      <View style={styles.secondaryRow}>
        <Pressable
          style={[styles.utilityAction, { backgroundColor: colors.cardSecondary }]}
          onPress={() => navigation.navigate('JoinLiveSession')}
        >
          <Radio size={16} color={colors.text} />
          <Text style={[styles.utilityActionText, { color: colors.text }]}>
            Join Live
          </Text>
        </Pressable>
        <Pressable
          style={[styles.utilityAction, { backgroundColor: colors.cardSecondary }]}
          onPress={() => handleSubmitAssignment(item)}
        >
          <CalendarPlus size={16} color={colors.text} />
          <Text style={[styles.utilityActionText, { color: colors.text }]}>
            Assignment
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No sessions yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Create a session to start scheduling classes and sharing materials.
            </Text>
          </View>
        }
      />

      <View style={styles.fabColumn}>
        <Pressable
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('CreateLiveSession')}
        >
          <Text style={styles.fabText}>Go Live</Text>
        </Pressable>
        <Pressable
          style={[styles.fabSecondary, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('Recordings')}
        >
          <Text style={[styles.fabSecondaryText, { color: colors.text }]}>Recordings</Text>
        </Pressable>
        <Pressable
          style={[styles.fabSecondary, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('CreateSession')}
        >
          <Text style={[styles.fabSecondaryText, { color: colors.text }]}>New Session</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 150,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    marginTop: 28,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sessionCard: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
    marginTop: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  topic: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  summaryChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  primaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  utilityAction: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  utilityActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fabColumn: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    gap: 10,
  },
  fab: {
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 15,
    alignItems: 'center',
  },
  fabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  fabSecondary: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fabSecondaryText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
