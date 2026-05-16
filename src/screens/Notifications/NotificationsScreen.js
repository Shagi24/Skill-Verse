import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import {
  formatRelativeTime,
  getNotificationHistory,
  markNotificationsRead,
} from '../../services/notificationService';

export default function NotificationsScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      await markNotificationsRead();
      setItems(await getNotificationHistory());
    };

    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Posts, likes, comments, messages, and session updates.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No activity yet</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Your notifications and social activity will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.itemBody, { color: colors.textMuted }]}>{item.body}</Text>
            <Text style={[styles.itemMeta, { color: colors.primary }]}>
              {formatRelativeTime(item.createdAt)}
            </Text>
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
    padding: 18,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
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
  itemCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  itemMeta: {
    fontSize: 12,
    fontWeight: '700',
  },
});
