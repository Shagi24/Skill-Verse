import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Bell } from 'lucide-react-native';
import { getUnreadNotificationCount } from '../../services/notificationService';

export default function NotificationBell({ colors, navigation }) {
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadCount = async () => {
        const nextCount = await getUnreadNotificationCount();
        if (active) {
          setCount(nextCount);
        }
      };

      loadCount();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <Pressable
      style={[styles.button, { backgroundColor: colors.cardSecondary }]}
      onPress={() => navigation.navigate('Notifications')}
    >
      <Bell size={18} color={colors.text} />
      {count > 0 ? (
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});
