import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MessageBubble from '../../components/MessageBubble';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { addNotification } from '../../services/notificationService';
import { getChats, getOrCreateChat, sendChatMessage } from '../../services/chatService';

export default function ChatScreen({ route }) {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const { user, chatId: initialChatId } = route.params;
  const [chatId, setChatId] = useState(initialChatId || '');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const loadChat = async () => {
      const chat = initialChatId
        ? (await getChats()).find((item) => item.id === initialChatId)
        : await getOrCreateChat(currentUser.id, user.id);

      if (chat) {
        setChatId(chat.id);
        setMessages(chat.messages);
      }
    };

    loadChat();
  }, [currentUser, initialChatId, user.id]);

  const sendMessage = async () => {
    if (!draft.trim() || !chatId) {
      return;
    }

    const outgoingMessage = {
      id: `${Date.now()}`,
      senderId: currentUser.id,
      text: draft.trim(),
      createdAt: new Date().toISOString(),
    };

    await sendChatMessage(chatId, outgoingMessage);
    setMessages((current) => [...current, outgoingMessage]);
    setDraft('');
    await addNotification({
      type: 'message',
      title: 'Message sent',
      body: `You sent a message to ${user.firstName} ${user.lastName}.`,
      data: { chatId },
    });

    const autoReply = {
      id: `${Date.now()}-reply`,
      senderId: user.id,
      text: `Thanks ${currentUser.firstName || ''}, I saw your message about "${outgoingMessage.text}".`,
      createdAt: new Date().toISOString(),
    };

    setTimeout(async () => {
      await sendChatMessage(chatId, autoReply);
      setMessages((current) => [...current, autoReply]);
      await addNotification({
        type: 'message',
        title: 'New message received',
        body: `${user.firstName} replied to your conversation.`,
        data: { chatId },
      });
    }, 650);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          @{user.username}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MessageBubble
            message={item.text}
            isOwnMessage={item.senderId === currentUser.id}
            colors={colors}
          />
        )}
      />

      <View
        style={[
          styles.inputBar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Type a message"
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
        />
        <Pressable
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={sendMessage}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputBar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sendButton: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
