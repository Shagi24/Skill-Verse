import React from 'react';
import { MessageCircle, Repeat2, Share2 } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SkillCard({
  title = 'Skill Title',
  description = 'Skill description',
  authorName = 'SkillVerse User',
  likesCount = 0,
  commentsCount = 0,
  sharesCount = 0,
  onPress,
  colors,
  styles: themeStyles,
}) {
  return (
    <TouchableOpacity
      style={[
        themeStyles.card,
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View>
        <Text style={[themeStyles.caption, styles.author]}>
          @{authorName}
        </Text>
        <Text style={[themeStyles.heading3, styles.title]}>{title}</Text>
        <Text style={[themeStyles.body, styles.description]}>
          {description}
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Repeat2 color={colors.primary} size={16} />
          <Text style={[themeStyles.caption, styles.metricText]}>
            {likesCount}
          </Text>
        </View>
        <View style={styles.metric}>
          <MessageCircle color={colors.primary} size={16} />
          <Text style={[themeStyles.caption, styles.metricText]}>
            {commentsCount}
          </Text>
        </View>
        <View style={styles.metric}>
          <Share2 color={colors.primary} size={16} />
          <Text style={[themeStyles.caption, styles.metricText]}>
            {sharesCount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  author: {
    marginBottom: 6,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 18,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontWeight: '700',
  },
});
