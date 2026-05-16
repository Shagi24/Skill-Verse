import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MessageBubble({
  message = 'Message',
  isOwnMessage = false,
  colors,
}) {
  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.alignRight : styles.alignLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage
            ? [styles.ownBubble, { backgroundColor: colors.primary }]
            : [styles.otherBubble, { backgroundColor: colors.cardSecondary }],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isOwnMessage ? '#ffffff' : colors.text },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownBubble: {
  },
  otherBubble: {
  },
  messageText: {
    fontSize: 14,
    lineHeight: 19,
  },
});
