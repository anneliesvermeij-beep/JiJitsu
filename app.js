// js/app.js - Hoofdlogica

import { renderApp, setState, getState } from './ui.js';

let theme = localStorage.getItem("theme") || "light";

export function initApp() {
  document.documentElement.setAttribute("data-theme", theme);
  
  // Maak functies globaal beschikbaar voor onclick
  window.toggleTheme = toggleTheme;
  window.switchTab = switchTab;
  window.showPositionDetail = showPositionDetail;
  window.backToList = backToList;

  renderApp();
}

function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  renderApp();
}

function switchTab(tab) {
  const state = getState();
  setState({ currentTab: tab, selectedPosition: null });
}

function showPositionDetail(id) {
  setState({ selectedPosition: id });
}

function backToList() {
  setState({ selectedPosition: null });
}