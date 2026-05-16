import React, { useContext } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bell, ChevronRight, Lock, MoonStar, SquareUser, UserRound } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

function SettingsItem({ colors, icon, label, value, onPress, danger }) {
  return (
    <Pressable
      style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.cardSecondary }]}>
          {icon}
        </View>
        <View>
          <Text style={[styles.itemLabel, { color: danger ? colors.danger : colors.text }]}>
            {label}
          </Text>
          {value ? (
            <Text style={[styles.itemValue, { color: colors.textMuted }]}>{value}</Text>
          ) : null}
        </View>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default function SettingsScreen({ navigation }) {
  const { colors, mode, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Manage your account, privacy, theme, and notifications.
      </Text>

      <View style={styles.group}>
        <SettingsItem
          colors={colors}
          icon={<SquareUser size={18} color={colors.primary} />}
          label="Edit Profile"
          value="Update your photo, bio, and skills"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SettingsItem
          colors={colors}
          icon={<UserRound size={18} color={colors.primary} />}
          label="Account"
          value="Email, username, and sign-in details"
          onPress={() => Alert.alert('Account', 'TODO: Connect account management to backend settings.')}
        />
        <SettingsItem
          colors={colors}
          icon={<Bell size={18} color={colors.primary} />}
          label="Notifications"
          value="Push alerts and activity updates"
          onPress={() => Alert.alert('Notifications', 'TODO: Add granular notification toggles here.')}
        />
        <SettingsItem
          colors={colors}
          icon={<Lock size={18} color={colors.primary} />}
          label="Privacy"
          value="Followers, messaging, and session visibility"
          onPress={() => Alert.alert('Privacy', 'TODO: Add privacy controls when backend rules are connected.')}
        />
        <SettingsItem
          colors={colors}
          icon={<MoonStar size={18} color={colors.primary} />}
          label="Theme"
          value={`Current mode: ${mode}`}
          onPress={toggleTheme}
        />
      </View>

      <Pressable
        style={[styles.logoutButton, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}
        onPress={logout}
      >
        <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
      </Pressable>
    </ScrollView>
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
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  group: {
    gap: 12,
  },
  item: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  itemValue: {
    fontSize: 12,
    lineHeight: 18,
  },
  logoutButton: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
