import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const authColors = {
  background: '#07111f',
  card: 'rgba(12, 27, 48, 0.9)',
  cardAlt: 'rgba(17, 37, 67, 0.9)',
  border: '#29476f',
  primary: '#3b82f6',
  text: '#f8fbff',
  textMuted: '#b5c7df',
  glowA: '#12355b',
  glowB: '#1d4f7a',
  glowC: '#0d223d',
};

const backgrounds = {
  login: ['E = mc2', 'for(i=0;i<n;i++)', 'Python', 'Guitar', 'ESP32'],
  register: ['Arduino', 'sin(x)', 'Java', 'Piano', 'Sensors'],
  signin: ['Binary 1010', 'Sketchbook', 'Robotics', 'if/else', 'Strings'],
};

export default function AuthBackdrop({ variant = 'login' }) {
  const labels = backgrounds[variant] || backgrounds.login;

  return (
    <View style={styles.layer}>
      <View style={[styles.glow, styles.glowOne]} />
      <View style={[styles.glow, styles.glowTwo]} />
      <View style={[styles.glow, styles.glowThree]} />
      <Text style={[styles.floatingText, styles.textOne]}>{labels[0]}</Text>
      <Text style={[styles.floatingText, styles.textTwo]}>{labels[1]}</Text>
      <Text style={[styles.floatingText, styles.textThree]}>{labels[2]}</Text>
      <Text style={[styles.floatingText, styles.textFour]}>{labels[3]}</Text>
      <Text style={[styles.floatingText, styles.textFive]}>{labels[4]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.95,
  },
  glowOne: {
    width: 260,
    height: 260,
    top: -50,
    right: -60,
    backgroundColor: authColors.glowA,
  },
  glowTwo: {
    width: 220,
    height: 220,
    top: 170,
    left: -70,
    backgroundColor: authColors.glowB,
  },
  glowThree: {
    width: 280,
    height: 280,
    bottom: -90,
    right: -20,
    backgroundColor: authColors.glowC,
  },
  floatingText: {
    position: 'absolute',
    color: 'rgba(203, 225, 255, 0.18)',
    fontWeight: '800',
    letterSpacing: 1,
  },
  textOne: {
    top: 84,
    left: 28,
    fontSize: 28,
    transform: [{ rotate: '-10deg' }],
  },
  textTwo: {
    top: 180,
    right: 16,
    fontSize: 20,
    transform: [{ rotate: '8deg' }],
  },
  textThree: {
    top: 330,
    left: 22,
    fontSize: 24,
    transform: [{ rotate: '-6deg' }],
  },
  textFour: {
    bottom: 150,
    right: 28,
    fontSize: 26,
    transform: [{ rotate: '12deg' }],
  },
  textFive: {
    bottom: 60,
    left: 28,
    fontSize: 22,
    transform: [{ rotate: '-8deg' }],
  },
});
