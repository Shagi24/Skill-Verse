import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Animated,
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FAB } from 'react-native-paper';
import PostCard from '../../components/Post/PostCard';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { addNotification, formatRelativeTime } from '../../services/notificationService';
import { getPosts, savePosts } from '../../services/storageService';
import { getProfile } from '../../services/profileService';
import { DEFAULT_AVATAR } from '../../utils/avatar';

const MOCK_FEED = [
  {
    id: 'mock-1',
    title: 'Java Revision Sprint',
    caption: 'Three debugging habits that save time in every Java lab.',
    authorId: 'mock-1',
    authorName: 'code.daily',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    type: 'image',
    mediaUri: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80',
    mediaName: 'code-feed.jpg',
    mediaMimeType: 'image/jpeg',
    likes: [],
    shares: 2,
    savedBy: [],
    commentsEnabled: true,
    comments: [],
  },
  {
    id: 'mock-2',
    title: 'Arduino Sensor Build',
    caption: 'A quick reel-style overview of wiring a soil moisture sensor to ESP32.',
    authorId: 'mock-2',
    authorName: 'arduino.builder',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    type: 'video',
    mediaUri: 'https://cdn.coverr.co/videos/coverr-close-up-of-hands-typing-on-a-laptop-1566633066600?download=1080p',
    mediaName: 'arduino.mp4',
    mediaMimeType: 'video/mp4',
    likes: [],
    shares: 5,
    savedBy: [],
    commentsEnabled: true,
    comments: [],
  },
  {
    id: 'mock-3',
    title: 'Physics Thread',
    caption: 'A clean summary of motion, force, and momentum for tomorrow’s session.',
    authorId: 'mock-3',
    authorName: 'physics.hub',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    type: 'text',
    mediaUri: '',
    mediaName: '',
    mediaMimeType: '',
    likes: [],
    shares: 1,
    savedBy: [],
    commentsEnabled: true,
    comments: [],
  },
];

const PAGE_SIZE = 4;

function composeFeed(savedPosts, currentUserId) {
  const normalizedSaved = savedPosts.map((post) => ({
    ...post,
    currentUserId,
    authorAvatar: post.authorAvatar || DEFAULT_AVATAR,
  }));
  const normalizedMock = MOCK_FEED.map((post) => ({
    ...post,
    currentUserId,
  }));

  return [...normalizedSaved, ...normalizedMock].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export default function HomeScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [allPosts, setAllPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleVideoId, setVisibleVideoId] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;

  const loadFeed = useCallback(async () => {
    setLoading(true);
    const storedPosts = await getPosts();
    const profile = await getProfile();
    const hydratedPosts = storedPosts.map((post) =>
      post.authorId === currentUser.id
        ? {
            ...post,
            authorAvatar: profile?.avatarUri || DEFAULT_AVATAR,
          }
        : {
            ...post,
            authorAvatar: post.authorAvatar || DEFAULT_AVATAR,
          }
    );
    setAllPosts(composeFeed(hydratedPosts, currentUser.id));
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
    setLoading(false);
  }, [currentUser.id, fade]);

  useEffect(() => {
    loadFeed();
    const unsubscribe = navigation.addListener('focus', loadFeed);
    return unsubscribe;
  }, [loadFeed, navigation]);

  const visiblePosts = useMemo(
    () => allPosts.slice(0, visibleCount),
    [allPosts, visibleCount]
  );

  const updateLocalAndStoredPost = async (updatedPost) => {
    const nextFeed = allPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post));
    setAllPosts(nextFeed);

    if (!updatedPost.id.startsWith('mock-')) {
      const storedPosts = await getPosts();
      const nextStored = storedPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
      await savePosts(nextStored);
    }
  };

  const handleLike = async (post) => {
    const isLiked = post.likes.includes(currentUser.id);
    const updatedPost = {
      ...post,
      likes: isLiked
        ? post.likes.filter((id) => id !== currentUser.id)
        : [...post.likes, currentUser.id],
    };
    await updateLocalAndStoredPost(updatedPost);
    await addNotification({
      type: 'like',
      title: isLiked ? 'Post unliked' : 'Post liked',
      body: `${currentUser.username || currentUser.firstName} ${isLiked ? 'removed a like from' : 'liked'} ${post.authorName}'s post.`,
      data: { postId: post.id },
    });
  };

  const handleSave = async (post) => {
    const isSaved = post.savedBy.includes(currentUser.id);
    const updatedPost = {
      ...post,
      savedBy: isSaved
        ? post.savedBy.filter((id) => id !== currentUser.id)
        : [...post.savedBy, currentUser.id],
    };
    await updateLocalAndStoredPost(updatedPost);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setVisibleCount(PAGE_SIZE);
    await loadFeed();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (visibleCount < allPosts.length) {
      setVisibleCount((current) => current + PAGE_SIZE);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&q=80' }}
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: 0.05 }}
      />
      {loading ? (
        <View style={styles.content}>
          {[0, 1, 2].map((item) => (
            <View
              key={item}
              style={[
                styles.skeletonCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.skeletonHeader, { backgroundColor: colors.cardSecondary }]} />
              <View style={[styles.skeletonLine, { backgroundColor: colors.cardSecondary }]} />
              <View style={[styles.skeletonMedia, { backgroundColor: colors.cardSecondary }]} />
            </View>
          ))}
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fade }}>
          <FlatList
            data={visiblePosts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.content}
            initialNumToRender={3}
            maxToRenderPerBatch={4}
            windowSize={5}
            removeClippedSubviews
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            onEndReachedThreshold={0.45}
            onEndReached={handleLoadMore}
            ListEmptyComponent={
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No skill posts yet</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  Start the feed by creating your first post.
                </Text>
              </View>
            }
            onViewableItemsChanged={({ viewableItems }) => {
              const visibleVideo = viewableItems.find((item) => item.item?.type === 'video');
              setVisibleVideoId(visibleVideo?.item?.id ?? null);
            }}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                colors={colors}
                relativeTime={formatRelativeTime(item.createdAt)}
                isVisible={visibleVideoId === item.id}
                onPress={() => navigation.navigate('PostDetails', { post: item })}
                onLike={() => handleLike(item)}
                onComment={() => navigation.navigate('PostDetails', { post: item })}
                onShare={() => navigation.navigate('PostDetails', { post: item })}
                onSave={() => handleSave(item)}
              />
            )}
          />
        </Animated.View>
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('CreatePost')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 12,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
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
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    borderRadius: 999,
  },
  skeletonCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  skeletonHeader: {
    width: 160,
    height: 18,
    borderRadius: 999,
    marginBottom: 12,
  },
  skeletonLine: {
    width: '70%',
    height: 14,
    borderRadius: 999,
    marginBottom: 14,
  },
  skeletonMedia: {
    width: '100%',
    height: 260,
    borderRadius: 18,
  },
});
