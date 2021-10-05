import React from 'react';
import { I18nManager } from 'react-native';
import Board from './componnents/Board';
I18nManager.allowRTL(false);
export default function App() {
  return (
    <Board />
  );
}




