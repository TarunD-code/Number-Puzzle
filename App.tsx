import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GameScreen from './src/screens/GameScreen';
import { LevelsProvider } from './src/state/LevelsContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LevelsProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Game" component={GameScreen} />
            </Stack.Navigator>
            <StatusBar style="light" />
          </SafeAreaView>
        </View>
      </NavigationContainer>
    </LevelsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
