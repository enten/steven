import React from 'react';

import { Resume } from './Resume';
import CV from './resume.json';

import './App.css';

export default function App() {
  return (
    <Resume {...CV} />
  );
}

