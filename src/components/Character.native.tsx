import React from 'react';
import { View, Text } from 'react-native';
import type { CharacterProps } from './Character';

export default function Character({ mood }: CharacterProps) {
  const getEmoji = () => {
    switch (mood) {
      case 'celebrate': return '🎉';
      case 'sad': return '😢';
      case 'combo': return '🔥';
      case 'surprised': return '😲';
      default: return '😊';
    }
  };

  return (
    <View style={{ 
      width: 160, 
      height: 160, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 80,
    }}>
      <Text style={{ fontSize: 80 }}>
        {getEmoji()}
      </Text>
    </View>
  );
}


