import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProfileHeader({
  username = 'Username',
  avatarUri,
  avatarScale = 1,
  colors,
}) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imagePlaceholder,
          { backgroundColor: colors.primarySoft },
        ]}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={[styles.image, { transform: [{ scale: avatarScale }] }]}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.imagePlaceholderText, { color: colors.textMuted }]}>
            ADD
          </Text>
        )}
      </View>
      {username ? (
        <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  imagePlaceholder: {
    width: 116,
    height: 116,
    borderRadius: 58,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
  },
});
