import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { getChatsForUser, sendChatMessage } from '../../services/chatService';
import { addNotification } from '../../services/notificationService';
import { getProfile } from '../../services/profileService';
import { getSessions, saveSessions } from '../../services/sessionService';
import { getPosts, savePosts } from '../../services/storageService';
import { DEFAULT_AVATAR } from '../../utils/avatar';

export default function PostDetailsScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [post, setPost] = useState(route.params.post);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const likeScale = useRef(new Animated.Value(1)).current;

  const commentsCount = useMemo(
    () =>
      post.comments.reduce(
        (total, comment) => total + 1 + comment.replies.length,
        0
      ),
    [post.comments]
  );

  const persistPost = async (updatedPost) => {
    const posts = await getPosts();
    const profile = await getProfile();
    const normalizedPost =
      updatedPost.authorId === currentUser.id
        ? {
            ...updatedPost,
            authorAvatar: profile?.avatarUri || DEFAULT_AVATAR,
          }
        : {
            ...updatedPost,
            authorAvatar: updatedPost.authorAvatar || DEFAULT_AVATAR,
          };
    const updatedPosts = posts.map((item) =>
      item.id === normalizedPost.id ? normalizedPost : item
    );
    await savePosts(updatedPosts);
    setPost(normalizedPost);
  };

  const deletePost = async () => {
    const posts = await getPosts();
    const updatedPosts = posts.filter((p) => p.id !== post.id);

    await savePosts(updatedPosts);
    Alert.alert('Post Deleted');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: deletePost },
    ]);
  };

  const handleLike = async () => {
    const isLiked = post.likes.includes(currentUser.id);
    const updatedPost = {
      ...post,
      likes: isLiked
        ? post.likes.filter((id) => id !== currentUser.id)
        : [...post.likes, currentUser.id],
    };

    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.18,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    await persistPost(updatedPost);
    await addNotification({
      type: 'like',
      title: isLiked ? 'Post unliked' : 'Post liked',
      body: `${currentUser.username || currentUser.firstName} ${isLiked ? 'removed a like from' : 'liked'} ${post.authorName}'s post.`,
      data: { postId: post.id },
    });
  };

  const incrementShares = async () => {
    const updatedPost = { ...post, shares: post.shares + 1 };
    await persistPost(updatedPost);
    return updatedPost;
  };

  const handleShare = async (destination) => {
    if (destination === 'external') {
      await incrementShares();
      await Share.share({
        message: `${post.title}\n\n${post.description}`,
      });
      return;
    }

    if (destination === 'sessions') {
      await incrementShares();
      const sessions = await getSessions();
      if (sessions.length) {
        const updatedSessions = sessions.map((session, index) =>
          index === 0
            ? {
                ...session,
                materials: [
                  ...session.materials,
                  {
                    id: `${Date.now()}`,
                    name: `Shared Post: ${post.title}`,
                    uri: `shared-post://${post.id}`,
                    mimeType: 'text/post-link',
                  },
                ],
              }
            : session
        );
        await saveSessions(updatedSessions);
        Alert.alert('Shared to sessions', 'The post was attached to your first session.');
      }
      return;
    }

    if (destination === 'chats') {
      const chats = await getChatsForUser(currentUser.id);
      if (!chats.length) {
        Alert.alert(
          'No chats available',
          'Start a chat with an accepted connection before sharing posts there.'
        );
        return;
      }

      await incrementShares();
      await sendChatMessage(chats[0].id, {
        id: `${Date.now()}`,
        senderId: currentUser.id,
        text: `Shared post: ${post.title}`,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Shared to chat', 'The post was sent to your latest chat.');
      return;
    }

    Alert.alert(
      'Share options',
      'Choose where to share this post.',
      [
        { text: 'Chats', onPress: () => handleShare('chats') },
        { text: 'Sessions', onPress: () => handleShare('sessions') },
        { text: 'Other apps', onPress: () => handleShare('external') },
      ]
    );
  };

  const submitComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    const updatedPost = {
      ...post,
      comments: [
        ...post.comments,
        {
          id: `${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.username || currentUser.firstName,
          text: commentText.trim(),
          likes: [],
          replies: [],
        },
      ],
    };
    setCommentText('');
    await persistPost(updatedPost);
    await addNotification({
      type: 'comment',
      title: 'New comment',
      body: `${currentUser.username || currentUser.firstName} commented on ${post.authorName}'s post.`,
      data: { postId: post.id },
    });
  };

  const submitReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) {
      return;
    }

    const updatedPost = {
      ...post,
      comments: post.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: `${Date.now()}`,
                  authorId: currentUser.id,
                  authorName: currentUser.username || currentUser.firstName,
                  text: replyText[commentId].trim(),
                  likes: [],
                },
              ],
            }
          : comment
      ),
    };

    setReplyText((current) => ({ ...current, [commentId]: '' }));
    await persistPost(updatedPost);
    await addNotification({
      type: 'comment',
      title: 'New reply',
      body: `${currentUser.username || currentUser.firstName} replied in a comment thread.`,
      data: { postId: post.id },
    });
  };

  const toggleCommentLike = async (commentId, replyId) => {
    const updatedPost = {
      ...post,
      comments: post.comments.map((comment) => {
        if (comment.id !== commentId) {
          return comment;
        }

        if (!replyId) {
          return {
            ...comment,
            likes: comment.likes.includes(currentUser.id)
              ? comment.likes.filter((id) => id !== currentUser.id)
              : [...comment.likes, currentUser.id],
          };
        }

        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === replyId
              ? {
                  ...reply,
                  likes: reply.likes.includes(currentUser.id)
                    ? reply.likes.filter((id) => id !== currentUser.id)
                    : [...reply.likes, currentUser.id],
                }
              : reply
          ),
        };
      }),
    };

    await persistPost(updatedPost);
  };

  const toggleCommentsEnabled = async () => {
    await persistPost({
      ...post,
      commentsEnabled: !post.commentsEnabled,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, shadowColor: colors.shadow },
        ]}
      >
        <View style={styles.authorRow}>
          <Image
            source={{ uri: post.authorAvatar || DEFAULT_AVATAR }}
            style={styles.authorAvatar}
          />
          <Text style={[styles.author, { color: colors.textMuted }]}>
            @{post.authorName}
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {post.description}
        </Text>

        {post.type === 'image' && post.mediaUri ? (
          <Image source={{ uri: post.mediaUri }} style={styles.media} resizeMode="cover" />
        ) : null}
        {post.type === 'video' && post.mediaUri ? (
          <Video
            source={{ uri: post.mediaUri }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
        ) : null}

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionChip} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Heart
                size={18}
                color={post.likes.includes(currentUser.id) ? colors.danger : colors.text}
                fill={post.likes.includes(currentUser.id) ? colors.danger : 'transparent'}
              />
            </Animated.View>
            <Text style={[styles.actionChipText, { color: colors.text }]}>
              {post.likes.length}
            </Text>
          </Pressable>
          <Pressable style={styles.actionChip} onPress={() => handleShare()}>
            <Share2 size={18} color={colors.text} />
            <Text style={[styles.actionChipText, { color: colors.text }]}>
              {post.shares}
            </Text>
          </Pressable>
          <View style={styles.actionChip}>
            <MessageCircle size={18} color={colors.text} />
            <Text style={[styles.actionChipText, { color: colors.text }]}>
              {commentsCount}
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.viewMaterialsButton, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('Materials', { postId: post.id })}
        >
          <Text style={[styles.viewMaterialsText, { color: colors.text }]}>
            View Materials
          </Text>
        </Pressable>

        {post.authorId === currentUser.id ? (
          <Pressable
            style={[
              styles.toggleCommentsButton,
              {
                backgroundColor: colors.cardSecondary,
                borderColor: colors.border,
              },
            ]}
            onPress={toggleCommentsEnabled}
          >
            <Text style={[styles.toggleCommentsText, { color: colors.text }]}>
              Comments {post.commentsEnabled ? 'On' : 'Off'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('CreatePost', { post })}
        >
          <Text style={styles.primaryButtonText}>Edit Post</Text>
        </Pressable>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.danger }]}
          onPress={handleDelete}
        >
          <Text style={styles.primaryButtonText}>Delete Post</Text>
        </Pressable>
      </View>

      {post.commentsEnabled ? (
        <View
          style={[
            styles.commentsCard,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.commentsHeading, { color: colors.text }]}>
            Comments
          </Text>
          <TextInput
            style={[styles.commentInput, themedInput(colors)]}
            placeholder="Write a comment"
            placeholderTextColor={colors.textMuted}
            value={commentText}
            onChangeText={setCommentText}
          />
          <Pressable
            style={[styles.commentButton, { backgroundColor: colors.primary }]}
            onPress={submitComment}
          >
            <Text style={styles.primaryButtonText}>Post Comment</Text>
          </Pressable>

          {post.comments.map((comment) => (
            <View
              key={comment.id}
              style={[
                styles.commentCard,
                { backgroundColor: colors.cardSecondary, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.commentAuthor, { color: colors.text }]}>
                @{comment.authorName}
              </Text>
              <Text style={[styles.commentText, { color: colors.textMuted }]}>
                {comment.text}
              </Text>
              <View style={styles.commentActions}>
                <Pressable onPress={() => toggleCommentLike(comment.id)}>
                  <Text style={[styles.commentActionText, { color: colors.primary }]}>
                    Like {comment.likes.length}
                  </Text>
                </Pressable>
              </View>

              {comment.replies.map((reply) => (
                <View
                  key={reply.id}
                  style={[
                    styles.replyCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.commentAuthor, { color: colors.text }]}>
                    @{reply.authorName}
                  </Text>
                  <Text style={[styles.commentText, { color: colors.textMuted }]}>
                    {reply.text}
                  </Text>
                  <Pressable onPress={() => toggleCommentLike(comment.id, reply.id)}>
                    <Text style={[styles.commentActionText, { color: colors.primary }]}>
                      Like {reply.likes.length}
                    </Text>
                  </Pressable>
                </View>
              ))}

              <TextInput
                style={[styles.replyInput, themedInput(colors)]}
                placeholder="Reply to comment"
                placeholderTextColor={colors.textMuted}
                value={replyText[comment.id] || ''}
                onChangeText={(value) =>
                  setReplyText((current) => ({ ...current, [comment.id]: value }))
                }
              />
              <Pressable
                style={[styles.replyButton, { backgroundColor: colors.primary }]}
                onPress={() => submitReply(comment.id)}
              >
                <Text style={styles.replyButtonText}>Reply</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.disabledCommentsText, { color: colors.textMuted }]}>
          Comments are turned off for this post.
        </Text>
      )}
    </ScrollView>
  );
}

function themedInput(colors) {
  return {
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.text,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 22,
    padding: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  author: {
    fontSize: 12,
    fontWeight: '700',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 16,
  },
  media: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#0f172a',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 12,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleCommentsButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleCommentsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  viewMaterialsButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  viewMaterialsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  buttonGroup: {
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  commentsCard: {
    borderRadius: 22,
    padding: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  commentsHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  commentButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  commentCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  commentActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  replyCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  replyInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  replyButton: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  disabledCommentsText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 12,
  },
});
