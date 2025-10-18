## Number Puzzle (React Native / Expo)

A simple number-matching puzzle inspired by Number Master. Built with Expo + TypeScript.

### Gameplay Rules
- Tap two cells to match.
- A match is valid if numbers are equal or sum to 10.
- Matched cells stay visible but become faded.
- Invalid pair briefly highlights and selection resets.
- Each level has a timer (120s). Complete all cells before time runs out.
- Add Row button appends a new row; limited per level.
- Three levels with increasing grid sizes.

### Levels
- Level 1: 4x6, +2 rows
- Level 2: 5x7, +2 rows
- Level 3: 6x8, +1 row

### Getting Started
```bash
npm install
npm run android   # or npm run web
```

On Android, use Expo Go or an emulator.

### Build APK
See Expo EAS Build. Minimal steps:
```bash
npx expo install eas-cli
npx eas build -p android --profile preview
```

### Project Structure
- `src/logic` level configs, board generation, match rule
- `src/state` simple context for level progression
- `src/screens/GameScreen.tsx` main gameplay
- `src/components/Cell.tsx` cell UI

### Notes
- Uses `react-native-gesture-handler` and `react-native-reanimated` for smooth UX. The Babel plugin is configured in `babel.config.js`.


