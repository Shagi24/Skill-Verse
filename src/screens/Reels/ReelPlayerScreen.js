import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { ThemeContext } from '../../context/ThemeContext';

export default function ReelPlayerScreen({ route }) {
  const { colors } = useContext(ThemeContext);
  const { reel } = route.params;

  return (
    <View style={styles.screen}>
      <Video
        source={{ uri: reel.videoUri }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        useNativeControls
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>@{reel.username}</Text>
        <Text style={styles.caption}>{reel.caption}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          Likes {reel.likes} {'\u2022'} Shares {reel.shares}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  overlay: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 28,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  caption: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
  },
});
