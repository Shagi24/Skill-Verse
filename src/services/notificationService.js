import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const NOTIFICATIONS_KEY = 'SKILLVERSE_NOTIFICATIONS';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

function normalizeNotification(item) {
  return {
    id: item.id ?? Date.now().toString(),
    type: item.type ?? 'activity',
    title: item.title ?? 'SkillVerse update',
    body: item.body ?? '',
    createdAt: item.createdAt ?? new Date().toISOString(),
    read: item.read ?? false,
    data: item.data ?? {},
  };
}

export async function requestNotificationPermission() {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.granted) {
      return true;
    }

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
}

export async function getNotificationHistory() {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored).map(normalizeNotification) : [];
  } catch (error) {
    console.error('Failed to load notifications:', error);
    return [];
  }
}

export async function saveNotificationHistory(items) {
  try {
    await AsyncStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(items.map(normalizeNotification))
    );
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

export async function addNotification(notification) {
  const nextItem = normalizeNotification(notification);
  const history = await getNotificationHistory();
  const nextHistory = [nextItem, ...history];
  await saveNotificationHistory(nextHistory);

  try {
    await Notifications.setBadgeCountAsync(
      nextHistory.filter((item) => !item.read).length
    );
    await Notifications.scheduleNotificationAsync({
      content: {
        title: nextItem.title,
        body: nextItem.body,
        data: nextItem.data,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Failed to present local notification:', error);
  }

  return nextItem;
}

export async function markNotificationsRead() {
  const history = await getNotificationHistory();
  const nextHistory = history.map((item) => ({ ...item, read: true }));
  await saveNotificationHistory(nextHistory);
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Failed to clear badge count:', error);
  }
  return nextHistory;
}

export async function getUnreadNotificationCount() {
  const history = await getNotificationHistory();
  return history.filter((item) => !item.read).length;
}

export function formatRelativeTime(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
