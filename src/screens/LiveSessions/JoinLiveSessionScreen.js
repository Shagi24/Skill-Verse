import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { getLiveSessions, joinLiveSession } from '../../services/liveSessionService';

export default function JoinLiveSessionScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      const liveSessions = await getLiveSessions();
      setSessions(liveSessions.filter((session) => session.isLive));
    };

    loadSessions();

    const unsubscribe = navigation.addListener('focus', loadSessions);
    return unsubscribe;
  }, [navigation]);

  const handleJoin = async (session) => {
    const updated = await joinLiveSession(session.id);

    if (!updated) {
      Alert.alert('This live session is no longer available.');
      return;
    }

    navigation.navigate('LiveSession', {
      session: updated,
      isHost: false,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={sessions}
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
              No live sessions right now
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Start one from the Sessions tab when you want to teach live.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.sessionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              Host: {item.hostName}
            </Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {item.participantCount} watching
            </Text>
            <Pressable
              style={[styles.joinButton, { backgroundColor: colors.primary }]}
              onPress={() => handleJoin(item)}
            >
              <Text style={styles.joinButtonText}>Join Live</Text>
            </Pressable>
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
    gap: 14,
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
    textAlign: 'center',
    lineHeight: 20,
  },
  sessionCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 14,
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    marginBottom: 4,
  },
  joinButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
