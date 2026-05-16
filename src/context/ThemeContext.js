import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createStyles } from '../utils/styles';

const THEME_KEY = 'APP_THEME_MODE';

const lightColors = {
  background: '#f4f7fb',
  card: '#ffffff',
  cardSecondary: '#eef4ff',
  text: '#101828',
  textMuted: '#475467',
  border: '#d0d9e7',
  primary: '#2563eb',
  primarySoft: '#dbeafe',
  secondary: '#6b7280',
  secondarySoft: '#f3f4f6',
  success: '#10b981',
  successSoft: '#d1fae5',
  warning: '#f59e0b',
  warningSoft: '#fef3c7',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  info: '#06b6d4',
  infoSoft: '#cffafe',
  shadow: '#0f172a',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

const darkColors = {
  background: '#0f172a',
  card: '#111c34',
  cardSecondary: '#182746',
  text: '#f8fafc',
  textMuted: '#cbd5e1',
  border: '#314158',
  primary: '#60a5fa',
  primarySoft: '#1d3557',
  secondary: '#9ca3af',
  secondarySoft: '#374151',
  success: '#34d399',
  successSoft: '#065f46',
  warning: '#fbbf24',
  warningSoft: '#92400e',
  danger: '#f87171',
  dangerSoft: '#991b1b',
  info: '#22d3ee',
  infoSoft: '#164e63',
  shadow: '#000000',
  overlay: 'rgba(2, 6, 23, 0.72)',
};

function createNavigationTheme(mode, colors) {
  const baseTheme =
    mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      card: colors.card,
      border: colors.border,
      primary: colors.primary,
      text: colors.text,
      notification: colors.primary,
    },
  };
}

export const ThemeContext = createContext({
  mode: 'light',
  colors: lightColors,
  styles: createStyles(lightColors),
  toggleTheme: () => {},
  navigationTheme: createNavigationTheme('light', lightColors),
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_KEY);
        if (savedMode === 'light' || savedMode === 'dark') {
          setMode(savedMode);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);

    try {
      await AsyncStorage.setItem(THEME_KEY, nextMode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const colors = mode === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      mode,
      colors,
      styles: createStyles(colors),
      toggleTheme,
      navigationTheme: createNavigationTheme(mode, colors),
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
