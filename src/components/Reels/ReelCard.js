import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import ReelActions from './ReelActions';

function ReelCardComponent({
  item,
  isActive,
  colors,
  onOpen,
  onLike,
  onComment,
  onShare,
  onToggleFollow,
}) {
  return (
    <Pressable style={styles.container} onPress={onOpen}>
      <Video
        source={{ uri: item.videoUri }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isLooping
        isMuted
      />
      <View style={styles.overlay} />
      <View style={styles.bottomContent}>
        <View style={styles.userBlock}>
          <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
          <View style={styles.userText}>
            <View style={styles.identityRow}>
              <Text style={styles.username}>@{item.username}</Text>
              <Pressable
                style={[
                  styles.followButton,
                  {
                    backgroundColor: item.isFollowing ? 'rgba(255,255,255,0.14)' : '#ffffff',
                  },
                ]}
                onPress={onToggleFollow}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    { color: item.isFollowing ? '#ffffff' : '#020617' },
                  ]}
                >
                  {item.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
            <Text style={styles.audio}>{item.audioLabel}</Text>
          </View>
        </View>
        <ReelActions
          colors={colors}
          isLiked={item.isLiked}
          likes={item.likes}
          comments={item.comments}
          shares={item.shares}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
        />
      </View>
    </Pressable>
  );
}

export default memo(ReelCardComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.42)',
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 36,
  },
  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  userText: {
    flex: 1,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  username: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  followButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
  caption: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 5,
  },
  audio: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
});
