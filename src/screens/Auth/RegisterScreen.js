import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AuthBackdrop, { authColors } from '../../components/AuthBackdrop';
import { AuthContext } from '../../context/AuthContext';
import { saveProfile } from '../../services/profileService';

const ageOptions = Array.from({ length: 63 }, (_, index) => `${index + 18}`);
const countryOptions = [
  'Sri Lanka',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Japan',
  'Singapore',
  'UAE',
];

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const driftOne = useRef(new Animated.Value(0)).current;
  const driftTwo = useRef(new Animated.Value(0)).current;
  const driftThree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (value, duration, output) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: output,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      );

    const animations = [
      createLoop(driftOne, 3100, -16),
      createLoop(driftTwo, 3600, 14),
      createLoop(driftThree, 4300, -10),
    ];
    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [driftOne, driftTwo, driftThree]);

  const handleRegister = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !selectedAge ||
      !selectedCountry
    ) {
      Alert.alert('Missing details', 'Please fill in all registration fields.');
      return;
    }

    const result = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      age: selectedAge,
      country: selectedCountry,
    });

    if (!result.success) {
      Alert.alert('Unable to create account', result.message);
      return;
    }

    Alert.alert('Account created', 'Your account has been created successfully. Please sign in to continue.');

    await saveProfile({
      name: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      age: selectedAge,
      country: selectedCountry,
      bio: '',
      skills: [],
      avatarUri: '',
      avatarScale: 1,
    });

    navigation.navigate('SignIn');
  };

  const renderAccordion = ({
    label,
    value,
    open,
    onToggle,
    options,
    onSelect,
  }) => (
    <View style={styles.accordionWrap}>
      <Pressable
        style={[
          styles.accordionTrigger,
          {
            backgroundColor: authColors.background,
            borderColor: authColors.border,
          },
        ]}
        onPress={onToggle}
      >
        <Text
          style={[
            styles.accordionValue,
            { color: value ? authColors.text : authColors.textMuted },
          ]}
        >
          {value || label}
        </Text>
        <Text style={[styles.accordionArrow, { color: authColors.textMuted }]}>
          {open ? '\u2212' : '+'}
        </Text>
      </Pressable>
      {open ? (
        <View
          style={[
            styles.accordionPanel,
            { backgroundColor: authColors.cardAlt, borderColor: authColors.border },
          ]}
        >
          <ScrollView nestedScrollEnabled style={styles.accordionScroll}>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.accordionOption}
                onPress={() => onSelect(option)}
              >
                <Text
                  style={[styles.accordionOptionText, { color: authColors.text }]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: authColors.background }]}>
      <View style={styles.screen}>
        <AuthBackdrop variant="register" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: authColors.card,
                borderColor: authColors.border,
                shadowColor: '#000000',
              },
            ]}
          >
            <Text style={[styles.kicker, { color: authColors.primary }]}>
              SHARE YOUR SKILLS WITH THE WORLD
            </Text>
            <Text style={[styles.heading, { color: authColors.text }]}>
              Build a profile that turns what you know into learning for others.
            </Text>
            <Text style={[styles.description, { color: authColors.textMuted }]}>
              Create your account to teach, learn, and connect through sessions,
              materials, and real conversation.
            </Text>

            <TextInput
              style={[styles.input, themedInput()]}
              placeholder="First Name"
              placeholderTextColor={authColors.textMuted}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, themedInput()]}
              placeholder="Last Name"
              placeholderTextColor={authColors.textMuted}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={[styles.input, themedInput()]}
              placeholder="Username"
              placeholderTextColor={authColors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, themedInput()]}
              placeholder="Email Address"
              placeholderTextColor={authColors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, themedInput()]}
              placeholder="Password"
              placeholderTextColor={authColors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {renderAccordion({
              label: 'Select Age',
              value: selectedAge,
              open: showAgePicker,
              onToggle: () => {
                setShowAgePicker((current) => !current);
                setShowCountryPicker(false);
              },
              options: ageOptions,
              onSelect: (option) => {
                setSelectedAge(option);
                setShowAgePicker(false);
              },
            })}

            {renderAccordion({
              label: 'Select Country',
              value: selectedCountry,
              open: showCountryPicker,
              onToggle: () => {
                setShowCountryPicker((current) => !current);
                setShowAgePicker(false);
              },
              options: countryOptions,
              onSelect: (option) => {
                setSelectedCountry(option);
                setShowCountryPicker(false);
              },
            })}

            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.primaryButton, { backgroundColor: authColors.primary }]}
                onPress={handleRegister}
              >
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: authColors.cardAlt,
                    borderColor: authColors.border,
                  },
                ]}
                onPress={() => navigation.navigate('SignIn')}
              >
                <Text style={[styles.secondaryButtonText, { color: authColors.text }]}>
                  I Already Have Access
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.floatingStage}>
            <Animated.View
              style={[
                styles.floatingCard,
                styles.cardOne,
                {
                  backgroundColor: authColors.card,
                  borderColor: authColors.border,
                  shadowColor: '#000000',
                  transform: [{ rotate: '-9deg' }, { translateY: driftOne }],
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: authColors.text }]}>
                Teach Guitar
              </Text>
              <Text style={[styles.cardSubtitle, { color: authColors.textMuted }]}>
                Live creative sessions
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.floatingCard,
                styles.cardTwo,
                {
                  backgroundColor: authColors.cardAlt,
                  borderColor: authColors.border,
                  shadowColor: '#000000',
                  transform: [{ rotate: '8deg' }, { translateY: driftTwo }],
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: authColors.text }]}>
                Physics Lab
              </Text>
              <Text style={[styles.cardSubtitle, { color: authColors.textMuted }]}>
                Skill circles worldwide
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.floatingCard,
                styles.cardThree,
                {
                  backgroundColor: authColors.card,
                  borderColor: authColors.border,
                  shadowColor: '#000000',
                  transform: [{ rotate: '-2deg' }, { translateY: driftThree }],
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: authColors.text }]}>
                Design Coach
              </Text>
              <Text style={[styles.cardSubtitle, { color: authColors.textMuted }]}>
                Share notes and visuals
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
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
  screen: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 30,
    padding: 24,
    marginTop: 18,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  accordionWrap: { marginBottom: 12 },
  accordionTrigger: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  accordionArrow: {
    fontSize: 22,
    fontWeight: '700',
  },
  accordionPanel: {
    borderWidth: 1,
    borderRadius: 18,
    marginTop: 8,
    maxHeight: 160,
    overflow: 'hidden',
  },
  accordionScroll: { maxHeight: 160 },
  accordionOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  accordionOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonGroup: { gap: 12, marginTop: 6 },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  floatingStage: {
    minHeight: 230,
    justifyContent: 'flex-end',
    paddingBottom: 6,
    marginTop: 12,
  },
  floatingCard: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  cardOne: { width: 178, right: 8, bottom: 136 },
  cardTwo: { width: 184, left: 10, bottom: 92 },
  cardThree: { width: 196, alignSelf: 'center', bottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, fontWeight: '600' },
});
