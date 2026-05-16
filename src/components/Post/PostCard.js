import React, { memo, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import ImagePost from './ImagePost';
import VideoPost from './VideoPost';

function PostCard({
  post,
  colors,
  relativeTime,
  isVisible,
  onPress,
  onLike,
  onComment,
  onShare,
  onSave,
}) {
  const isLiked = post.likes?.includes(post.currentUserId);
  const isSaved = post.savedBy?.includes(post.currentUserId);
  const lastTapRef = useRef(0);
  const scale = useRef(new Animated.Value(1)).current;
  const commentsCount =
    post.comments?.reduce((total, item) => total + 1 + item.replies.length, 0) ?? 0;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 260) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.03, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
      onLike?.();
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;
    onPress?.();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable onPress={handleDoubleTap}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              post.authorAvatar ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
          }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={[styles.username, { color: colors.text }]}>@{post.authorName}</Text>
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>{relativeTime}</Text>
        </View>
      </View>

      {post.title ? (
        <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
      ) : null}

      {post.caption ? (
        <Text style={[styles.caption, { color: colors.textMuted }]}>{post.caption}</Text>
      ) : null}

      {post.type === 'image' || post.type === 'gallery' ? (
        <ImagePost uri={post.mediaUri} uris={post.mediaUris} />
      ) : null}
      {post.type === 'video' ? <VideoPost uri={post.mediaUri} isVisible={isVisible} /> : null}
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.actionRow}>
          <Pressable style={styles.action} onPress={onLike}>
            <Heart
              size={20}
              color={isLiked ? colors.danger : colors.text}
              fill={isLiked ? colors.danger : 'transparent'}
            />
            <Text style={[styles.actionText, { color: colors.text }]}>{post.likes.length}</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={onComment}>
            <MessageCircle size={20} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>{commentsCount}</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={onShare}>
            <Share2 size={20} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>{post.shares}</Text>
          </Pressable>
        </View>
        <Pressable style={styles.action} onPress={onSave}>
          <Bookmark
            size={20}
            color={isSaved ? colors.primary : colors.text}
            fill={isSaved ? colors.primary : 'transparent'}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default memo(PostCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 18,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
