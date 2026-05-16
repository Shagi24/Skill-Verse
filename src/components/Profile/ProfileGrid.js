import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image as ImageIcon, PlayCircle, SquarePlay } from 'lucide-react-native';

function getItemIcon(type, color) {
  if (type === 'reels') {
    return <PlayCircle size={18} color={color} />;
  }

  if (type === 'sessions') {
    return <SquarePlay size={18} color={color} />;
  }

  return <ImageIcon size={18} color={color} />;
}

export default function ProfileGrid({ colors, data, type, onPress }) {
  return (
    <FlatList
      data={data}
      numColumns={3}
      scrollEnabled={false}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.tile,
            { backgroundColor: colors.cardSecondary, borderColor: colors.border },
          ]}
          onPress={() => onPress?.(item)}
        >
          <View style={styles.iconWrap}>
            {getItemIcon(type, colors.primary)}
          </View>
          <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <View
          style={[
            styles.emptyState,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Nothing to show here yet.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 14,
  },
  row: {
    gap: 10,
    marginBottom: 10,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
