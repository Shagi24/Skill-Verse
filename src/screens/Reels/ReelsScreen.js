import React, { useContext, useState } from 'react';
import { Alert, FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import ReelCard from '../../components/Reels/ReelCard';
import { ThemeContext } from '../../context/ThemeContext';
import { getDummyReels } from '../../services/reelService';

export default function ReelsScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { height } = useWindowDimensions();
  const [reels, setReels] = useState(getDummyReels());
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleLike = (reelId) => {
    setReels((current) =>
      current.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const toggleFollow = (reelId) => {
    setReels((current) =>
      current.map((reel) =>
        reel.id === reelId
          ? { ...reel, isFollowing: !reel.isFollowing }
          : reel
      )
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: '#020617' }]}>
      <FlatList
        data={reels}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.y / height);
          setActiveIndex(nextIndex);
        }}
        renderItem={({ item, index }) => (
          <View style={{ height }}>
            <ReelCard
              item={item}
              isActive={activeIndex === index}
              colors={colors}
              onOpen={() => navigation.navigate('ReelPlayer', { reel: item })}
              onLike={() => toggleLike(item.id)}
              onComment={() => Alert.alert('Comments', 'Comment UI can be connected to post comments later.')}
              onShare={() => Alert.alert('Share', 'Share flow can reuse the post/session/chat pipeline.')}
              onToggleFollow={() => toggleFollow(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
