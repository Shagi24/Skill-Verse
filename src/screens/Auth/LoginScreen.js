import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthBackdrop, { authColors } from '../../components/AuthBackdrop';

const floatingSkills = [
  { id: '1', title: 'Math Basics', subtitle: 'Live tutoring' },
  { id: '2', title: 'UI Design', subtitle: 'Creative workshops' },
  { id: '3', title: 'Coding', subtitle: 'Project-based learning' },
];

export default function LoginScreen({ navigation }) {
  const floatOne = useRef(new Animated.Value(0)).current;
  const floatTwo = useRef(new Animated.Value(0)).current;
  const floatThree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeLoop = (animatedValue, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      );

    const animations = [
      makeLoop(floatOne, 3200),
      makeLoop(floatTwo, 3800),
      makeLoop(floatThree, 4200),
    ];

    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [floatOne, floatTwo, floatThree]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: authColors.background }]}>
      <View style={styles.screen}>
        <AuthBackdrop variant="login" />
        <View style={styles.heroArea}>
          <View
            style={[
              styles.heroPanel,
              {
                backgroundColor: authColors.card,
                shadowColor: '#000000',
                borderColor: authColors.border,
              },
            ]}
          >
            <Text style={[styles.eyebrow, { color: authColors.primary }]}>
              LEARN. TEACH. GROW.
            </Text>
            <Text style={[styles.title, { color: authColors.text }]}>
              Discover people who can teach what you want to learn.
            </Text>
            <Text style={[styles.subtitle, { color: authColors.textMuted }]}>
              SkillVerse helps learners and teachers connect through sessions,
              materials, and chat in one place.
            </Text>
            <View style={styles.ctaGroup}>
              <Pressable
                style={[styles.primaryButton, { backgroundColor: authColors.primary }]}
                onPress={() => navigation.navigate('SignIn')}
              >
                <Text style={styles.primaryButtonText}>Enter SkillVerse</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: authColors.cardAlt,
                    borderColor: authColors.border,
                  },
                ]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.secondaryButtonText, { color: authColors.text }]}>
                  Create Account
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.floatingArea}>
            <Animated.View
              style={[
                styles.floatingCard,
                styles.floatCardOne,
                {
                  backgroundColor: authColors.card,
                  shadowColor: '#000000',
                  borderColor: authColors.border,
                  transform: [
                    { rotate: '-8deg' },
                    {
                      translateY: floatOne.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -14],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: authColors.text }]}>
                {floatingSkills[0].title}
              </Text>
              <Text style={[styles.cardSubtitle, { color: authColors.textMuted }]}>
                {floatingSkills[0].subtitle}
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.floatingCard,
                styles.floatCardTwo,
                {
                  backgroundColor: authColors.cardAlt,
                  shadowColor: '#000000',
                  borderColor: authColors.border,
                  transform: [
                    { rotate: '7deg' },
                    {
                      translateY: floatTwo.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 12],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: authColors.text }]}>
                {floatingSkills[1].title}
              </Text>
              <Text style={[styles.cardSubtitle, { color: authColors.textMuted }]}>
                {floatingSkills[1].subtitle}
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.floatingCard,
                styles.floatCardThree,
                {
                  backgroundColor: authColors.card,
                  shadowColor: '#000000',
                  borderColor: authColors.border,
                  transform: [
                    {
                      translateY: floatThree.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: authColors.text }]}>
                {floatingSkills[2].title}
              </Text>
              <Text style={[styles.cardSubtitle, { color: authColors.textMuted }]}>
                {floatingSkills[2].subtitle}
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  heroArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroPanel: {
    borderWidth: 1,
    borderRadius: 30,
    padding: 24,
    marginTop: 18,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
  },
  ctaGroup: { gap: 12, marginTop: 6 },
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
  floatingArea: {
    minHeight: 250,
    justifyContent: 'flex-end',
    paddingBottom: 10,
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
  floatCardOne: { width: 180, left: 8, bottom: 110 },
  floatCardTwo: { width: 170, right: 10, bottom: 150 },
  floatCardThree: { width: 190, alignSelf: 'center', bottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, fontWeight: '600' },
});
