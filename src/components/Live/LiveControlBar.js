import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react-native';

export default function LiveControlBar({
  colors,
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  onLeave,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.control, { backgroundColor: colors.card }]}
        onPress={onToggleMic}
      >
        {micEnabled ? <Mic size={20} color={colors.text} /> : <MicOff size={20} color={colors.danger} />}
        <Text style={[styles.label, { color: colors.text }]}>
          {micEnabled ? 'Mic On' : 'Mic Off'}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.control, { backgroundColor: colors.card }]}
        onPress={onToggleCamera}
      >
        {cameraEnabled ? (
          <Video size={20} color={colors.text} />
        ) : (
          <VideoOff size={20} color={colors.danger} />
        )}
        <Text style={[styles.label, { color: colors.text }]}>
          {cameraEnabled ? 'Camera On' : 'Camera Off'}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.leaveControl, { backgroundColor: colors.danger }]}
        onPress={onLeave}
      >
        <PhoneOff size={20} color="#ffffff" />
        <Text style={styles.leaveLabel}>Leave</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  control: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  leaveControl: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  leaveLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
