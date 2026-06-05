// js/ui.js - Alle rendering logica

import { groundPositions, throwsData } from './data.js';
import { getState, setState } from './state.js';
import { getNote, saveNote } from './log.js'; 

export function renderApp() {
  const app = document.getElementById("app");
  const state = getState();
  let html = "";

  html += `
    <div class="header">
      <div>
        <h1>Jiu-Jitsu Techniekboek</h1>
        <p>Modulair • Dark Mode</p>
      </div>
      <button class="theme-btn" onclick="window.toggleTheme()">🌙</button>
    </div>
  `;

  html += `
    <div class="tabs">
      <button class="tab ${state.currentTab === 'ground' ? 'active' : ''}" onclick="window.switchTab('ground')">🥋 Grond Posities</button>
      <button class="tab ${state.currentTab === 'throws' ? 'active' : ''}" onclick="window.switchTab('throws')">🌀 Worpen (4 categorieën)</button>
    </div>
  `;

  if (state.currentTab === "ground") {
    if (!state.selectedPosition) {
      html += `<h2>Grond Posities</h2>`;
      groundPositions.forEach(pos => {
        html += `
          <div class="position-card" onclick="window.showPositionDetail('${pos.id}')" style="border-left: 5px solid ${pos.color}">
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
pos.submissions.forEach((sub, index) => {
  const saved = getNote(sub.name);
  html += `
    <div class="submission-card">
      <h3>${index + 1}. ${sub.name}</h3>
      <div style="margin:10px 0; color:var(--muted);">
        <strong>Verdediging:</strong><br>
        ${sub.defense}
      </div>
      <a href="${sub.link}" target="_blank" class="youtube-link">
        ▶ Bekijk video voorbeeld
      </a>

      <div class="log-section">
        <div class="log-label">📝 Mijn aantekeningen</div>
        <textarea
          id="note-${index}"
          class="log-textarea"
          placeholder="Schrijf hier je aantekeningen..."
        >${saved ? saved.note : ''}</textarea>
        <div class="log-footer">
          <span class="log-date">
            ${saved ? `Laatst opgeslagen: ${saved.date}` : 'Nog geen aantekeningen'}
          </span>
          <button
            class="log-save-btn"
            onclick="window.saveLog('${sub.name}', ${index})">
            Opslaan
          </button>
        </div>
      </div>
    </div>
  `;
});
    }
  } else {
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

window.switchTab = function(tab) {
  setState({ currentTab: tab, selectedPosition: null });
  renderApp();
};

window.showPositionDetail = function(id) {
  setState({ selectedPosition: id });
  renderApp();
};

window.backToList = function() {
  setState({ selectedPosition: null });
  renderApp();
};
window.saveLog = function(name, index) {
  const textarea = document.getElementById(`note-${index}`);
  if (!textarea) return;
  saveNote(name, textarea.value);

  // Toon bevestiging
  const btn = textarea.parentElement.querySelector('.log-save-btn');
  btn.textContent = '✓ Opgeslagen';
  btn.style.background = 'var(--success)';
  setTimeout(() => {
    btn.textContent = 'Opslaan';
    btn.style.background = '';
  }, 2000);
};