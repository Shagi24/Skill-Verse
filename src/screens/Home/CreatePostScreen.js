import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import { Camera, ImagePlus, Video as VideoIcon } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { addNotification } from '../../services/notificationService';
import { getProfile } from '../../services/profileService';
import {
  getPosts,
  savePosts,
} from '../../services/storageService';
import { DEFAULT_AVATAR } from '../../utils/avatar';

export default function CreatePostScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const editingPost = route.params?.post;
  const capturedMedia = route.params?.capturedMedia;
  const [title, setTitle] = useState(editingPost?.title ?? '');
  const [caption, setCaption] = useState(editingPost?.caption ?? editingPost?.description ?? '');
  const [commentsEnabled, setCommentsEnabled] = useState(
    editingPost?.commentsEnabled ?? true
  );
  const [media, setMedia] = useState(
    editingPost?.mediaUri
      ? {
          uri: editingPost.mediaUri,
          uris: editingPost.mediaUris ?? [],
          type: editingPost.type,
          mimeType: editingPost.mediaMimeType,
          name: editingPost.mediaName,
        }
      : null
  );
  const [uploadProgress] = useState(media ? 100 : 0);

  useEffect(() => {
    if (capturedMedia?.uri) {
      setMedia(capturedMedia);
      navigation.setParams({ capturedMedia: undefined });
    }
  }, [capturedMedia, navigation]);

  const postType = useMemo(() => {
    if (!media) {
      return 'text';
    }
    if (media.type === 'gallery') {
      return 'gallery';
    }
    return media.type === 'video' ? 'video' : 'image';
  }, [media]);

  const pickMedia = async (mediaType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'video' ? ['videos'] : ['images'],
      quality: 1,
      allowsEditing: mediaType !== 'video',
      allowsMultipleSelection: mediaType === 'image',
      selectionLimit: mediaType === 'image' ? 5 : 1,
    });

    if (!result.canceled && result.assets?.length) {
      if (mediaType === 'image' && result.assets.length > 1) {
        setMedia({
          uri: result.assets[0].uri,
          uris: result.assets.map((asset) => asset.uri),
          type: 'gallery',
          mimeType: 'image/jpeg',
          name: `gallery-${Date.now()}`,
        });
        return;
      }

      const asset = result.assets[0];
      setMedia({
        uri: asset.uri,
        uris: [asset.uri],
        type: mediaType,
        mimeType: asset.mimeType,
        name: asset.fileName || `${mediaType}-${Date.now()}`,
      });
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() && !caption.trim() && !media?.uri) {
      Alert.alert('Empty post', 'Add text or media before posting.');
      return;
    }

    const profile = await getProfile();
    const existingPosts = await getPosts();
    const postToSave = {
      id: editingPost?.id ?? Date.now().toString(),
      title: title.trim(),
      description: caption.trim(),
      caption: caption.trim(),
      authorId: editingPost?.authorId ?? currentUser.id,
      authorName:
        editingPost?.authorName ??
        currentUser.username ??
        `${currentUser.firstName} ${currentUser.lastName}`,
      authorAvatar: editingPost?.authorAvatar ?? profile?.avatarUri ?? DEFAULT_AVATAR,
      createdAt: editingPost?.createdAt ?? new Date().toISOString(),
      type: postType,
      mediaUri: media?.uri ?? '',
      mediaUris: media?.uris ?? (media?.uri ? [media.uri] : []),
      mediaName: media?.name ?? '',
      mediaMimeType: media?.mimeType ?? '',
      likes: editingPost?.likes ?? [],
      shares: editingPost?.shares ?? 0,
      savedBy: editingPost?.savedBy ?? [],
      comments: editingPost?.comments ?? [],
      commentsEnabled,
    };

    const updatedPosts = editingPost
      ? existingPosts.map((post) => (post.id === editingPost.id ? postToSave : post))
      : [postToSave, ...existingPosts];

    await savePosts(updatedPosts);
    await addNotification({
      type: 'post',
      title: editingPost ? 'Post updated' : 'New post created',
      body: `${postToSave.authorName} ${editingPost ? 'updated' : 'shared'} a ${postType} post.`,
      data: { postId: postToSave.id },
    });

    Alert.alert(editingPost ? 'Post Updated' : 'Post Created');
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: colors.text }]}>
        {editingPost ? 'Edit Post' : 'Create Post'}
      </Text>
      <Text style={[styles.subheading, { color: colors.textMuted }]}>
        Publish text, a photo, or a short video to your learning feed.
      </Text>

      <TextInput
        style={[styles.input, themedInput(colors)]}
        placeholder="Post title"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea, themedInput(colors)]}
        placeholder="Write your caption"
        placeholderTextColor={colors.textMuted}
        value={caption}
        onChangeText={setCaption}
        multiline
      />
      <Text style={[styles.characterCount, { color: colors.textMuted }]}>
        {caption.length}/280
      </Text>

      <View style={styles.mediaActions}>
        <Pressable
          style={[styles.mediaButton, { backgroundColor: colors.cardSecondary }]}
          onPress={() => pickMedia('image')}
        >
          <ImagePlus size={18} color={colors.text} />
          <Text style={[styles.mediaButtonText, { color: colors.text }]}>Pick Image</Text>
        </Pressable>
        <Pressable
          style={[styles.mediaButton, { backgroundColor: colors.cardSecondary }]}
          onPress={() => pickMedia('video')}
        >
          <VideoIcon size={18} color={colors.text} />
          <Text style={[styles.mediaButtonText, { color: colors.text }]}>Pick Video</Text>
        </Pressable>
        <Pressable
          style={[styles.mediaButton, { backgroundColor: colors.cardSecondary }]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Camera size={18} color={colors.text} />
          <Text style={[styles.mediaButtonText, { color: colors.text }]}>Open Camera</Text>
        </Pressable>
      </View>

      {media?.uri ? (
        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.previewTitle, { color: colors.text }]}>Preview</Text>
          {postType === 'image' ? (
            <Image source={{ uri: media.uri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <Video
              source={{ uri: media.uri }}
              style={styles.previewImage}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              shouldPlay={false}
            />
          )}
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.cardSecondary },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${uploadProgress}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>
            Upload progress placeholder
          </Text>
          <Pressable onPress={() => setMedia(null)}>
            <Text style={[styles.clearText, { color: colors.danger }]}>Remove media</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        style={[
          styles.commentToggle,
          {
            backgroundColor: commentsEnabled ? colors.cardSecondary : colors.background,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setCommentsEnabled((current) => !current)}
      >
        <Text style={[styles.commentToggleText, { color: colors.text }]}>
          Comments {commentsEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>
          {editingPost ? 'Update Post' : 'Publish Post'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function themedInput(colors) {
  return {
    backgroundColor: colors.card,
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
  heading: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  characterCount: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: -6,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  mediaActions: {
    gap: 10,
    marginBottom: 14,
  },
  mediaButton: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  previewCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    marginBottom: 10,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
  },
  commentToggle: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  commentToggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
