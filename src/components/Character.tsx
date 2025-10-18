// This file will be resolved to platform-specific implementations (.native/.web).
import React from 'react';

export type CharacterProps = { mood: 'idle' | 'celebrate' | 'sad' | 'combo' | 'surprised' };

const Character: React.FC<CharacterProps> = () => {
  // This is a fallback component that should not be used
  // Platform-specific implementations should be in .native.tsx and .web.tsx
  return null;
};

export default Character;



