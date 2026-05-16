import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ProfileHeader from '../../components/ProfileHeader';
import { ThemeContext } from '../../context/ThemeContext';
import { getProfile, saveProfile } from '../../services/profileService';
import {
  requestImageLibraryPermission,
  showPermissionDeniedAlert,
} from '../../services/permissionsService';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [avatarScale, setAvatarScale] = useState(1);
  const [existingProfile, setExistingProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getProfile();

      if (!profile) {
        return;
      }

      setExistingProfile(profile);
      setName(profile.name ?? '');
      setUsername(profile.username ?? '');
      setCountry(profile.country ?? '');
      setBio(profile.bio ?? '');
      setSkills(profile.skills?.join(', ') ?? '');
      setAvatarUri(profile.avatarUri ?? '');
      setAvatarScale(profile.avatarScale ?? 1);
    };

    loadProfile();
  }, []);

  const handlePickImage = async () => {
    const granted = await requestImageLibraryPermission();
    if (!granted) {
      showPermissionDeniedAlert('media library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const nextProfile = {
      ...(existingProfile ?? {}),
      name: name.trim(),
      username: username.trim(),
      country: country.trim(),
      bio: bio.trim(),
      skills: skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      avatarUri,
      avatarScale,
    };

    await saveProfile(nextProfile);
    Alert.alert('Profile Saved');
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Update your public identity, profile photo, and the skills you want others to discover.
        </Text>

        <ProfileHeader
          username={username || name || 'Your Profile'}
          avatarUri={avatarUri}
          avatarScale={avatarScale}
          colors={colors}
        />

        <Pressable
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          onPress={handlePickImage}
        >
          <Text style={styles.uploadButtonText}>Change Profile Photo</Text>
        </Pressable>

        <View
          style={[
            styles.scaleCard,
            { backgroundColor: colors.cardSecondary, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.scaleTitle, { color: colors.text }]}>Photo Scale</Text>
          <Text style={[styles.scaleValue, { color: colors.textMuted }]}>
            {avatarScale.toFixed(1)}x
          </Text>
          <View style={styles.scaleActions}>
            <Pressable
              style={[styles.scaleButton, { borderColor: colors.border }]}
              onPress={() => setAvatarScale((current) => Math.max(1, current - 0.1))}
            >
              <Text style={[styles.scaleButtonText, { color: colors.text }]}>-</Text>
            </Pressable>
            <Pressable
              style={[styles.scaleButton, { borderColor: colors.border }]}
              onPress={() => setAvatarScale((current) => Math.min(2, current + 0.1))}
            >
              <Text style={[styles.scaleButtonText, { color: colors.text }]}>+</Text>
            </Pressable>
          </View>
        </View>

        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Username"
          placeholderTextColor={colors.textMuted}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Country"
          placeholderTextColor={colors.textMuted}
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={[styles.input, styles.textArea, themedInput(colors)]}
          placeholder="Bio"
          placeholderTextColor={colors.textMuted}
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <TextInput
          style={[styles.input, themedInput(colors)]}
          placeholder="Skills (comma separated)"
          placeholderTextColor={colors.textMuted}
          value={skills}
          onChangeText={setSkills}
        />
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </Pressable>
      </View>
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
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 28,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  uploadButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  scaleCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  scaleValue: {
    fontSize: 13,
    marginBottom: 12,
  },
  scaleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scaleButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scaleButtonText: {
    fontSize: 22,
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
