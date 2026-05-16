import AsyncStorage from '@react-native-async-storage/async-storage';

const LIVE_SESSIONS_KEY = 'SKILLVERSE_LIVE_SESSIONS';

function normalizeLiveSession(session) {
  return {
    id: session.id ?? Date.now().toString(),
    title: session.title ?? 'Untitled Live Session',
    hostId: session.hostId ?? '',
    hostName: session.hostName ?? 'Host',
    startedAt: session.startedAt ?? new Date().toISOString(),
    isLive: session.isLive ?? true,
    recordSession: session.recordSession ?? false,
    participantCount: session.participantCount ?? 1,
    coverUri: session.coverUri ?? '',
  };
}

export async function getLiveSessions() {
  try {
    const sessionsJson = await AsyncStorage.getItem(LIVE_SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson).map(normalizeLiveSession) : [];
  } catch (error) {
    console.error('Failed to load live sessions:', error);
    return [];
  }
}

export async function saveLiveSessions(sessions) {
  try {
    await AsyncStorage.setItem(
      LIVE_SESSIONS_KEY,
      JSON.stringify(sessions.map(normalizeLiveSession))
    );
  } catch (error) {
    console.error('Failed to save live sessions:', error);
  }
}

export async function createLiveSession(session) {
  const sessions = await getLiveSessions();
  const newSession = normalizeLiveSession({
    ...session,
    id: Date.now().toString(),
    isLive: true,
    participantCount: 1,
  });
  const updatedSessions = [newSession, ...sessions];
  await saveLiveSessions(updatedSessions);
  return newSession;
}

export async function joinLiveSession(sessionId) {
  const sessions = await getLiveSessions();
  let joinedSession = null;

  const updatedSessions = sessions.map((session) => {
    if (session.id !== sessionId) {
      return session;
    }

    joinedSession = {
      ...session,
      participantCount: session.participantCount + 1,
    };
    return joinedSession;
  });

  await saveLiveSessions(updatedSessions);
  return joinedSession;
}

export async function endLiveSession(sessionId) {
  const sessions = await getLiveSessions();
  const updatedSessions = sessions.map((session) =>
    session.id === sessionId ? { ...session, isLive: false } : session
  );
  await saveLiveSessions(updatedSessions);
}
