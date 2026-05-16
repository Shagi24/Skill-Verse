import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { getUsers } from '../../services/authService';
import { getChatsForUser, getOrCreateChat } from '../../services/chatService';
import {
  canUsersChat,
  sendFollowRequest,
} from '../../services/socialService';

export default function ChatListScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatAvailability, setChatAvailability] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const [allUsers, userChats] = await Promise.all([
        getUsers(),
        getChatsForUser(currentUser.id),
      ]);

      const otherUsers = allUsers.filter((user) => user.id !== currentUser.id);
      setUsers(otherUsers);
      setChats(userChats);

      const availabilityEntries = await Promise.all(
        otherUsers.map(async (user) => [
          user.id,
          await canUsersChat(currentUser.id, user.id),
        ])
      );

      setChatAvailability(Object.fromEntries(availabilityEntries));
    };

    loadData();

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [currentUser, navigation]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(normalizedQuery) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(normalizedQuery)
    );
  }, [query, users]);

  const handleFollowRequest = async (userId) => {
    const result = await sendFollowRequest(currentUser.id, userId);
    Alert.alert(
      result.success ? 'Request sent' : 'Unable to send request',
      result.message || 'Follow request has been sent.'
    );
  };

  const openConversation = async (user) => {
    const allowed = await canUsersChat(currentUser.id, user.id);

    if (!allowed) {
      Alert.alert(
        'Follow request required',
        'Send a follow request first. Once it is accepted, you can chat.'
      );
      return;
    }

    const chat = await getOrCreateChat(currentUser.id, user.id);
    navigation.navigate('ChatRoom', { user, chatId: chat.id });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80' }}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <View style={[styles.container, { backgroundColor: colors.background + 'E6' }]}>
        <View
          style={[
            styles.searchBar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search people by name or username"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Discover people
      </Text>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No users found for that search.
          </Text>
        }
        renderItem={({ item }) => {
          const isConnected = chatAvailability[item.id];

          return (
            <View
              style={[
                styles.userCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={[styles.userMeta, { color: colors.textMuted }]}>
                  @{item.username} • {item.country}
                </Text>
              </View>
              <View style={styles.userActions}>
                {isConnected ? (
                  <Pressable
                    style={[styles.primaryAction, { backgroundColor: colors.primary }]}
                    onPress={() => openConversation(item)}
                  >
                    <Text style={styles.primaryActionText}>Message</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[styles.primaryAction, { backgroundColor: colors.primary }]}
                    onPress={() => handleFollowRequest(item.id)}
                  >
                    <Text style={styles.primaryActionText}>Follow Request</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  userCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
  },
  primaryAction: {
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 18,
  },
});
