import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useLevels } from '../state/LevelsContext';
import { LEVELS, generateBoard, isValidMatch } from '../logic/levels';
import Cell from '../components/Cell';
import EffectsOverlay, { EffectsOverlayRef } from '../components/EffectsOverlay';
import CongratulationsScreen from '../components/CongratulationsScreen';
import * as Haptics from 'expo-haptics';

type Coord = { index: number; value: number };

export default function GameScreen() {
  const { level, currentLevelIndex, nextLevel, resetLevels } = useLevels();

  const motivationalQuotes = [
    'Super!', 'Fabulous!', 'Excellent!', 'Amazing!', 'Fantastic!', 
    'Brilliant!', 'Outstanding!', 'Perfect!', 'Incredible!', 'Wonderful!'
  ];

  const [board, setBoard] = useState<number[]>(() => generateBoard(level));
  const [faded, setFaded] = useState<boolean[]>(() => board.map(() => false));
  const [selected, setSelected] = useState<Coord | null>(null);
  const [extraRowsLeft, setExtraRowsLeft] = useState(level.maxExtraRows);
  const [secondsLeft, setSecondsLeft] = useState(level.timerSeconds);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [showCompletionActions, setShowCompletionActions] = useState(false);
  const completionAnim = useSharedValue(0);
  const [gridRect, setGridRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [coins, setCoins] = useState<boolean[]>(() => 
    Array(level.rows * level.cols).fill(false).map(() => Math.random() < 0.3) // 30% chance for coin
  );
  const shakeX = useSharedValue(0);
  const effectsRef = React.useRef<EffectsOverlayRef>(null);
  const [lastMatch, setLastMatch] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);

  useEffect(() => {
    setBoard(generateBoard(level));
    setFaded(Array(level.rows * level.cols).fill(false));
    setSelected(null);
    setExtraRowsLeft(level.maxExtraRows);
    setSecondsLeft(level.timerSeconds);
    setGameOver(false);
    setCoins(Array(level.rows * level.cols).fill(false).map(() => Math.random() < 0.3));
    // Grid draw-in animation
    effectsRef.current?.gridDrawIn();
    // Reset effects (coins, combo, overlays) when level changes
    effectsRef.current?.resetAllEffects?.();
    setComboCount(0);
    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
  }, [level]);

  useEffect(() => {
    if (gameOver) return; // stop ticking when game is over
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  useEffect(() => {
    if (secondsLeft <= 0 && !gameOver) {
      setGameOver(true);
      setShowTimeUp(true);
      effectsRef.current?.characterSad();
    }
  }, [secondsLeft, gameOver]);

  const totalCells = level.rows * level.cols;

  const remainingCount = useMemo(() => faded.filter((f) => !f).length, [faded]);

  function handlePress(index: number) {
    if (faded[index] || gameOver) return;
    const value = board[index];
    if (selected == null) {
      setSelected({ index, value });
      return;
    }
    if (selected.index === index) return;

    const valid = isValidMatch(selected.value, value);
    if (valid) {
      const nf = faded.slice();
      nf[selected.index] = true;
      nf[index] = true;
      setFaded(nf);
      setSelected(null);
      
      // Calculate cell positions for beam and sparkles - use actual grid position
      const cols = level.cols;
      const cellSize = 68; // styles.cell width/height
      const cellMargin = 6; // styles.wrapper margin
      const paddingTop = 20; // styles.grid paddingVertical top
      const step = cellSize + cellMargin * 2; // 68 + 12 = 80
      const gridWidth = cols * step;
      const screenWidth = window.innerWidth || 800;
      const estimatedOffsetX = (screenWidth - gridWidth) / 2;
      const estimatedOffsetY = window.innerHeight / 2 - 100; // Fallback center
      // When gridRect is available, derive exact per-cell spacing from layout
      const useMeasured = !!gridRect;
      const stepX = useMeasured ? (gridRect!.width / cols) : step;
      const stepY = useMeasured ? ((gridRect!.height - paddingTop * 2) / level.rows) : step;
      const baseLeft = useMeasured ? gridRect!.x : estimatedOffsetX;
      const baseTop = useMeasured ? gridRect!.y : estimatedOffsetY;
      // Centers of the first row/col
      const firstCenterX = useMeasured ? (baseLeft + stepX * 0.5) : (baseLeft + cellMargin + cellSize / 2);
      const firstCenterY = useMeasured ? (baseTop + paddingTop + stepY * 0.5) : (baseTop + paddingTop + cellMargin + cellSize / 2);
      
      // Calculate exact center positions of cells
      const x1 = firstCenterX + (selected.index % cols) * stepX;
      const y1 = firstCenterY + Math.floor(selected.index / cols) * stepY;
      const x2 = firstCenterX + (index % cols) * stepX;
      const y2 = firstCenterY + Math.floor(index / cols) * stepY;
      
      // Enhanced match effects (respect reduced motion)
      if (!reducedMotion) {
        effectsRef.current?.cellGlow(x1, y1);
        effectsRef.current?.cellGlow(x2, y2);
        effectsRef.current?.floatingScore(x1, y1, 10);
        effectsRef.current?.screenFlash();
        // Spawn match-centered ripple circles exactly at each matched cell
        effectsRef.current?.rippleAt?.(x1, y1);
        effectsRef.current?.rippleAt?.(x2, y2);
        // If aligned horizontally or vertically, draw a thunder bolt between them
        const sameRow = Math.floor(selected.index / cols) === Math.floor(index / cols);
        const sameCol = (selected.index % cols) === (index % cols);
        if (sameRow || sameCol) {
          effectsRef.current?.thunderBetween?.(x1, y1, x2, y2);
        }

        // If a whole row/column just got cleared, draw a full-length bolt across it
        const row1 = Math.floor(selected.index / cols);
        const row2 = Math.floor(index / cols);
        const col1 = selected.index % cols;
        const col2 = index % cols;
        const tryRow = (row: number) => {
          const rowStart = row * cols;
          const rowCleared = Array.from({ length: cols }).every((_, c) => nf[rowStart + c]);
          if (rowCleared) {
          const y = firstCenterY + row * stepY;
          const xStart = firstCenterX;
          const xEnd = firstCenterX + (cols - 1) * stepX;
            effectsRef.current?.thunderBetween?.(xStart, y, xEnd, y);
          }
        };
        const tryCol = (col: number) => {
          const colCleared = Array.from({ length: level.rows }).every((_, r) => nf[r * cols + col]);
          if (colCleared) {
          const x = firstCenterX + col * stepX;
          const yStart = firstCenterY;
          const yEnd = firstCenterY + (level.rows - 1) * stepY;
            effectsRef.current?.thunderBetween?.(x, yStart, x, yEnd);
          }
        };
        tryRow(row1); if (row2 !== row1) tryRow(row2);
        tryCol(col1); if (col2 !== col1) tryCol(col2);
        
        // Coin fly animation to score area (only if coins are present)
        const scoreAreaX = window.innerWidth - 100; // Right side
        const scoreAreaY = 100; // Top area
        if (coins[selected.index]) {
          effectsRef.current?.coinFly(x1, y1, scoreAreaX, scoreAreaY);
        }
        if (coins[index]) {
          effectsRef.current?.coinFly(x2, y2, scoreAreaX, scoreAreaY);
        }
      }
      
      // Update combo and score (trigger character expression for any match)
      const newCombo = comboCount + 1;
      setComboCount(newCombo);
      const baseScore = 10;
      const comboBonus = Math.min(newCombo * 5, 50); // Max 50 bonus
      const coinBonus = (coins[selected.index] ? 20 : 0) + (coins[index] ? 20 : 0); // Coin bonus
      const totalMatchScore = baseScore + comboBonus + coinBonus;
      setTotalScore(prev => prev + totalMatchScore);
      
      // Update combo meter
      effectsRef.current?.updateCombo(newCombo);
      if (newCombo >= 3) effectsRef.current?.characterCombo();
      else effectsRef.current?.characterSurprised();

      // 2s combo window: reset countdown on each successful match
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setComboCount(0);
        effectsRef.current?.updateCombo(0);
      }, 2000);
      
      // Remove coins from matched cells
      if (coins[selected.index] || coins[index]) {
        const newCoins = coins.slice();
        newCoins[selected.index] = false;
        newCoins[index] = false;
        setCoins(newCoins);
      }
      
      // Enhanced motivational popup with combo
      let motivationalText = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      if (newCombo >= 3) {
        motivationalText = `🔥 ${newCombo}x COMBO!`;
      }
      effectsRef.current?.motivationalPopUp(motivationalText);
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const done = nf.every((x) => x);
      if (done) {
        // Mark game over to stop the timer
        setGameOver(true);
        effectsRef.current?.characterCelebrate();
        // Level completion - grid dissolve and score tally
        effectsRef.current?.gridDissolve();
        effectsRef.current?.scoreTally(totalScore);
        setShowCongratulations(true);
        effectsRef.current?.confetti();
        // After 3s, reveal completion actions with animation
        setShowCompletionActions(false);
        setTimeout(() => {
          setShowCompletionActions(true);
          completionAnim.value = 0;
          completionAnim.value = withTiming(1, { duration: 400 });
        }, 3000);
      }
    } else {
      // Invalid match failure - reset combo and shake animation
      setComboCount(0);
      effectsRef.current?.updateCombo(0);
      effectsRef.current?.characterSad();
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
        comboTimerRef.current = null;
      }
      
      if (!reducedMotion) {
        shakeX.value = withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      }
      setSelected({ index, value });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setSelected(null), 160);
    }
  }

  function addRow() {
    if (extraRowsLeft <= 0) return;
    const newValues = generateBoard({ ...level, rows: 1, cols: level.cols });
    setBoard((b) => [...b, ...newValues]);
    setFaded((f) => [...f, ...Array(level.cols).fill(false)]);
    setExtraRowsLeft((n) => n - 1);
  }

  function restartLevel() {
    setBoard(generateBoard(level));
    setFaded(Array(level.rows * level.cols).fill(false));
    setSelected(null);
    setExtraRowsLeft(level.maxExtraRows);
    setSecondsLeft(level.timerSeconds);
    setGameOver(false);
    setComboCount(0);
    setTotalScore(0);
    setCoins(Array(level.rows * level.cols).fill(false).map(() => Math.random() < 0.3));
    effectsRef.current?.updateCombo(0);
    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
    effectsRef.current?.resetAllEffects?.();
  }

  const cols = level.cols;
  const gridAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const completionCardAnimStyle = useAnimatedStyle(() => ({
    opacity: completionAnim.value,
    transform: [{ translateY: (1 - completionAnim.value) * 16 }],
  }));

  return (
    <View style={styles.container}>
      <EffectsOverlay ref={effectsRef} gridRect={gridRect} />
      {showCongratulations && (
        <CongratulationsScreen 
          score={totalScore}
          onNextLevel={() => { setShowCongratulations(false); setShowCompletionActions(false); nextLevel(); }}
          onRestart={() => { setShowCongratulations(false); setShowCompletionActions(false); restartLevel(); }}
        />
      )}
      {showTimeUp && (
        <View style={styles.timeUpOverlay}>
          <View style={styles.timeUpCard}>
            <Text style={styles.timeUpTitle}>Time's Up!</Text>
            <Text style={styles.timeUpText}>Final Score: {totalScore}</Text>
            <View style={styles.timeUpActions}>
              <Pressable style={[styles.button, styles.timeUpButton]} onPress={() => { setShowTimeUp(false); restartLevel(); }}>
                <Text style={styles.buttonText}>Retry Level</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Level {level.id}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Time: {Math.max(0, secondsLeft)}s</Text>
          <Text style={styles.stat}>Left: {remainingCount}</Text>
          <Text style={styles.stat}>Score: {totalScore}</Text>
          <Text style={styles.stat}>Rows +{extraRowsLeft}</Text>
          <Pressable 
            style={styles.motionToggle} 
            onPress={() => setReducedMotion(!reducedMotion)}
          >
            <Text style={styles.motionToggleText}>
              {reducedMotion ? '🎬' : '🎭'}
            </Text>
          </Pressable>
        </View>
      </View>

          <Animated.View
            onLayout={(e) => {
              const { x, y, width, height } = e.nativeEvent.layout;
              setGridRect({ x, y, width, height });
            // Anchor character to left-middle of grid
            const charLeft = Math.max(16, x - 96);
            const charTop = y + height / 2;
            effectsRef.current?.setCharacterAnchor(charLeft, charTop);
            }}
            style={[styles.grid, gridAnim, { width: cols * 80, minHeight: level.rows * 80 + 40 }]}
          >
            {board.map((value, idx) => (
              <Cell
                key={idx}
                value={value}
                faded={faded[idx]}
                selected={selected?.index === idx}
                hasCoin={coins[idx]}
                onPress={() => handlePress(idx)}
              />
            ))}
          </Animated.View>

      <View style={styles.controls}>
        <Animated.View style={styles.buttonContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]} 
            onPress={restartLevel}
          >
            <Text style={styles.buttonText}>Restart</Text>
          </Pressable>
        </Animated.View>
        {false && (
        <Pressable style={[styles.button, extraRowsLeft<=0 && styles.buttonDisabled]} onPress={addRow} disabled={extraRowsLeft<=0}>
          <Text style={styles.buttonText}>Add Row</Text>
        </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { color: '#f2e9ff', fontSize: 32, fontWeight: '900', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  stat: { color: '#c6b7ff', fontSize: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 20,
    zIndex: 1,
    elevation: 1,
  },
  controls: { flexDirection: 'row', gap: 16, marginTop: 20 },
  timeUpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayGridFrame: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeUpCard: {
    backgroundColor: '#1b1438',
    padding: 24,
    borderRadius: 16,
    width: 320,
    alignItems: 'center',
    borderColor: '#6b4dff',
    borderWidth: 1,
  },
  timeUpTitle: { color: '#ffd166', fontSize: 28, fontWeight: '900', marginBottom: 8 },
  timeUpText: { color: '#c6b7ff', fontSize: 16, marginBottom: 16 },
  timeUpActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  timeUpButton: { backgroundColor: '#6b4dff' },
  buttonContainer: {
    shadowColor: '#6b4dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    backgroundColor: '#6b4dff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  buttonDisabled: { backgroundColor: '#3a2c66' },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 18 },
  motionToggle: {
    backgroundColor: 'rgba(106, 77, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  motionToggleText: {
    fontSize: 16,
    color: '#c6b7ff',
  },
});


