// js/ui.js - Rendering functies

import { groundPositions, throwsData } from './data.js';

let state = {
  currentTab: "ground",
  selectedPosition: null
};

export function renderApp() {
  const app = document.getElementById("app");
  let html = "";

  // Header
  html += `
    <div class="header">
      <div>
        <h1>Jiu-Jitsu Techniekboek</h1>
        <p style="margin:0; opacity:0.9;">Modular • Grond + Worpen</p>
      </div>
      <button class="theme-btn" onclick="window.toggleTheme()">🌙</button>
    </div>

    <div class="tabs">
      <button class="tab ${state.currentTab === 'ground' ? 'active' : ''}" onclick="window.switchTab('ground')">🥋 Grond Posities</button>
      <button class="tab ${state.currentTab === 'throws' ? 'active' : ''}" onclick="window.switchTab('throws')">🌀 Worpen (4 categorieën)</button>
    </div>
  `;

  // Content
  if (state.currentTab === "ground") {
    if (!state.selectedPosition) {
      html += `<h2>Grond Posities</h2>`;
      groundPositions.forEach(pos => {
        html += `
          <div class="position-card" onclick="window.showPositionDetail('${pos.id}')">
            <div style="color:#666; font-size:13px;">${pos.japanese}</div>
            <h3 style="margin:8px 0;">${pos.name}</h3>
          </div>
        `;
      });
    } else {
      const pos = groundPositions.find(p => p.id === state.selectedPosition);
      html += `
        <button onclick="window.backToList()" style="margin-bottom:20px; padding:8px 16px; background:#666; color:white; border:none; border-radius:6px; cursor:pointer;">← Terug</button>
        <h2>${pos.name}</h2>
      `;
      pos.submissions.forEach((sub, i) => {
        html += `
          <div class="submission">
            <h4 style="margin:0 0 8px; color:#c0392b;">${i+1}. ${sub.name}</h4>
            <div class="defense"><strong>Verdediging:</strong> ${sub.defense}</div>
            <a href="${sub.link}" target="_blank" class="youtube-link">▶ Video voorbeeld</a>
          </div>
        `;
      });
    }
  } else {
    // Worpen tab
    html += `<h2>Worpen (4 categorieën)</h2>`;
    Object.keys(throwsData).forEach(category => {
      html += `<div class="category-title" style="color:#c0392b; border-color:#c0392b;">${category}</div>`;
      throwsData[category].forEach(t => {
        html += `
          <div class="submission">
            <h4 style="margin:0 0 6px;">${t.name}</h4>
            <div style="font-size:14px;">${t.description}</div>
            <div style="font-size:13px; color:#666; margin:6px 0;"><strong>Kuzushi:</strong> ${t.kuzushi}</div>
            <a href="${t.link}" target="_blank" class="youtube-link">▶ Video voorbeeld</a>
          </div>
        `;
      });
    });
  }

  app.innerHTML = html;
}

export function setState(newState) {
  state = { ...state, ...newState };
  renderApp();
}

export function getState() {
  return state;
}