import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { runSentinelSelfCheck } from './services/verificationRunner'

// Execute Subsystem Diagnostic Self-Check
runSentinelSelfCheck();

// Register Service Worker for offline-first PWA resilience
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => {
        console.log('[KAAVALU Sentinel] Service Worker registered with scope:', reg.scope);
      },
      (err) => {
        console.warn('[KAAVALU Sentinel] Service Worker registration failed:', err);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
