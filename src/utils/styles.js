import { StyleSheet } from 'react-native';

export const createStyles = (colors) =>
  StyleSheet.create({
    // Layout
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },

    // Cards
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      margin: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Buttons
    buttonPrimary: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSecondary: {
      backgroundColor: colors.secondarySoft,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.secondary,
    },
    buttonDanger: {
      backgroundColor: colors.danger,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonTextPrimary: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextSecondary: {
      color: colors.secondary,
      fontSize: 16,
      fontWeight: '600',
    },

    // Text
    heading1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    heading2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    heading3: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    body: {
      fontSize: 16,
      color: colors.text,
    },
    bodyMuted: {
      fontSize: 16,
      color: colors.textMuted,
    },
    caption: {
      fontSize: 14,
      color: colors.textMuted,
    },

    // Inputs
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
    },

    // Spacing
    marginSmall: { margin: 4 },
    marginMedium: { margin: 8 },
    marginLarge: { margin: 16 },
    paddingSmall: { padding: 4 },
    paddingMedium: { padding: 8 },
    paddingLarge: { padding: 16 },
  });