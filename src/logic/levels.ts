export type LevelConfig = {
  id: number;
  rows: number;
  cols: number;
  timerSeconds: number;
  maxExtraRows: number; // how many rows user can add
  numberRange: [number, number];
};

export const LEVELS: LevelConfig[] = [
  // Base: Level 1 -> 40s, +4s each level
  { id: 1, rows: 5, cols: 6, timerSeconds: 40, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 2, rows: 5, cols: 6, timerSeconds: 44, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 3, rows: 6, cols: 7, timerSeconds: 48, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 4, rows: 6, cols: 7, timerSeconds: 52, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 5, rows: 7, cols: 8, timerSeconds: 56, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 6, rows: 7, cols: 8, timerSeconds: 60, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 7, rows: 8, cols: 9, timerSeconds: 64, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 8, rows: 8, cols: 9, timerSeconds: 68, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 9, rows: 9, cols: 10, timerSeconds: 72, maxExtraRows: 0, numberRange: [1, 9] },
  { id: 10, rows: 9, cols: 10, timerSeconds: 76, maxExtraRows: 0, numberRange: [1, 9] },
];

export const isValidMatch = (a: number, b: number) => {
  return a === b || a + b === 10;
};

export function generateBoard(level: LevelConfig): number[] {
  const [min, max] = level.numberRange;
  const total = level.rows * level.cols;
   // Guarantee every cell has a valid pair (equal or sum to 10)
  const pairs: number[] = [];
  for (let i = 0; i < total / 2; i++) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min; // 1..9
    const makeSumToTen = Math.random() < 0.5 && a !== 5; // avoid many 5+5 if we choose sum-to-10
    if (makeSumToTen) {
      const b = 10 - a;
      // ensure b in range
      if (b >= min && b <= max) {
        pairs.push(a, b);
        continue;
      }
    }
    // fallback to equal pair
    pairs.push(a, a);
  }
  // Shuffle pairs
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}


