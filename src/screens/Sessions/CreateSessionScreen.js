import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import * as Calendar from 'expo-calendar';
import { ThemeContext } from '../../context/ThemeContext';
import { addNotification } from '../../services/notificationService';
import { createSession, updateSession } from '../../services/sessionService';
import {
  requestCalendarPermission,
  showPermissionDeniedAlert,
} from '../../services/permissionsService';

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();

  return defaultCalendar?.source ?? {
    isLocalAccount: true,
    name: 'SkillVerse',
    type: 'LOCAL',
  };
}

async function ensureCalendarId() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const existingCalendar = calendars.find((calendar) => calendar.title === 'SkillVerse Sessions');

  if (existingCalendar) {
    return existingCalendar.id;
  }

  const source = await getDefaultCalendarSource();

  return Calendar.createCalendarAsync({
    title: 'SkillVerse Sessions',
    color: '#2563eb',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: source.id,
    source,
    name: 'SkillVerse Sessions',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

function buildDateFromInputs(date, time) {
  const parsedDate = new Date(`${date} ${time}`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export default function CreateSessionScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const editingSession = route.params?.session;
  const [title, setTitle] = useState(editingSession?.title ?? editingSession?.topic ?? '');
  const [date, setDate] = useState(editingSession?.date ?? '');
  const [time, setTime] = useState(editingSession?.time ?? '');
  const [description, setDescription] = useState(editingSession?.description ?? '');
  const [recordSession, setRecordSession] = useState(editingSession?.recordSession ?? false);
  const [saving, setSaving] = useState(false);

  const saveBaseSession = async () => {
    if (!title.trim() || !date.trim() || !time.trim() || !description.trim()) {
      Alert.alert('Missing details', 'Complete the title, date, time, and description.');
      return null;
    }

    if (editingSession?.id) {
      return updateSession(editingSession.id, {
        title: title.trim(),
        topic: title.trim(),
        date: date.trim(),
        time: time.trim(),
        description: description.trim(),
        recordSession,
      });
    }

    return createSession({
      title: title.trim(),
      topic: title.trim(),
      date: date.trim(),
      time: time.trim(),
      description: description.trim(),
      recordSession,
      participants: [],
      materials: [],
      assignments: [
        {
          id: `${Date.now()}-assignment`,
          title: 'Upload your practice work',
          submissions: [],
        },
      ],
    });
  };

  const handleCreate = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const session = await saveBaseSession();

      if (!session) {
        return;
      }

      await addNotification({
        type: 'session',
        title: editingSession ? 'Session updated' : 'Session scheduled',
        body: `${session.title} was ${editingSession ? 'updated' : 'scheduled'} for ${session.date} at ${session.time}.`,
        data: { sessionId: session.id },
      });

      Alert.alert(editingSession ? 'Session Updated' : 'Session Created', 'Your session is ready.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to create session.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCalendar = async () => {
    if (saving) {
      return;
    }

    const startDate = buildDateFromInputs(date, time);
    if (!startDate) {
      Alert.alert('Invalid date or time', 'Use a valid date and time before adding to calendar.');
      return;
    }

    setSaving(true);

    try {
      const granted = await requestCalendarPermission();
      if (!granted) {
        showPermissionDeniedAlert('calendar');
        return;
      }

      const session = await saveBaseSession();
      if (!session) {
        return;
      }

      const calendarId = await ensureCalendarId();
      await Calendar.createEventAsync(calendarId, {
        title: session.title,
        startDate,
        endDate: new Date(startDate.getTime() + 60 * 60 * 1000),
        notes: session.description,
        alarms: [{ relativeOffset: -30 }],
      });

      await updateSession(session.id, { savedToCalendar: true });
      await addNotification({
        type: 'session',
        title: 'Session added to calendar',
        body: `${session.title} was also saved to your calendar.`,
        data: { sessionId: session.id },
      });
      Alert.alert('Added to Calendar', 'The session was saved to your calendar.');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating calendar event:', error);
      Alert.alert('Calendar error', 'Unable to create the calendar event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {editingSession ? 'Edit Session' : 'Create Session'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Schedule a learning session, attach reminders, and choose whether to keep a recording.
        </Text>

        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Session title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor={colors.textMuted}
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Time (6:30 PM)"
          placeholderTextColor={colors.textMuted}
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={[styles.input, styles.textArea, themedInput(colors)]}
          placeholder="What will participants learn?"
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View
          style={[
            styles.optionCard,
            { backgroundColor: colors.cardSecondary, borderColor: colors.border },
          ]}
        >
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Record Session</Text>
            <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
              Save a local recording artifact after live sessions end.
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
          onPress={handleCreate}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Saving...' : editingSession ? 'Update Session' : 'Create Session'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={handleAddToCalendar}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            Add to Calendar
          </Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function themedInput(colors) {
  return {
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.text,
  };
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
    marginBottom: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
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
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
