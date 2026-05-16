import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = 'LEARNING_SESSIONS';

export async function saveSessions(sessions) {
  try {
    const sessionsJson = JSON.stringify(sessions);
    await AsyncStorage.setItem(SESSIONS_KEY, sessionsJson);
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
}

export async function getSessions() {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!sessionsJson) return [];

    const sessions = JSON.parse(sessionsJson);

    // Ensure we return an array and filter out invalid items
    if (!Array.isArray(sessions)) {
      console.warn('Sessions data is not an array, resetting to empty array');
      await saveSessions([]);
      return [];
    }

    // Filter out any invalid session objects
    const validSessions = sessions.filter(session =>
      session &&
      typeof session === 'object' &&
      session.id &&
      typeof session.id === 'string'
    );

    // If we filtered out some invalid sessions, save the cleaned data
    if (validSessions.length !== sessions.length) {
      console.warn('Found invalid session data, cleaning up');
      await saveSessions(validSessions);
    }

    return validSessions;
  } catch (error) {
    console.error('Failed to load sessions:', error);
    // Reset to empty array on error
    await saveSessions([]);
    return [];
  }
}

export async function createSession(session) {
  const sessions = await getSessions();
  const nextSession = {
    id: Date.now().toString(),
    participants: [],
    materials: [],
    assignments: [],
    savedToCalendar: false,
    recordSession: false,
    ...session,
  };
  const nextSessions = [...sessions, nextSession];
  await saveSessions(nextSessions);
  return nextSession;
}

export async function addSessionMaterial(sessionId, material) {
  const sessions = await getSessions();
  const updated = sessions.map((session) =>
    session.id === sessionId
      ? {
          ...session,
          materials: [...session.materials, material],
        }
      : session
  );
  await saveSessions(updated);
}

export async function updateSession(sessionId, updates) {
  const sessions = await getSessions();
  const updated = sessions.map((session) =>
    session.id === sessionId ? { ...session, ...updates } : session
  );
  await saveSessions(updated);
  return updated.find((session) => session.id === sessionId) ?? null;
}

export async function deleteSession(sessionId) {
  const sessions = await getSessions();
  const updated = sessions.filter((session) => session.id !== sessionId);
  await saveSessions(updated);
}

export async function getSessionById(sessionId) {
  const sessions = await getSessions();
  return sessions.find((session) => session.id === sessionId) ?? null;
}

export async function addAssignmentSubmission(
  sessionId,
  assignmentId,
  submission
) {
  const sessions = await getSessions();
  const updated = sessions.map((session) =>
    session.id === sessionId
      ? {
          ...session,
          assignments: session.assignments.map((assignment) =>
            assignment.id === assignmentId
              ? {
                  ...assignment,
                  submissions: [...assignment.submissions, submission],
                }
              : assignment
          ),
        }
      : session
  );
  await saveSessions(updated);
}
