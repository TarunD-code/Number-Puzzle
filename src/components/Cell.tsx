import * as React from 'react';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  value: number | null;
  faded?: boolean;
  selected?: boolean;
  onPress?: () => void;
  hasCoin?: boolean;
};

const getNumberColor = (value: number): string => {
  const colors = [
    '#ff6b6b', // Red
    '#4ecdc4', // Teal
    '#45b7d1', // Blue
    '#96ceb4', // Green
    '#feca57', // Yellow
    '#ff9ff3', // Pink
    '#54a0ff', // Light Blue
    '#ce00f7', // Purple
    '#00d2d3', // Cyan
  ];
  return colors[value - 1] || '#f2e9ff';
};

export default function Cell({ value, faded, selected, onPress, hasCoin }: Props) {
  const [rippleScale, setRippleScale] = React.useState(0);
  const rippleOpacity = useSharedValue(0);
  
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(selected ? 1.15 : 1, { duration: 150 }) }],
    opacity: withTiming(faded ? 0.3 : 1, { duration: 300 }),
  }), [faded, selected]);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(rippleScale, { damping: 15, stiffness: 200 }) }],
    opacity: withTiming(rippleOpacity.value, { duration: 300 }),
  }), [rippleScale]);

  const handlePress = () => {
    // Trigger ripple effect
    setRippleScale(1);
    rippleOpacity.value = 0.6;
    setTimeout(() => {
      rippleOpacity.value = 0;
      setTimeout(() => setRippleScale(0), 300);
    }, 150);
    
    onPress?.();
  };

  return (
    <Animated.View style={[styles.wrapper, animStyle]}>
      <Pressable disabled={value === null} onPress={handlePress} style={({ pressed }) => [
        styles.cell,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
        <View>
          <Text style={[styles.text, { color: value ? getNumberColor(value) : '#f2e9ff' }]}>{value ?? ''}</Text>
        </View>
        {/* Tap Ripple Effect */}
        <Animated.View style={[styles.ripple, rippleStyle]} />
      </Pressable>
      {hasCoin && (
        <View style={styles.coin}>
          <Text style={styles.coinText}>💰</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 6,
    zIndex: 1,
    elevation: 1,
  },
  cell: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#1b1040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#462a88',
    shadowColor: '#462a88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
  },
  faded: {
    opacity: 0.3,
  },
  selected: {
    borderColor: '#ffff00',
    backgroundColor: '#2a1361',
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  ripple: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: 0,
    left: 0,
  },
  coin: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  coinText: {
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // Ensure emoji font rendering on web
    fontFamily: Platform.OS === 'web' ? 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif' : undefined,
  },
});


