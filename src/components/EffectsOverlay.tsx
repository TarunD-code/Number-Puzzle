import * as React from 'react';
import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, Animated as RNAnimated, Dimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, withSequence, withRepeat, interpolate, Extrapolate } from 'react-native-reanimated';
import Character from './Character';
const CharacterComponent = Character as React.ComponentType<{ mood: 'idle' | 'celebrate' | 'sad' | 'combo' | 'surprised' }>;

type FloatingScoreProps = { x: number; y: number; score: number };

export function FloatingScore({ x, y, score }: FloatingScoreProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 80 });
    translateY.value = withTiming(-24, { duration: 600, easing: Easing.out(Easing.quad) }, () => {
      opacity.value = withTiming(0, { duration: 150 });
    });
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return (
    <Animated.View style={[styles.floating, style, { left: x, top: y }]}> 
      <Text style={styles.floatingText}>+{score}</Text>
    </Animated.View>
  );
}

type FloatingNumberProps = { x: number; y: number; value: number; color: string };

function FloatingNumber({ x, y, value, color }: FloatingNumberProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-60, { duration: 2000, easing: Easing.out(Easing.quad) });
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1800, easing: Easing.out(Easing.quad) })
    );
    scale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(0.8, { duration: 1800, easing: Easing.out(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingNumber, { left: x - 15, top: y - 15 }, animatedStyle]}>
      <Text style={[styles.floatingNumberText, { color }]}>{value}</Text>
    </Animated.View>
  );
}

type CellPopProps = { x: number; y: number };

function CellPopEffect({ x, y }: CellPopProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 200, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 400 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.cellPop, { left: x - 30, top: y - 30 }, animatedStyle]} />
  );
}

type ScoreFloatProps = { x: number; y: number; score: number };

function ScoreFloatEffect({ x, y, score }: ScoreFloatProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-40, { duration: 1500, easing: Easing.out(Easing.quad) });
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1300, easing: Easing.out(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.scoreFloat, { left: x - 20, top: y - 20 }, animatedStyle]}>
      <Text style={styles.scoreFloatText}>+{score}</Text>
    </Animated.View>
  );
}

type RippleCircleProps = { x: number; y: number };

function RippleCircle({ x, y }: RippleCircleProps) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.quad) });
  }, []);
  const style = useAnimatedStyle(() => {
    const scale = 0.3 + progress.value * 1.6;
    const opacity = 0.3 * (1 - progress.value);
    return {
      transform: [{ scale }],
      opacity,
    };
  });
  return (
    <Animated.View style={[styles.matchRipple, style, { left: x - 70, top: y - 70 }]} />
  );
}

type ThunderProps = { x1: number; y1: number; x2: number; y2: number };

function ThunderBolt({ x1, y1, x2, y2 }: ThunderProps) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
  }, []);
  const style = useAnimatedStyle(() => {
    const thickness = 4 + (1 - progress.value) * 6;
    const glow = 8 + (1 - progress.value) * 8;
    const opacity = 0.9 * (1 - progress.value);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx >= absDy) {
      // Horizontal bolt: center vertically on y1
      const xStart = Math.min(x1, x2);
      const width = Math.abs(dx);
      return {
        left: xStart,
        top: y1 - thickness / 2,
        width,
        height: thickness,
        opacity,
        shadowRadius: glow,
      } as any;
    } else {
      // Vertical bolt: center horizontally on x1
      const yStart = Math.min(y1, y2);
      const height = Math.abs(dy);
      return {
        left: x1 - thickness / 2,
        top: yStart,
        width: thickness,
        height,
        opacity,
        shadowRadius: glow,
      } as any;
    }
  });
  return (
    <Animated.View style={[styles.thunderBolt, style]} />
  );
}

type MotivationalPopUpProps = { text: string };

function MotivationalPopUp({ text }: MotivationalPopUpProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 200, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 1200 }),
      withTiming(0, { duration: 300 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.motivationalPopUp, animatedStyle]}>
      <Text style={styles.motivationalText}>{text}</Text>
    </Animated.View>
  );
}

function FloatingScoreEffect({ x, y, score }: FloatingScoreProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-50, { duration: 1500, easing: Easing.out(Easing.quad) });
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1300, easing: Easing.out(Easing.quad) })
    );
    scale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(0.8, { duration: 1300, easing: Easing.out(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingScore, { left: x - 20, top: y - 20 }, animatedStyle]}>
      <Text style={styles.floatingScoreText}>+{score}</Text>
    </Animated.View>
  );
}

type CellGlowProps = { x: number; y: number };

function CellGlowEffect({ x, y }: CellGlowProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(0, { duration: 700, easing: Easing.in(Easing.quad) })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 700 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.cellGlow, { left: x - 30, top: y - 30 }, animatedStyle]} />
  );
}

type FlyingCoinEffectProps = { coin: FlyingCoin };

function FlyingCoinEffect({ coin }: FlyingCoinEffectProps) {
  const { x, y, targetX, targetY, progress } = coin;
  
  // Calculate current position with arc motion
  const currentX = x + (targetX - x) * progress;
  const currentY = y + (targetY - y) * progress;
  
  // Add arc motion (parabolic curve)
  const arcHeight = 50 * Math.sin(progress * Math.PI);
  const finalY = currentY - arcHeight;
  
  const scale = 1 - progress * 0.3; // Shrink as it flies
  const rotation = progress * 720; // Spin 2 full rotations
  
  return (
    <Animated.View style={[
      styles.flyingCoin,
      {
        left: currentX - 15,
        top: finalY - 15,
        transform: [
          { scale },
          { rotate: `${rotation}deg` }
        ]
      }
    ]}>
      <Text style={styles.coinText}>💰</Text>
    </Animated.View>
  );
}

type ComboMeterProps = { level: number };

function ComboMeter({ level }: ComboMeterProps) {
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.8);
  
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 300 })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.6, { duration: 400 })
      ),
      -1,
      true
    );
  }, [level]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: glowOpacity.value,
  }));
  
  const getComboColor = (level: number) => {
    if (level >= 5) return '#ff0000'; // Red
    if (level >= 3) return '#ff8800'; // Orange
    if (level >= 2) return '#ffff00'; // Yellow
    return '#00ff00'; // Green
  };
  
  return (
    <Animated.View style={[styles.comboMeter, animatedStyle]}>
      <View style={[styles.comboContainer, { backgroundColor: getComboColor(level) }]}>
        <Text style={styles.comboText}>🔥 {level}x</Text>
      </View>
    </Animated.View>
  );
}

export type EffectsOverlayRef = {
  confetti: () => void;
  invalidShake: () => void;
  gridDrawIn: () => void;
  gridDissolve: () => void;
  scoreTally: (finalScore: number) => void;
  motivationalPopUp: (text: string) => void;
  floatingScore: (x: number, y: number, score: number) => void;
  cellGlow: (x: number, y: number) => void;
  screenFlash: () => void;
  coinFly: (x: number, y: number, targetX: number, targetY: number) => void;
  updateCombo: (combo: number) => void;
  resetAllEffects: () => void;
  characterCelebrate: () => void;
  characterSad: () => void;
  characterCombo: () => void;
  characterSurprised: () => void;
  setCharacterAnchor: (left: number, top: number) => void;
  rippleAt: (x: number, y: number) => void;
  thunderBetween: (x1: number, y1: number, x2: number, y2: number) => void;
};

type FloatingScore = { id: number; x: number; y: number; score: number };
type CellGlow = { id: number; x: number; y: number };
type FlyingCoin = { id: number; x: number; y: number; targetX: number; targetY: number; progress: number };
type Ripple = { id: number; x: number; y: number };
type Thunder = { id: number; x1: number; y1: number; x2: number; y2: number };

const COLORS = ['#a67cff', '#88ffea', '#ffd166', '#ff6bcb', '#ff9f43', '#ff6b6b'];

type EffectsOverlayProps = {
  gridRect?: { x: number; y: number; width: number; height: number } | null;
};

const EffectsOverlay = forwardRef<EffectsOverlayRef, EffectsOverlayProps>(function EffectsOverlay({ gridRect }, ref) {
  const [motivationalText, setMotivationalText] = useState<string | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [cellGlows, setCellGlows] = useState<CellGlow[]>([]);
  const [flyingCoins, setFlyingCoins] = useState<FlyingCoin[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [thunders, setThunders] = useState<Thunder[]>([]);
  const [comboLevel, setComboLevel] = useState(0);
  const [screenFlash, setScreenFlash] = useState(false);
  const [gridAnimating, setGridAnimating] = useState(false);
  const [scoreAnimating, setScoreAnimating] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [characterMood, setCharacterMood] = useState<'idle' | 'celebrate' | 'sad' | 'combo' | 'surprised'>('idle');
  const charScale = useSharedValue(1);
  const charRotate = useSharedValue(0);
  const charBob = useSharedValue(0);
  const [charLeft, setCharLeft] = useState<number>(40);
  const [charTop, setCharTop] = useState<number>(200);
  // Aura/glow around the character for high-quality reactions
  const auraProgress = useSharedValue(0);
  const auraHue = useSharedValue(270); // default purple hue
  const auraIntensity = useSharedValue(0);
  const [sparkles, setSparkles] = useState<{ id: number; angle: number; life: number }[]>([]);
  
  // Ultra-optimized twinkling stars for smooth performance
  const [starsFar] = useState(() => Array.from({ length: 8 }).map((_, i) => ({ 
    id: `f${i}`, 
    x: Math.random(), 
    y: Math.random(), 
    s: 2, // smaller size for better performance
    baseOpacity: 0.6, // base opacity
    twinkleDelay: Math.random() * 1000, // 0-1 second delay
    twinkleDuration: 2000 + Math.random() * 2000, // 2-4 seconds
    twinkleIntensity: 0.3 + Math.random() * 0.2, // intensity variation
  })));
  const [starsMid] = useState(() => Array.from({ length: 6 }).map((_, i) => ({ 
    id: `m${i}`, 
    x: Math.random(), 
    y: Math.random(), 
    s: 3, // smaller size
    baseOpacity: 0.7, // base opacity
    twinkleDelay: Math.random() * 800, // 0-0.8 second delay
    twinkleDuration: 1500 + Math.random() * 1500, // 1.5-3 seconds
    twinkleIntensity: 0.4 + Math.random() * 0.2, // intensity variation
  })));
  const [starsNear] = useState(() => Array.from({ length: 4 }).map((_, i) => ({ 
    id: `n${i}`, 
    x: Math.random(), 
    y: Math.random(), 
    s: 4, // smaller size
    baseOpacity: 0.8, // base opacity
    twinkleDelay: Math.random() * 500, // 0-0.5 second delay
    twinkleDuration: 1000 + Math.random() * 1000, // 1-2 seconds
    twinkleIntensity: 0.5 + Math.random() * 0.2, // intensity variation
  })));
  const tFar = useSharedValue(0);
  const tMid = useSharedValue(0);
  const tNear = useSharedValue(0);
  useEffect(() => {
    tFar.value = withRepeat(withTiming(1, { duration: 24000, easing: Easing.linear }), -1, true);
    tMid.value = withRepeat(withTiming(1, { duration: 16000, easing: Easing.linear }), -1, true);
    tNear.value = withRepeat(withTiming(1, { duration: 10000, easing: Easing.linear }), -1, true);
  }, []);
  const farDrift = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tFar.value, [0, 1], [-8, 8]) },
      { translateY: interpolate(tFar.value, [0, 1], [-6, 6]) },
      { scale: 0.9 },
    ],
    opacity: 0.35,
  }));
  const midDrift = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tMid.value, [0, 1], [-12, 12]) },
      { translateY: interpolate(tMid.value, [0, 1], [-10, 10]) },
      { scale: 1.0 },
    ],
    opacity: 0.5,
  }));
  const nearDrift = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tNear.value, [0, 1], [-16, 16]) },
      { translateY: interpolate(tNear.value, [0, 1], [-14, 14]) },
      { scale: 1.05 },
    ],
    opacity: 0.7,
  }));

  // Shooting stars system
  type ShootingStar = {
    id: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    duration: number;
    delay: number;
    direction: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  };
  
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [activeDirections, setActiveDirections] = useState<Set<string>>(new Set());

  // Generate shooting star paths from all screen edges and corners
  const generateShootingStar = (): ShootingStar | null => {
    const { width, height } = Dimensions.get('window');
    const margin = 200; // Start well outside screen
    
    const directions = [
      'top-left', 'top-right', 'bottom-left', 'bottom-right',
      'left-top', 'left-bottom', 'right-top', 'right-bottom'
    ];
    
    const availableDirections = directions.filter(dir => !activeDirections.has(dir));
    if (availableDirections.length === 0) return null;
    
    const direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
    
    let startX, startY, endX, endY;
    
    switch (direction) {
      case 'top-left':
        startX = -margin;
        startY = -margin;
        endX = width + margin;
        endY = height + margin;
        break;
      case 'top-right':
        startX = width + margin;
        startY = -margin;
        endX = -margin;
        endY = height + margin;
        break;
      case 'bottom-left':
        startX = -margin;
        startY = height + margin;
        endX = width + margin;
        endY = -margin;
        break;
      case 'bottom-right':
        startX = width + margin;
        startY = height + margin;
        endX = -margin;
        endY = -margin;
        break;
      case 'left-top':
        startX = -margin;
        startY = -margin;
        endX = width + margin;
        endY = height + margin;
        break;
      case 'left-bottom':
        startX = -margin;
        startY = height + margin;
        endX = width + margin;
        endY = -margin;
        break;
      case 'right-top':
        startX = width + margin;
        startY = -margin;
        endX = -margin;
        endY = height + margin;
        break;
      case 'right-bottom':
        startX = width + margin;
        startY = height + margin;
        endX = -margin;
        endY = -margin;
        break;
      default:
        return null;
    }
    
    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const duration = Math.max(20000, distance * 0.15); // Ensure full travel time
    const delay = Math.random() * 2000; // 0-2 second delay
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      startX,
      startY,
      endX,
      endY,
      duration,
      delay,
      direction
    };
  };

  // Shooting star component
  function ShootingStarItem({ star }: { star: ShootingStar }) {
    const translateX = useSharedValue(star.startX);
    const translateY = useSharedValue(star.startY);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    useEffect(() => {
      const startAnimation = () => {
        opacity.value = withTiming(1, { duration: 200 });
        scale.value = withTiming(1, { duration: 200 });
        
        translateX.value = withTiming(star.endX, { 
          duration: star.duration, 
          easing: Easing.linear 
        });
        translateY.value = withTiming(star.endY, { 
          duration: star.duration, 
          easing: Easing.linear 
        });
        
        // Fade out near the end
        setTimeout(() => {
          opacity.value = withTiming(0, { duration: 1000 });
        }, star.duration - 1000);
      };

      const timeout = setTimeout(startAnimation, star.delay);
      return () => clearTimeout(timeout);
    }, [star]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    }));

    return (
      <Animated.View style={[styles.shootingStar, animatedStyle]}>
        <View style={styles.shootingStarCore} />
        <View style={styles.shootingStarTrail} />
        <View style={styles.shootingStarSparkles}>
          <View style={[styles.sparkle, { top: -5, left: 10 }]} />
          <View style={[styles.sparkle, { top: 5, right: 15 }]} />
          <View style={[styles.sparkle, { top: -10, right: 5 }]} />
        </View>
      </Animated.View>
    );
  }

  // Shooting stars management
  useEffect(() => {
    const createShootingStar = () => {
      const star = generateShootingStar();
      if (star) {
        setShootingStars(prev => [...prev, star]);
        setActiveDirections(prev => new Set([...prev, star.direction]));
        
        // Remove star after animation completes
        setTimeout(() => {
          setShootingStars(prev => prev.filter(s => s.id !== star.id));
          setActiveDirections(prev => {
            const newSet = new Set(prev);
            newSet.delete(star.direction);
            return newSet;
          });
        }, star.duration + star.delay + 1000);
      }
    };

    // Create shooting stars less frequently for better performance
    const interval = setInterval(createShootingStar, 8000 + Math.random() * 4000); // 8-12 seconds between stars
    
    return () => clearInterval(interval);
  }, []);


  useImperativeHandle(ref, () => ({
    confetti: () => {
      // Confetti effect without particles - using screen flash instead
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 500);
    },
    invalidShake: () => {
      // This will be handled by the game screen shake animation
    },
    gridDrawIn: () => {
      setGridAnimating(true);
      setTimeout(() => setGridAnimating(false), 1000);
    },
    gridDissolve: () => {
      setGridAnimating(true);
      setTimeout(() => setGridAnimating(false), 800);
    },
    scoreTally: (finalScore) => {
      setTargetScore(finalScore);
      setScoreAnimating(true);
      setTimeout(() => setScoreAnimating(false), 1500);
    },
    motivationalPopUp: (text) => {
      // Show later and for longer so players can read
      setTimeout(() => {
        setMotivationalText(text);
        setTimeout(() => setMotivationalText(null), 2200);
      }, 400);
    },
    floatingScore: (x, y, score) => {
      const scoreId = Date.now() + Math.random() * 1000;
      setFloatingScores([{ id: scoreId, x, y, score }]);
      setTimeout(() => setFloatingScores([]), 2000);
    },
    cellGlow: (x, y) => {
      const glowId = Date.now() + Math.random() * 1000;
      setCellGlows([{ id: glowId, x, y }]);
      setTimeout(() => setCellGlows([]), 1000);
    },
    screenFlash: () => {
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 300);
    },
    coinFly: (x, y, targetX, targetY) => {
      const coinId = Date.now() + Math.random() * 1000; // Ensure unique ID
      const newCoin: FlyingCoin = { id: coinId, x, y, targetX, targetY, progress: 0 };
      setFlyingCoins(prev => [...prev, newCoin]);

      // Animate coin flight using a local progress to avoid stale state reads
      let localProgress = 0;
      const step = () => {
        localProgress = Math.min(localProgress + 0.02, 1);
        setFlyingCoins(prev => prev.map(coin => (
          coin.id === coinId ? { ...coin, progress: localProgress } : coin
        )));
        if (localProgress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            setFlyingCoins(prev => prev.filter(c => c.id !== coinId));
          }, 100);
        }
      };
      requestAnimationFrame(step);
    },
    updateCombo: (combo) => {
      setComboLevel(combo);
    },
    characterCelebrate: () => {
      setCharacterMood('celebrate');
      charScale.value = withSequence(withTiming(1.2, { duration: 160 }), withTiming(1, { duration: 200 }));
      charRotate.value = withSequence(withTiming(15, { duration: 120 }), withTiming(-15, { duration: 120 }), withTiming(0, { duration: 120 }));
      auraHue.value = 50; // golden
      auraIntensity.value = 1;
      auraProgress.value = 0;
      auraProgress.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) });
      // Emit celebratory sparkles
      const base = Date.now();
      const newSparkles = Array.from({ length: 12 }).map((_, i) => ({ id: base + i, angle: (i / 12) * Math.PI * 2, life: 0 }));
      setSparkles(newSparkles);
      let raf: number;
      const step = () => {
        setSparkles(prev => prev.map(s => ({ ...s, life: Math.min(1, s.life + 0.04) })).filter(s => s.life < 1));
        if (newSparkles.length) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      setTimeout(() => setCharacterMood('idle'), 1500);
    },
    characterSad: () => {
      setCharacterMood('sad');
      charScale.value = withSequence(withTiming(0.9, { duration: 120 }), withTiming(1, { duration: 240 }));
      auraHue.value = 210; // blue
      auraIntensity.value = 0.6;
      auraProgress.value = 0;
      auraProgress.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      setTimeout(() => setCharacterMood('idle'), 1500);
    },
    characterCombo: () => {
      setCharacterMood('combo');
      charScale.value = withSequence(withTiming(1.15, { duration: 120 }), withTiming(1, { duration: 200 }));
      auraHue.value = 0; // red-hot
      auraIntensity.value = 1;
      auraProgress.value = 0;
      auraProgress.value = withRepeat(withTiming(1, { duration: 900 }), 2, false);
      setTimeout(() => setCharacterMood('idle'), 1200);
    },
    characterSurprised: () => {
      setCharacterMood('surprised');
      charScale.value = withSequence(withTiming(1.25, { duration: 140 }), withTiming(1.05, { duration: 220 }));
      auraHue.value = 120; // lime
      auraIntensity.value = 0.8;
      auraProgress.value = 0;
      auraProgress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
      setTimeout(() => setCharacterMood('idle'), 1500);
    },
    setCharacterAnchor: (left, top) => {
      setCharLeft(left);
      setCharTop(top);
    },
    rippleAt: (x, y) => {
      const id = Date.now() + Math.random();
      setRipples(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 700);
    },
    thunderBetween: (x1, y1, x2, y2) => {
      const id = Date.now() + Math.random();
      setThunders(prev => [...prev, { id, x1, y1, x2, y2 }]);
      setTimeout(() => setThunders(prev => prev.filter(t => t.id !== id)), 450);
    },
    resetAllEffects: () => {
      setFlyingCoins([]);
      setFloatingScores([]);
      setCellGlows([]);
      setRipples([]);
      setThunders([]);
      setMotivationalText(null);
      setScreenFlash(false);
      setComboLevel(0);
      setGridAnimating(false);
      setScoreAnimating(false);
      setCurrentScore(0);
      setTargetScore(0);
      setCharacterMood('idle');
      charScale.value = 1;
      charRotate.value = 0;
      charBob.value = 0;
    },
  }));

  useEffect(() => {
    // Gentle idle bobbing
    charBob.value = withRepeat(withSequence(withTiming(-6, { duration: 800 }), withTiming(0, { duration: 800 })), -1, true);
  }, []);

  const characterAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: charBob.value },
      { rotate: `${charRotate.value}deg` },
      { scale: charScale.value },
    ],
  }));

  const auraStyle = useAnimatedStyle(() => {
    const opacity = auraIntensity.value * (1 - auraProgress.value);
    const scale = 1 + auraProgress.value * 1.8;
    const hue = auraHue.value;
    return {
      opacity,
      transform: [{ scale }],
      shadowColor: `hsl(${hue} 100% 60%)`,
      backgroundColor: `hsla(${hue}, 100%, 60%, ${0.25 * opacity})`,
      borderColor: `hsl(${hue} 100% 70%)`,
    } as any;
  });


  // Enhanced twinkling star component with realistic star behavior
  function TwinklingStar({ star, layer }: { star: any; layer: 'far' | 'mid' | 'near' }) {
    const twinkleOpacity = useSharedValue(star.baseOpacity || 0.8);
    
    useEffect(() => {
      const startTwinkle = () => {
        // Simplified twinkling: single fade in/out cycle for better performance
        twinkleOpacity.value = withSequence(
          withTiming(star.baseOpacity + star.twinkleIntensity, { duration: star.twinkleDuration / 2, easing: Easing.out(Easing.quad) }),
          withTiming(star.baseOpacity, { duration: star.twinkleDuration / 2, easing: Easing.out(Easing.quad) })
        );
      };
      
      // Start after delay and repeat less frequently
      const delayTimeout = setTimeout(() => {
        startTwinkle();
        const interval = setInterval(startTwinkle, star.twinkleDuration + Math.random() * 3000);
        return () => clearInterval(interval);
      }, star.twinkleDelay);
      
      return () => clearTimeout(delayTimeout);
    }, [star.twinkleDelay, star.twinkleDuration, star.baseOpacity, star.twinkleIntensity]);
    
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: twinkleOpacity.value,
    }));
    
    // Enhanced star appearance with glow effect
    const starSize = star.s;
    const glowSize = starSize * 2.5;

  return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: `${star.x * 100}%`, 
            top: `${star.y * 100}%`, 
            width: glowSize, 
            height: glowSize, 
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedStyle
        ]} 
      >
        {/* Glow effect */}
        <View style={{
            position: 'absolute',
          width: glowSize,
          height: glowSize,
          borderRadius: glowSize / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
            shadowRadius: 8,
        }} />
        {/* Main star */}
        <View style={{
          width: starSize,
          height: starSize,
          borderRadius: starSize / 2,
          backgroundColor: '#FFFFFF',
          shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
            shadowRadius: 4,
        }} />
      </Animated.View>
    );
  }


  // Space characters removed for performance
  
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 10000, elevation: 10000 }]}>
      {/* Background starfield parallax with twinkling */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.starsLayer, farDrift]}>
        {starsFar.map((st) => (
          <TwinklingStar key={st.id} star={st} layer="far" />
        ))}
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styles.starsLayer, midDrift]}>
        {starsMid.map((st) => (
          <TwinklingStar key={st.id} star={st} layer="mid" />
        ))}
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styles.starsLayer, nearDrift]}>
        {starsNear.map((st) => (
          <TwinklingStar key={st.id} star={st} layer="near" />
        ))}
      </Animated.View>
      
      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStarItem key={star.id} star={star} />
      ))}
      
      {/* Animated character avatar near the grid (left-center) with aura */}
      <Animated.View style={[{ position: 'absolute', left: charLeft, top: charTop, marginTop: -80, zIndex: 10006, width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }, characterAnimStyle]}>
        <Animated.View style={[styles.aura, auraStyle]} />
        <CharacterComponent mood={characterMood} />
        {sparkles.map((s) => {
          const radius = 70 * s.life;
          const x = Math.cos(s.angle) * radius;
          const y = Math.sin(s.angle) * radius;
          const size = 6 + 8 * (1 - s.life);
          return (
            <View key={s.id} style={[styles.spark, { transform: [{ translateX: x }, { translateY: y }], width: size, height: size, opacity: 1 - s.life }]} />
          );
        })}
      </Animated.View>
      {floatingScores.map((s) => (
        <FloatingScoreEffect key={s.id} x={s.x} y={s.y} score={s.score} />
      ))}
      {cellGlows.map((g) => (
        <CellGlowEffect key={g.id} x={g.x} y={g.y} />
      ))}
      {flyingCoins.map((coin) => (
        <FlyingCoinEffect key={coin.id} coin={coin} />
      ))}
      {thunders.map((t) => (
        <ThunderBolt key={t.id} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
      ))}
      {comboLevel > 0 && (
        <ComboMeter level={comboLevel} />
      )}
      {ripples.map((r) => (
        <RippleCircle key={r.id} x={r.x} y={r.y} />
      ))}
      {motivationalText && (
        <MotivationalPopUp text={motivationalText} />
      )}
      {screenFlash && <View style={styles.screenFlash} />}
    </View>
  );
});

export default EffectsOverlay;

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
  },
  floatingText: {
    color: '#88ffea',
    fontWeight: '800',
    textShadowColor: '#1a1340',
    textShadowRadius: 8,
  },
  motivationalPopUp: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -100,
    backgroundColor: 'rgba(106, 77, 255, 0.95)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: '#6b4dff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 10001,
    elevation: 10001,
  },
  motivationalText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  floatingScore: {
    position: 'absolute',
    width: 50,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10002,
    elevation: 10002,
  },
  floatingScoreText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00ff88',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cellGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffff00',
    opacity: 0.6,
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    zIndex: 10003,
    elevation: 10003,
  },
  screenFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 996,
    elevation: 996,
  },
  starsLayer: {
    zIndex: 10000,
    backgroundColor: 'transparent',
  },
  shootingWrapper: {
    position: 'absolute',
    width: 200,
    height: 1,
    zIndex: 2,
  },
  shootingCoreBase: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 4,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(255, 255, 255, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  shootingTrailBase: {
    position: 'absolute',
    left: -50,
    top: 0,
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  ship: {
    position: 'absolute',
    zIndex: 1000,
  },
  shipText: {
    fontSize: 32,
    textShadowColor: 'rgba(255,255,255,1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  astronautText: {
    fontSize: 36,
    textShadowColor: 'rgba(255,255,255,1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  // matchRipple defined later with updated sizing and colors
  floatingNumber: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingNumberText: {
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cellPop: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00d4ff',
    opacity: 0.6,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  scoreFloat: {
    position: 'absolute',
    width: 40,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreFloatText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#00ff88',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  flyingCoin: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10004,
    elevation: 10004,
  },
  coinText: {
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // Ensure emoji font rendering on web
    fontFamily: Platform.OS === 'web' ? 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, Twemoji Mozilla, EmojiOne Color, Android Emoji, sans-serif' : undefined,
  },
  comboMeter: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10005,
    elevation: 10005,
  },
  comboContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  comboText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aura: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 24,
    zIndex: -1,
  },
  spark: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  matchRipple: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.95)',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    shadowColor: 'rgba(255, 215, 0, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    zIndex: 10000,
  },
  thunderBolt: {
    position: 'absolute',
    backgroundColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderRadius: 2,
    zIndex: 9999,
  },
  shootingStar: {
    position: 'absolute',
    width: 4,
    height: 4,
    zIndex: 10001,
  },
  shootingStarCore: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  shootingStarTrail: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    transform: [{ translateX: -18 }, { translateY: 1 }],
  },
  shootingStarSparkles: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  sparkle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});


