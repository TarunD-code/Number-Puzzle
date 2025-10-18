# 🎮 Number Puzzle Game

A React Native number puzzle game with beautiful animations, twinkling stars, and optimized performance for both web and mobile platforms.

## 🎬 Gameplay Demo

### 📱 Watch the Gameplay Video

![Gameplay Video](./assets/Game_video.mp4)

> **📱 Video Features Demonstrated:**
> - ✅ Number matching mechanics (equal numbers and sum to 10)
> - ✅ Visual feedback for valid/invalid matches  
> - ✅ Grid system with 3-4 initial rows
> - ✅ Add row functionality
> - ✅ Level progression through all 3 levels
> - ✅ Twinkling stars and shooting star animations
> - ✅ Celebration effects and smooth transitions
> - ✅ 2-minute level completion timing

## ✨ Features

- **🎯 Number Matching Game**: Match numbers to complete levels
- **⭐ Twinkling Stars**: Beautiful star animations with glow effects
- **🚀 Shooting Stars**: Dynamic shooting star animations
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Smooth Animations**: Optimized for 60fps performance
- **📊 Progressive Levels**: Increasing difficulty with each level
- **🎉 Celebration Effects**: Special animations for level completion

## 🎮 Core Gameplay Mechanics

### Match Rules
- **Equal Numbers**: Match two cells with the same number (e.g., 5 = 5)
- **Sum to 10**: Match two cells that sum to 10 (e.g., 7 + 3 = 10, 4 + 6 = 10)
- **Visual Feedback**: Valid matches dull the cells with visual effects
- **Invalid Matches**: Shake or red flash animation for incorrect matches

### Game Interaction
1. **Tap First Cell**: Highlights the selected cell
2. **Tap Second Cell**: Selects the second cell for matching
3. **Rule Check**: System validates the match according to rules
4. **Animation**: Visual feedback based on match result

### Grid System
- **Initial State**: Only 3-4 rows filled with numbers (not completely filled)
- **Add Row Button**: Allows adding limited additional rows
- **Progressive Difficulty**: Each level introduces harder constraints
- **Time Limit**: Each level must be completed within 2 minutes

### Level Structure
- **3 Distinct Levels**: Each with increasing difficulty
- **Level 1**: Basic number matching (5-10 numbers)
- **Level 2**: More complex patterns (10-15 numbers)
- **Level 3**: Advanced challenges (15-20 numbers)

## 🛠️ Tech Stack

- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **React Navigation** for screen management
- **Expo Haptics** for tactile feedback
- **Linear Gradients** for beautiful backgrounds

## 🏗️ Architecture

### Component Architecture
- **Clean Architecture**: Separation of concerns with reusable components
- **Scalable Design**: Modular structure for easy maintenance and expansion
- **Type Safety**: Full TypeScript implementation for robust development
- **Performance Optimized**: Efficient rendering with React Native Reanimated

### State Management
- **Context API**: Centralized state management for game levels and progress
- **Local State**: Component-level state for UI interactions
- **Persistent State**: Game progress and level completion tracking

### Code Organization
```
src/
├── components/          # Reusable UI components
│   ├── Cell.tsx        # Number cell with matching logic
│   ├── EffectsOverlay.tsx # Visual effects and animations
│   └── Character.tsx   # Game character component
├── screens/            # Screen components
│   └── GameScreen.tsx  # Main game interface
├── logic/              # Game logic and rules
│   └── levels.ts       # Level definitions and constraints
├── state/              # State management
│   └── LevelsContext.tsx # Global state management
└── theme/              # Design system
    └── colors.ts       # Color palette and theming
```

## 🚀 Setup Steps

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g expo-cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/TarunD-code/Number-Puzzle.git
   cd Number-Puzzle
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start --tunnel --port 8082
   ```

4. **Run on different platforms**
   ```bash
   # Web Browser
   npx expo start --web
   
   # Android Emulator/Device
   npx expo start --android
   
   # iOS Simulator/Device
   npx expo start --ios
   ```

### Quick Start (No Login Required)
- **No initial login screen** - Game launches directly
- **No tutorials** - Intuitive gameplay
- **Basic theme** - Clean and simple design
- **3 levels minimum** - Progressive difficulty

## 📱 Mobile Development Setup

### Android Setup

1. **Install Android SDK**
   ```bash
   # Run the setup script
   .\setup-complete-android.ps1
   ```

2. **Create Android Virtual Device**
   ```bash
   # Create AVD
   .\create-avd.ps1
   ```

3. **Start Android Emulator**
   ```bash
   emulator -avd Pixel_7_API_34
   ```

### iOS Setup

1. **Install Xcode** from App Store
2. **Install iOS Simulator**
3. **Run on iOS**
   ```bash
   npx expo start --ios
   ```

## 🎮 How to Play

1. **Start the Game**: Tap to begin the number puzzle
2. **Match Numbers**: Find and tap matching numbers
3. **Complete Levels**: Clear all numbers to advance
4. **Enjoy Animations**: Watch the beautiful star effects
5. **Progress**: Each level increases in difficulty

## 🎨 Visual Effects

### Twinkling Stars
- **Far Layer**: 8 stars with subtle twinkling
- **Mid Layer**: 6 stars with medium intensity
- **Near Layer**: 4 stars with bright twinkling
- **Glow Effects**: Realistic star glow with shadows

### Shooting Stars
- **Frequency**: Every 8-12 seconds
- **Paths**: 8 different diagonal trajectories
- **Duration**: 2-4 seconds per star
- **Effects**: Core, trail, and glow components

## 🔧 Performance Optimizations

- **Reduced Animation Elements**: 85% fewer animated objects
- **Simplified Animations**: Single-layer animations for smooth performance
- **Optimized Rendering**: Efficient re-rendering strategies
- **Memory Management**: Proper cleanup of animation timers

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Banner.tsx      # Game banner component
│   ├── Cell.tsx        # Number cell component
│   ├── Character.tsx    # Character component
│   ├── EffectsOverlay.tsx # Visual effects
│   └── CongratulationsScreen.tsx
├── screens/            # Screen components
│   └── GameScreen.tsx  # Main game screen
├── logic/              # Game logic
│   └── levels.ts       # Level definitions
├── state/              # State management
│   └── LevelsContext.tsx
├── theme/              # Theme configuration
│   └── colors.ts       # Color palette
└── types/              # TypeScript definitions
```

## 🛠️ Development Scripts

### Setup Scripts
- `setup-complete-android.ps1` - Complete Android development setup
- `create-avd.ps1` - Create Android Virtual Device
- `fix-expo-issues.ps1` - Fix common Expo development issues

### Troubleshooting
- `manual-fix.ps1` - Manual troubleshooting steps
- `setup-android-env.ps1` - Android environment setup

## 🚀 Deployment

### Web Deployment
```bash
npx expo build:web
```

### Mobile Deployment
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 🎯 Game Features

### Level System
- **Progressive Difficulty**: Each level increases complexity
- **Visual Feedback**: Smooth transitions between levels
- **Score Tracking**: Points for successful matches
- **Time Management**: Time-based challenges

### Animation System
- **Performance Optimized**: 60fps smooth animations
- **Memory Efficient**: Proper cleanup and management
- **Cross-Platform**: Works on all platforms
- **Responsive**: Adapts to different screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for excellent libraries
- **Open Source Contributors** for inspiration and tools

## 📦 Deliverables

### GitHub Repository
- **Public Repository**: [https://github.com/TarunD-code/Number-Puzzle.git](https://github.com/TarunD-code/Number-Puzzle.git)
- **Documented Code**: Complete source code with inline documentation
- **Commit History**: Detailed commit history showing development progress
- **Branch Management**: Main branch with feature branches

### README.md Documentation
- **Setup Steps**: Complete installation and configuration guide
- **Level Structure**: Detailed explanation of 3 progressive levels
- **Architecture**: Component structure and design patterns
- **Game Rules**: Core gameplay mechanics and interaction flow

### APK Build
- **Android APK**: Available in GitHub Releases
- **Cross-Platform**: Works on Android devices
- **Optimized Performance**: 60fps smooth gameplay
- **Production Ready**: Tested and validated build

### Demo Video
- **30-60 Second Recording**: Gameplay demonstration
- **Screen Recording**: Shows core gameplay mechanics
- **Level Progression**: Demonstrates all 3 levels
- **Visual Effects**: Showcases animations and feedback

#### 🎬 Gameplay Video

![Gameplay Demo Video](./assets/Game_video.mp4)

**Video Features Demonstrated:**
- ✅ Number matching mechanics (equal numbers and sum to 10)
- ✅ Visual feedback for valid/invalid matches
- ✅ Grid system with 3-4 initial rows
- ✅ Add row functionality
- ✅ Level progression through all 3 levels
- ✅ Twinkling stars and shooting star animations
- ✅ Celebration effects and smooth transitions
- ✅ 2-minute level completion timing

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting scripts
2. Review the setup documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Made with ❤️ using React Native and Expo**