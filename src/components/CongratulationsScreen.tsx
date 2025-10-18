import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring, 
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const HEADLINES = [
  'Congratulations!',
  'Awesome!',
  'Well done!',
  'Fantastic!',
  'Brilliant!',
  'Superb!',
  'You did it!',
];

// Star with water fill animation component
function StarWithFill({ index, fillProgress }: { index: number; fillProgress: any }) {
  const animatedStyle = useAnimatedStyle(() => {
    const shouldFill = fillProgress.value > index / 5;
    const fillAmount = Math.max(0, Math.min(1, (fillProgress.value - index / 5) * 5));
    
    return {
      opacity: shouldFill ? 1 : 0.4,
      transform: [
        { scale: shouldFill ? 1.2 : 0.8 },
        { rotate: shouldFill ? `${fillAmount * 180}deg` : '0deg' }
      ],
    };
  });

  return (
    <Animated.View style={[styles.ratingStarContainer, animatedStyle]}>
      <Text style={styles.ratingStar}>⭐</Text>
    </Animated.View>
  );
}

type CongratulationsScreenProps = {
  score?: number;
  onNextLevel?: () => void;
  onRestart?: () => void;
};

export default function CongratulationsScreen({ score = 0, onNextLevel, onRestart }: CongratulationsScreenProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const starScale = useSharedValue(0);
  const starRotation = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const [headline, setHeadline] = React.useState<string>('Congratulations!');
  const quoteOpacity = useSharedValue(0);
  const headlineOffsetY = useSharedValue(0);
  const levelClearedOpacity = useSharedValue(0);
  const starFillProgress = useSharedValue(0);
  
  // Remove duplicate star effects - let EffectsOverlay handle all stars

  useEffect(() => {
    // Randomize headline each time this screen mounts
    setHeadline(HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);

    // Main animation sequence
    scale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
      withSpring(1, { damping: 8, stiffness: 100 })
    );
    
    opacity.value = withTiming(1, { duration: 500 });
    
    // Star animation
    starScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.3, { duration: 600, easing: Easing.out(Easing.back(1.2)) }),
      withSpring(1, { damping: 6, stiffness: 80 })
    );
    
    starRotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    
    // Sparkles animation
    sparkleOpacity.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 800 }),
      withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      )
    );

    // After ~2s, move the headline from center to near the top and show level cleared
    setTimeout(() => {
      headlineOffsetY.value = withTiming(-height * 0.08, { duration: 500 }); // Reduced movement to keep text visible
      quoteOpacity.value = withTiming(1, { duration: 500 });
      levelClearedOpacity.value = withTiming(1, { duration: 500 });
    }, 2000);

    // Start star filling animation after level cleared appears
    setTimeout(() => {
      starFillProgress.value = withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) });
    }, 2200);
  }, []);

  // Shooting stars and twinkling stars are handled by EffectsOverlay for consistency

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const congratulationsStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: headlineOffsetY.value },
    ],
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: starScale.value },
      { rotate: `${starRotation.value}deg` }
    ],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const quoteStyle = useAnimatedStyle(() => ({ opacity: quoteOpacity.value }));
  const levelClearedStyle = useAnimatedStyle(() => ({ opacity: levelClearedOpacity.value }));

  // Star effects are handled by EffectsOverlay for consistency

  // Position the sun/star lower to avoid blocking buttons
  const starCenterX = width / 2;
  const starCenterY = height / 2 + 150; // push much lower to avoid button overlap

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background stars */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 50 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.backgroundStar,
              {
                left: Math.random() * width,
                top: Math.random() * height,
              },
            ]}
          />
        ))}
      </View>

      {/* Main content */}
      <Animated.View style={[styles.content, congratulationsStyle]}>
        <Text style={styles.congratulationsText}>{headline}</Text>
        <Animated.Text style={[styles.subText, quoteStyle]}>You have completed the</Animated.Text>
        <Animated.Text style={[styles.subText, quoteStyle]}>Daily challenge!</Animated.Text>
        
        {/* Level Cleared Message */}
        <Animated.View style={[styles.levelClearedContainer, levelClearedStyle]}>
          <Text style={styles.levelClearedText}>Level Cleared!</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </Animated.View>
        
        {/* Star Rating with Water Fill Animation */}
        <Animated.View style={[styles.starRatingContainer, levelClearedStyle]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarWithFill key={i} index={i} fillProgress={starFillProgress} />
          ))}
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionButtons, levelClearedStyle]}>
          {onNextLevel && (
            <Pressable style={[styles.button, styles.nextButton]} onPress={onNextLevel}>
              <Text style={styles.buttonText}>Next Level</Text>
            </Pressable>
          )}
          {onRestart && (
            <Pressable style={[styles.button, styles.restartButton]} onPress={onRestart}>
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>

      {/* Central glowing star */}
      <Animated.View style={[
        styles.starContainer,
        {
          left: starCenterX - 60,
          top: starCenterY - 60,
          zIndex: 1, // under the text content
        },
        starStyle,
      ]}>
        <View style={styles.glowStar} />
        <View style={styles.innerStar} />
        <View style={styles.tickWrapper}>
          <Text style={styles.tickText}>✓</Text>
        </View>
      </Animated.View>

      {/* Sparkles around the star */}
      <Animated.View style={[styles.sparklesContainer, sparkleStyle, { left: starCenterX - 200, top: starCenterY - 200, zIndex: 1 }]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.sparkle,
              {
                left: 200 + Math.cos((i * 30) * Math.PI / 180) * 80,
                top: 200 + Math.sin((i * 30) * Math.PI / 180) * 80,
              },
            ]}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundStar: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
    position: 'absolute',
    top: height * 0.15, // Better positioning for the content
  },
  congratulationsText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#ffd700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subText: {
    fontSize: 24,
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    textShadowColor: '#ffd700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  starContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowStar: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: '#ff6b35',
    borderRadius: 50,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  innerStar: {
    width: 60,
    height: 60,
    backgroundColor: '#ffd700',
    borderRadius: 30,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  tickWrapper: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: {
    fontSize: 38,
    color: '#1b1438',
    fontWeight: '900',
  },
  sparklesContainer: {
    position: 'absolute',
    width: 400,
    height: 400,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 24,
    marginHorizontal: 2,
    textShadowColor: '#ffd700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  ratingStarContainer: {
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingStar: {
    fontSize: 28,
    textShadowColor: '#ffd700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  levelClearedContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  levelClearedText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffd700',
    textAlign: 'center',
    textShadowColor: '#ffd700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButton: {
    backgroundColor: '#00ff88',
  },
  restartButton: {
    backgroundColor: '#ff6b35',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
