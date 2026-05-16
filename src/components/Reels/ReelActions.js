import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';

export default function ReelActions({
  colors,
  isLiked,
  likes,
  comments,
  shares,
  onLike,
  onComment,
  onShare,
}) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.action} onPress={onLike}>
        <Heart
          size={28}
          color={isLiked ? colors.danger : '#ffffff'}
          fill={isLiked ? colors.danger : 'transparent'}
        />
        <Text style={styles.label}>{likes}</Text>
      </Pressable>
      <Pressable style={styles.action} onPress={onComment}>
        <MessageCircle size={28} color="#ffffff" />
        <Text style={styles.label}>{comments}</Text>
      </Pressable>
      <Pressable style={styles.action} onPress={onShare}>
        <Share2 size={28} color="#ffffff" />
        <Text style={styles.label}>{shares}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    alignItems: 'center',
  },
  action: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
