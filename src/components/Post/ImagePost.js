import React from 'react';
import { FlatList, Image, StyleSheet, View, useWindowDimensions } from 'react-native';

export default function ImagePost({ uri, uris = [] }) {
  const { width } = useWindowDimensions();
  const sources = uris.length ? uris : uri ? [uri] : [];

  if (!sources.length) {
    return null;
  }

  if (sources.length === 1) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: sources[0] }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <FlatList
      data={sources}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item}-${index}`}
      style={styles.container}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={[styles.image, { width: width - 32 - 32 }]}
          resizeMode="cover"
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#cbd5e1',
  },
});
