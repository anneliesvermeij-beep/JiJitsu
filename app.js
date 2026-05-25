// js/app.js - Hoofdapplicatie

import { renderApp } from './ui.js';
import { getState, setState } from './state.js';

export function init() {
  console.log('%c[Jiu-Jitsu App] Initializing professional modular version...', 'color:#666');
  
  const state = getState();
  
  // Apply saved theme
  document.documentElement.setAttribute("data-theme", state.theme);
  
  // Initial render
  renderApp();
  
  console.log('%c[Jiu-Jitsu App] App initialized successfully', 'color:#27ae60');
}

// Error boundary
window.addEventListener('error', (e) => {
  console.error('%c[Jiu-Jitsu App] Runtime error:', 'color:#e74c3c', e.error);
});