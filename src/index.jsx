import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import _ReactGA from 'react-ga4';
import App from './App';
import './index.css';

const ReactGA = _ReactGA.default || _ReactGA;
if (import.meta.env.PROD && ReactGA && typeof ReactGA.initialize === 'function') {
  ReactGA.initialize('G-KNYEBYGTV8');
}

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(<App />);
