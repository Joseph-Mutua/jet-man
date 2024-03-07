import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GradientBackgroundCanvas from './components/GradientBackground';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GradientBackgroundCanvas />
  </React.StrictMode>
);
