import React, { createContext, useEffect, useState } from 'react';
import {
  clearCurrentUser,
  getCurrentUser,
  getUsers,
  resetAuthData as resetAuthDataService,
  saveCurrentUser,
  saveUsers,
} from '../services/authService';

export const AuthContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  resetAuthData: async () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const savedUser = await getCurrentUser();
      if (savedUser) {
        setCurrentUser(savedUser);
        setIsLoggedIn(true);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async ({ identifier, password }) => {
    const users = await getUsers();
    const matchedUser = users.find(
      (user) =>
        (user.email.toLowerCase() === identifier.toLowerCase() ||
          user.username.toLowerCase() === identifier.toLowerCase()) &&
        user.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'Invalid email/username or password.',
      };
    }

    setCurrentUser(matchedUser);
    setIsLoggedIn(true);
    await saveCurrentUser(matchedUser);

    return { success: true };
  };

  const register = async (userData) => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(userData.username)) {
      return { success: false, message: 'Username can only contain letters, numbers, and underscores.' };
    }

    if (userData.username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }

    const users = await getUsers();
    const usernameTaken = users.some(
      (user) => user.username.toLowerCase() === userData.username.toLowerCase()
    );
    const emailTaken = users.some(
      (user) => user.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (usernameTaken) {
      return { success: false, message: 'That username is already in use.' };
    }

    if (emailTaken) {
      return { success: false, message: 'That email is already in use.' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
    };

    await saveUsers([...users, newUser]);
    // Note: Not logging in automatically after registration
    // User needs to sign in manually

    return { success: true, user: newUser };
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    await clearCurrentUser();
  };

  const resetAuthData = async () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    await resetAuthDataService();
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, currentUser, login, register, logout, resetAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
