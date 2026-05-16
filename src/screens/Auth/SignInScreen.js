import React, { useContext, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AuthBackdrop, { authColors } from '../../components/AuthBackdrop';
import { AuthContext } from '../../context/AuthContext';

export default function SignInScreen() {
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Enter your email or username and password.');
      return;
    }

    const result = await login({
      identifier: identifier.trim(),
      password,
    });

    if (!result.success) {
      Alert.alert('Unable to sign in', result.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: authColors.background }]}>
      <View style={styles.screen}>
        <AuthBackdrop variant="signin" />
        <View
          style={[
            styles.card,
            {
              backgroundColor: authColors.card,
              borderColor: authColors.border,
              shadowColor: '#000000',
            },
          ]}
        >
          <Text style={[styles.title, { color: authColors.text }]}>Sign In</Text>
          <Text style={[styles.subtitle, { color: authColors.textMuted }]}>
            Enter your email or username and password to continue.
          </Text>
          <TextInput
            style={[styles.input, themedInput()]}
            placeholder="Email or Username"
            placeholderTextColor={authColors.textMuted}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            onSubmitEditing={handleLogin}
            returnKeyType="next"
          />
          <TextInput
            style={[styles.input, themedInput()]}
            placeholder="Password"
            placeholderTextColor={authColors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={handleLogin}
            returnKeyType="go"
          />
          <Pressable
            style={[styles.primaryButton, { backgroundColor: authColors.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>Enter SkillVerse</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function themedInput() {
  return {
    backgroundColor: authColors.background,
    borderColor: authColors.border,
    color: authColors.text,
  };
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 24,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
