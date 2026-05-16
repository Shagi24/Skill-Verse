import 'react-native-gesture-handler';
import React, { useContext, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeContext, ThemeProvider } from './src/context/ThemeContext';
import { requestNotificationPermission } from './src/services/notificationService';

function AppContent() {
  const { navigationTheme, colors, mode } = useContext(ThemeContext);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const paperTheme = useMemo(
    () => ({
      dark: mode === 'dark',
      colors: {
        primary: colors.primary,
        background: colors.background,
        surface: colors.card,
        onSurface: colors.text,
        secondaryContainer: colors.cardSecondary,
      },
    }),
    [colors, mode]
  );

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
