import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import ReactGA from "react-ga4";
ReactGA.initialize("G-KNYEBYGTV8");

createRoot(document.getElementById('root')).render(<App />);
