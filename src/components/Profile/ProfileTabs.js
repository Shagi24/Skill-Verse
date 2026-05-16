import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileTabs({ colors, tabs, activeTab, onChange }) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.primarySoft : 'transparent',
              },
            ]}
            onPress={() => onChange(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.primary : colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 6,
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
