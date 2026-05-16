import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_KEY = 'SKILL_POSTS';

function normalizeReply(reply) {
  return {
    id: reply.id ?? `${Date.now()}-${Math.random()}`,
    authorId: reply.authorId ?? '',
    authorName: reply.authorName ?? 'Member',
    text: reply.text ?? '',
    likes: reply.likes ?? [],
  };
}

function normalizeComment(comment) {
  return {
    id: comment.id ?? `${Date.now()}-${Math.random()}`,
    authorId: comment.authorId ?? '',
    authorName: comment.authorName ?? 'Member',
    text: comment.text ?? '',
    likes: comment.likes ?? [],
    replies: (comment.replies ?? []).map(normalizeReply),
  };
}

function normalizePost(post) {
  const mediaUris = Array.isArray(post.mediaUris)
    ? post.mediaUris
    : post.mediaUri
      ? [post.mediaUri]
      : [];

  return {
    id: post.id ?? Date.now().toString(),
    title: post.title ?? '',
    description: post.description ?? '',
    caption: post.caption ?? post.description ?? '',
    authorId: post.authorId ?? '',
    authorName: post.authorName ?? 'SkillVerse User',
    authorAvatar: post.authorAvatar ?? '',
    createdAt: post.createdAt ?? new Date().toISOString(),
    type: post.type ?? 'text',
    mediaUri: post.mediaUri ?? '',
    mediaUris,
    mediaName: post.mediaName ?? '',
    mediaMimeType: post.mediaMimeType ?? '',
    likes: post.likes ?? [],
    shares: post.shares ?? 0,
    savedBy: post.savedBy ?? [],
    commentsEnabled: post.commentsEnabled ?? true,
    comments: (post.comments ?? []).map(normalizeComment),
  };
}

export async function savePosts(posts) {
  try {
    const postsJson = JSON.stringify(posts.map(normalizePost));
    await AsyncStorage.setItem(POSTS_KEY, postsJson);
  } catch (error) {
    console.error('Failed to save posts:', error);
  }
}

export async function getPosts() {
  try {
    const postsJson = await AsyncStorage.getItem(POSTS_KEY);
    return postsJson ? JSON.parse(postsJson).map(normalizePost) : [];
  } catch (error) {
    console.error('Failed to load posts:', error);
    return [];
  }
}

export async function upsertPost(updatedPost) {
  const posts = await getPosts();
  const exists = posts.some((post) => post.id === updatedPost.id);
  const nextPosts = exists
    ? posts.map((post) => (post.id === updatedPost.id ? normalizePost(updatedPost) : post))
    : [normalizePost(updatedPost), ...posts];

  await savePosts(nextPosts);
  return nextPosts;
}

export async function deletePostById(postId) {
  const posts = await getPosts();
  const nextPosts = posts.filter((post) => post.id !== postId);
  await savePosts(nextPosts);
  return nextPosts;
}
