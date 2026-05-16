import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Settings2 } from 'lucide-react-native';
import NotificationBell from '../../components/Notifications/NotificationBell';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileGrid from '../../components/Profile/ProfileGrid';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { getProfile } from '../../services/profileService';
import { getDummyReels } from '../../services/reelService';
import {
  getFollowersForUser,
  getFollowingForUser,
} from '../../services/socialService';
import { getPosts } from '../../services/storageService';
import { getSessions } from '../../services/sessionService';

const PROFILE_TABS = [
  { key: 'posts', label: 'Posts' },
  { key: 'reels', label: 'Reels' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'saved', label: 'Saved' },
];

export default function ProfileScreen({ navigation }) {
  const { currentUser } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      setProfile(savedProfile);

      if (!currentUser?.id) {
        return;
      }

      const [allPosts, allSessions, followerLinks, followingLinks] = await Promise.all([
        getPosts(),
        getSessions(),
        getFollowersForUser(currentUser.id),
        getFollowingForUser(currentUser.id),
      ]);

      setPosts(allPosts.filter((post) => post.authorId === currentUser.id));
      setSessions(allSessions);
      setFollowers(followerLinks);
      setFollowing(followingLinks);
    };

    loadProfile();
    const unsubscribe = navigation.addListener('focus', loadProfile);
    return unsubscribe;
  }, [currentUser, navigation]);

  const savedPosts = useMemo(
    () => posts.filter((post) => post.savedBy.includes(currentUser?.id)),
    [posts, currentUser]
  );

  const tabData = useMemo(() => {
    if (activeTab === 'reels') {
      return getDummyReels().map((item) => ({ id: item.id, title: item.caption }));
    }

    if (activeTab === 'sessions') {
      return sessions.map((item) => ({ id: item.id, title: item.title || item.topic }));
    }

    if (activeTab === 'saved') {
      return savedPosts.map((item) => ({ id: item.id, title: item.title }));
    }

    return posts.map((item) => ({ id: item.id, title: item.title }));
  }, [activeTab, posts, savedPosts, sessions]);

  const openGridItem = (item) => {
    if (activeTab === 'posts' || activeTab === 'saved') {
      const matchedPost = posts.find((post) => post.id === item.id);
      if (matchedPost) {
        navigation.navigate('PostDetails', { post: matchedPost });
      }
      return;
    }

    if (activeTab === 'sessions') {
      navigation.navigate('Materials', { sessionId: item.id });
      return;
    }

    const reel = getDummyReels().find((entry) => entry.id === item.id);
    if (reel) {
      navigation.navigate('ReelPlayer', { reel });
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Profile</Text>
        <View style={styles.topBar}>
          <View style={styles.topBarRight}>
            <NotificationBell colors={colors} navigation={navigation} />
            <Pressable
              style={[styles.iconButton, { backgroundColor: colors.cardSecondary }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Settings2 size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.heroCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.profileRow}>
            <ProfileHeader
              username=""
              avatarUri={profile?.avatarUri}
              avatarScale={profile?.avatarScale ?? 1}
              colors={colors}
            />
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={[styles.statValue, { color: colors.text }]}>{posts.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Posts</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={[styles.statValue, { color: colors.text }]}>{followers.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Followers</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={[styles.statValue, { color: colors.text }]}>{following.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.nameText, { color: colors.text }]}>
            {profile?.name || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
          </Text>
          <Text style={[styles.handleText, { color: colors.textMuted }]}>
            @{profile?.username || currentUser?.username}
          </Text>
          <Text style={[styles.bioText, { color: colors.text }]}>
            {profile?.bio || 'Teach what you know. Learn what you need. Build your learning network.'}
          </Text>
        </View>

        <ProfileTabs
          colors={colors}
          tabs={PROFILE_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <ProfileGrid
          colors={colors}
          data={tabData}
          type={activeTab}
          onPress={openGridItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 34,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 16,
    marginTop: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  nameText: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  handleText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 21,
  },
});
