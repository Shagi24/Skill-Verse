import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

function VideoPost({ uri, isVisible }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (isVisible) {
      videoRef.current.playAsync?.();
    } else {
      videoRef.current.pauseAsync?.();
    }
  }, [isVisible]);

  if (!uri) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={isVisible}
        usePoster
      />
    </View>
  );
}

export default memo(VideoPost);

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 12,
  },
  video: {
    width: '100%',
    height: 360,
    backgroundColor: '#0f172a',
  },
});
