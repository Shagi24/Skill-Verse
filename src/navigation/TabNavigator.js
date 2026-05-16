import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CalendarDays,
  Clapperboard,
  House,
  MessageCircleMore,
  UserRound,
} from 'lucide-react-native';
import NotificationBell from '../components/Notifications/NotificationBell';
import HomeScreen from '../screens/Home/HomeScreen';
import CreatePostScreen from '../screens/Home/CreatePostScreen';
import PostDetailsScreen from '../screens/Home/PostDetailsScreen';
import SessionScreen from '../screens/Sessions/SessionScreen';
import CreateSessionScreen from '../screens/Sessions/CreateSessionScreen';
import SessionDetailsScreen from '../screens/Sessions/SessionDetailsScreen';
import MaterialsScreen from '../screens/Materials/MaterialsScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import CreateLiveSessionScreen from '../screens/LiveSessions/CreateLiveSessionScreen';
import JoinLiveSessionScreen from '../screens/LiveSessions/JoinLiveSessionScreen';
import LiveSessionScreen from '../screens/LiveSessions/LiveSessionScreen';
import RecordingsScreen from '../screens/Recordings/RecordingsScreen';
import ReelsScreen from '../screens/Reels/ReelsScreen';
import ReelPlayerScreen from '../screens/Reels/ReelPlayerScreen';
import CameraScreen from '../screens/Camera/CameraScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ReelsStack = createNativeStackNavigator();
const SessionsStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function buildStackOptions(colors, navigation) {
  return {
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: '800',
    },
    headerRight: () => (
      <NotificationBell colors={colors} navigation={navigation} />
    ),
  };
}

function HomeStackNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <HomeStack.Navigator screenOptions={({ navigation }) => buildStackOptions(colors, navigation)}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
      <HomeStack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post Details' }} />
      <HomeStack.Screen name="Materials" component={MaterialsScreen} options={{ title: 'Materials' }} />
      <HomeStack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera', headerShown: false }} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Activity' }} />
    </HomeStack.Navigator>
  );
}

function ReelsStackNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <ReelsStack.Navigator screenOptions={({ navigation }) => buildStackOptions(colors, navigation)}>
      <ReelsStack.Screen name="ReelsFeed" component={ReelsScreen} options={{ title: 'Reels', headerShown: false }} />
      <ReelsStack.Screen name="ReelPlayer" component={ReelPlayerScreen} options={{ title: 'Reel Player' }} />
      <ReelsStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Activity' }} />
    </ReelsStack.Navigator>
  );
}

function SessionsStackNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <SessionsStack.Navigator screenOptions={({ navigation }) => buildStackOptions(colors, navigation)}>
      <SessionsStack.Screen name="SessionsHome" component={SessionScreen} options={{ title: 'Sessions' }} />
      <SessionsStack.Screen name="CreateSession" component={CreateSessionScreen} options={{ title: 'Create Session' }} />
      <SessionsStack.Screen name="SessionDetails" component={SessionDetailsScreen} options={{ title: 'Session Details' }} />
      <SessionsStack.Screen name="CreateLiveSession" component={CreateLiveSessionScreen} options={{ title: 'Go Live' }} />
      <SessionsStack.Screen name="JoinLiveSession" component={JoinLiveSessionScreen} options={{ title: 'Join Live' }} />
      <SessionsStack.Screen name="LiveSession" component={LiveSessionScreen} options={{ title: 'Live Session', headerShown: false }} />
      <SessionsStack.Screen name="Recordings" component={RecordingsScreen} options={{ title: 'Recordings' }} />
      <SessionsStack.Screen name="Materials" component={MaterialsScreen} options={{ title: 'Materials' }} />
      <SessionsStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Activity' }} />
    </SessionsStack.Navigator>
  );
}

function ChatStackNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <ChatStack.Navigator screenOptions={({ navigation }) => buildStackOptions(colors, navigation)}>
      <ChatStack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
      <ChatStack.Screen name="ChatRoom" component={ChatScreen} options={{ title: 'Conversation' }} />
      <ChatStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Activity' }} />
    </ChatStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <ProfileStack.Navigator screenOptions={({ navigation }) => buildStackOptions(colors, navigation)}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile', headerShown: false }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="Recordings" component={RecordingsScreen} options={{ title: 'Recordings' }} />
      <ProfileStack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post Details' }} />
      <ProfileStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Edit Post' }} />
      <ProfileStack.Screen name="Materials" component={MaterialsScreen} options={{ title: 'Materials' }} />
      <ProfileStack.Screen name="ReelPlayer" component={ReelPlayerScreen} options={{ title: 'Reel Player' }} />
      <ProfileStack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera', headerShown: false }} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Activity' }} />
    </ProfileStack.Navigator>
  );
}

export default function TabNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 11,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <House color={color} size={size} />;
          }

          if (route.name === 'Reels') {
            return <Clapperboard color={color} size={size} />;
          }

          if (route.name === 'Sessions') {
            return <CalendarDays color={color} size={size} />;
          }

          if (route.name === 'Chat') {
            return <MessageCircleMore color={color} size={size} />;
          }

          return <UserRound color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Reels" component={ReelsStackNavigator} />
      <Tab.Screen name="Sessions" component={SessionsStackNavigator} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
