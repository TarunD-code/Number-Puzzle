import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = { text: string; visible: boolean };

export default function Banner({ text, visible }: Props) {
  const y = useSharedValue(-60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      y.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
      setTimeout(() => {
        y.value = withTiming(-60, { duration: 250 });
        opacity.value = withTiming(0, { duration: 250 });
      }, 1100);
    }
  }, [visible]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(106,77,255,0.95)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#6b4dff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  text: {
    color: 'white',
    fontWeight: '900',
    letterSpacing: 0.5,
    fontSize: 36,
  },
});


