import AsyncStorage from '@react-native-async-storage/async-storage';

const FOLLOW_REQUESTS_KEY = 'SKILLVERSE_FOLLOW_REQUESTS';

export async function getFollowRequests() {
  try {
    const requestsJson = await AsyncStorage.getItem(FOLLOW_REQUESTS_KEY);
    return requestsJson ? JSON.parse(requestsJson) : [];
  } catch (error) {
    console.error('Failed to load follow requests:', error);
    return [];
  }
}

export async function saveFollowRequests(requests) {
  try {
    await AsyncStorage.setItem(FOLLOW_REQUESTS_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save follow requests:', error);
  }
}

export async function sendFollowRequest(fromUserId, toUserId) {
  const requests = await getFollowRequests();
  const existing = requests.find(
    (request) =>
      request.fromUserId === fromUserId &&
      request.toUserId === toUserId &&
      request.status === 'pending'
  );

  if (existing) {
    return { success: false, message: 'Follow request already sent.' };
  }

  const nextRequests = [
    ...requests,
    {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      status: 'pending',
    },
  ];

  await saveFollowRequests(nextRequests);
  return { success: true };
}

export async function respondToFollowRequest(requestId, status) {
  const requests = await getFollowRequests();
  const updated = requests.map((request) =>
    request.id === requestId ? { ...request, status } : request
  );
  await saveFollowRequests(updated);
}

export async function getIncomingFollowRequests(userId) {
  const requests = await getFollowRequests();
  return requests.filter(
    (request) => request.toUserId === userId && request.status === 'pending'
  );
}

export async function getFollowersForUser(userId) {
  const requests = await getFollowRequests();
  return requests.filter(
    (request) => request.toUserId === userId && request.status === 'accepted'
  );
}

export async function getFollowingForUser(userId) {
  const requests = await getFollowRequests();
  return requests.filter(
    (request) => request.fromUserId === userId && request.status === 'accepted'
  );
}

export async function canUsersChat(userA, userB) {
  const requests = await getFollowRequests();
  return requests.some(
    (request) =>
      request.status === 'accepted' &&
      ((request.fromUserId === userA && request.toUserId === userB) ||
        (request.fromUserId === userB && request.toUserId === userA))
  );
}
