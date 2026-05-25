
import { renderApp } from './ui.js';
import { getState, setState } from './state.js';

export function initApp() {
  const state = getState();
  document.documentElement.setAttribute("data-theme", state.theme);
  renderApp();
}

window.toggleTheme = function() {
  const state = getState();
  const newTheme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  setState({ theme: newTheme });
  renderApp();
};
