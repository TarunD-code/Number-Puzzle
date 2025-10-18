# 🎮 Number Puzzle Game

A React Native number puzzle game with beautiful animations, twinkling stars, and optimized performance for both web and mobile platforms.

## ✨ Features

- **🎯 Number Matching Game**: Match numbers to complete levels
- **⭐ Twinkling Stars**: Beautiful star animations with glow effects
- **🚀 Shooting Stars**: Dynamic shooting star animations
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Smooth Animations**: Optimized for 60fps performance
- **📊 Progressive Levels**: Increasing difficulty with each level
- **🎉 Celebration Effects**: Special animations for level completion

## 🛠️ Tech Stack

- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **React Navigation** for screen management
- **Expo Haptics** for tactile feedback
- **Linear Gradients** for beautiful backgrounds

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TarunD-code/Number-Puzzle.git
   cd Number-Puzzle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on different platforms**
   ```bash
   # Web
   npx expo start --web
   
   # Android
   npx expo start --android
   
   # iOS
   npx expo start --ios
   ```

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

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting scripts
2. Review the setup documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Made with ❤️ using React Native and Expo**