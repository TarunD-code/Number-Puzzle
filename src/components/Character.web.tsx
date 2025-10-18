import React from 'react';
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
    <div style={{ 
      width: 160, 
      height: 160, 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 80,
    }}>
      <span style={{ fontSize: 80 }}>
        {getEmoji()}
      </span>
    </div>
  );
}


