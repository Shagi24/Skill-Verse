import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_USERS_KEY = 'APP_USERS';
const LOGGED_IN_USER_KEY = 'LOGGED_IN_USER';

export async function registerUser(user) {
  try {
    const existingUsers = await getUsers();

    // Check if email already exists
    const emailExists = existingUsers.some(existingUser => existingUser.email === user.email);
    if (emailExists) {
      return { success: false, message: "User already exists" };
    }

    // Add new user to users list
    const updatedUsers = [...existingUsers, user];

    // Save updated users list
    await AsyncStorage.setItem(APP_USERS_KEY, JSON.stringify(updatedUsers));

    return { success: true };
  } catch (error) {
    console.error('Failed to register user:', error);
    return { success: false, message: "Registration failed" };
  }
}

export async function loginUser(email, password) {
  try {
    const users = await getUsers();

    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error('Failed to login user:', error);
    return { success: false, message: "Login failed" };
  }
}

export async function getUsers() {
  try {
    const usersJson = await AsyncStorage.getItem(APP_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to load users:', error);
    return [];
  }
}

export async function saveLoggedInUser(user) {
  try {
    await AsyncStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save logged in user:', error);
  }
}

export async function getLoggedInUser() {
  try {
    const userJson = await AsyncStorage.getItem(LOGGED_IN_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to load logged in user:', error);
    return null;
  }
}

export async function logoutUser() {
  try {
    await AsyncStorage.removeItem(LOGGED_IN_USER_KEY);
  } catch (error) {
    console.error('Failed to logout user:', error);
  }
}

// Aliases for AuthContext compatibility
export async function saveCurrentUser(user) {
  return saveLoggedInUser(user);
}

export async function getCurrentUser() {
  return getLoggedInUser();
}

export async function clearCurrentUser() {
  return logoutUser();
}

export async function saveUsers(users) {
  try {
    await AsyncStorage.setItem(APP_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
}

export async function resetAuthData() {
  try {
    await AsyncStorage.multiRemove([APP_USERS_KEY, LOGGED_IN_USER_KEY]);
  } catch (error) {
    console.error('Failed to reset auth data:', error);
  }
}
