import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function SessionDetailsScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { session } = route.params;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{session.title || session.topic}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {session.date} {'\u2022'} {session.time}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {session.description}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statChip, { backgroundColor: colors.cardSecondary }]}>
              <Text style={[styles.statText, { color: colors.text }]}>
                {session.materials?.length || 0} materials
              </Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: colors.cardSecondary }]}>
              <Text style={[styles.statText, { color: colors.text }]}>
                {session.assignments?.length || 0} assignments
              </Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: colors.cardSecondary }]}>
              <Text style={[styles.statText, { color: colors.text }]}>
                {session.recordSession ? 'Recording on' : 'Recording off'}
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Materials', { sessionId: session.id })}
          >
            <Text style={styles.primaryButtonText}>Open Materials</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 18,
  },
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    gap: 10,
    marginBottom: 18,
  },
  statChip: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statText: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
