import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_KEY = 'SKILLVERSE_CHATS';

export async function getChats() {
  try {
    const chatsJson = await AsyncStorage.getItem(CHATS_KEY);
    return chatsJson ? JSON.parse(chatsJson) : [];
  } catch (error) {
    console.error('Failed to load chats:', error);
    return [];
  }
}

export async function saveChats(chats) {
  try {
    await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Failed to save chats:', error);
  }
}

export async function getOrCreateChat(userA, userB) {
  const chats = await getChats();
  const existing = chats.find(
    (chat) =>
      chat.participantIds.includes(userA) && chat.participantIds.includes(userB)
  );

  if (existing) {
    return existing;
  }

  const newChat = {
    id: Date.now().toString(),
    participantIds: [userA, userB],
    messages: [],
  };

  await saveChats([...chats, newChat]);
  return newChat;
}

export async function getChatsForUser(userId) {
  const chats = await getChats();
  return chats.filter((chat) => chat.participantIds.includes(userId));
}

export async function sendChatMessage(chatId, message) {
  const chats = await getChats();
  const updatedChats = chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          messages: [...chat.messages, message],
        }
      : chat
  );
  await saveChats(updatedChats);
}
