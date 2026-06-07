// js/ui.js

import { groundPositions, throwsData } from './data.js';
import { getState, setState } from './state.js';
import { getNote, saveNote, getProgress, saveProgress, saveSession,
         loadSessionsSortedByDate, deleteSession, getSessionsForTechnique,
         getStats, NIVEAUS, NIVEAU_LABELS, NIVEAU_ICONS } from './log.js';

function getAllTechnieken() {
  return getAllTechniekMetCategorie().map(t => t.naam);
}

function getAllTechniekMetCategorie() {
  const uit = [];
  groundPositions.forEach(pos =>
    pos.submissions.forEach(sub => uit.push({ naam: sub.name, categorie: pos.name }))
  );
  Object.entries(throwsData).forEach(([cat, worpen]) =>
    worpen.forEach(t => uit.push({ naam: t.name, categorie: cat }))
  );
  return uit;
}

function getYouTubeId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

// ─── Main render ─────────────────────────────────────────────────────────────

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
      <button class="tab ${state.currentTab === 'ground'   ? 'active' : ''}" onclick="window.switchTab('ground')">🥋 Grond</button>
      <button class="tab ${state.currentTab === 'throws'   ? 'active' : ''}" onclick="window.switchTab('throws')">🌀 Worpen</button>
      <button class="tab ${state.currentTab === 'logboek'  ? 'active' : ''}" onclick="window.switchTab('logboek')">📓 Logboek</button>
    </div>
  `;

  if (state.currentTab === "ground") {
    html += renderGroundTab(state);
  } else if (state.currentTab === "throws") {
    html += renderThrowsTab();
  } else if (state.currentTab === "logboek") {
    html += renderLogboekTab(state);
  }

  app.innerHTML = html;
}

// ─── Ground tab ──────────────────────────────────────────────────────────────

function renderGroundTab(state) {
  let html = "";

  if (!state.selectedPosition) {
    // Level 1 — position list
    html += `<h2 class="section-heading">Grondposities</h2><div class="positions-grid">`;
    groundPositions.forEach(pos => {
      html += `
        <div class="position-card pos-card" onclick="window.showPositionDetail('${pos.id}')">
          <img
            class="pos-photo"
            src="${pos.photo}"
            alt="${pos.name}"
            loading="lazy"
            onerror="this.style.display='none'"
          >
          <div class="pos-card-body">
            <h3 class="pos-name">${pos.name}</h3>
            <div class="pos-japanese">${pos.japanese}</div>
            <div class="tips-wrapper">
              <div class="tips-sectie">
                <div class="tips-rol-label tori-label">Tori</div>
                <ul class="tips-list">
                  ${pos.tips.tori.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
              <div class="tips-sectie">
                <div class="tips-rol-label uki-label">Uki</div>
                <ul class="tips-list">
                  ${pos.tips.uki.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  } else {
    // Level 2 — submissions for selected position
    const pos = groundPositions.find(p => p.id === state.selectedPosition);
    html += `
      <button class="back-btn" onclick="window.backToList()">← Terug</button>
      <h2 class="section-heading">
        ${pos.name}
        <span class="pos-japanese-inline">${pos.japanese}</span>
      </h2>
    `;

    pos.submissions.forEach((sub, index) => {
      const saved   = getNote(sub.name);
      const progress = getProgress(sub.name);
      const history  = getSessionsForTechnique(sub.name);
      const videoId  = getYouTubeId(sub.link);

      html += `
        <div class="sub-card">
          ${videoId ? `
            <a href="${sub.link}" target="_blank" class="sub-thumbnail-link">
              <img
                class="sub-thumbnail"
                src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
                alt="${sub.name} tutorial"
                loading="lazy"
              >
            </a>
          ` : ''}
          <div class="sub-card-body">
            <h3 class="sub-name">${sub.name}</h3>

            <div class="tips-wrapper">
              <div class="tips-sectie">
                <div class="tips-rol-label tori-label">Tori</div>
                <ul class="tips-list">
                  ${sub.tips.tori.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
              <div class="tips-sectie">
                <div class="tips-rol-label uki-label">Uki</div>
                <ul class="tips-list">
                  ${sub.tips.uki.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="sub-defense">
              <span class="sub-defense-label">Verdediging:</span> ${sub.defense}
            </div>

            <a href="${sub.link}" target="_blank" class="youtube-link">▶ Bekijk video</a>

            <div class="log-section" style="margin-top:12px;">
              <div class="log-label">📈 Voortgang</div>
              <div class="niveau-knoppen">
                ${NIVEAUS.map(n => `
                  <button
                    class="niveau-btn ${progress === n ? 'actief niveau-' + n : ''}"
                    onclick="window.setProgress('${sub.name}', '${n}', this)"
                    title="${NIVEAU_LABELS[n]}">
                    ${NIVEAU_ICONS[n]} ${NIVEAU_LABELS[n]}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="log-section">
              <div class="log-label">📝 Mijn notities</div>
              <textarea
                id="note-${index}"
                class="log-textarea"
                placeholder="Schrijf hier je notities..."
              >${saved ? saved.note : ''}</textarea>
              <div class="log-footer">
                <span class="log-date">
                  ${saved ? `Opgeslagen: ${saved.date}` : 'Nog geen notities'}
                </span>
                <button class="log-save-btn" onclick="window.saveLog('${sub.name}', ${index})">Opslaan</button>
              </div>
            </div>

            ${history.length > 0 ? `
              <div class="log-section">
                <div class="log-label">🗓 Eerder geoefend</div>
                <ul class="techniek-history">
                  ${history.map(h => `
                    <li>
                      <span class="history-datum">${formatDatum(h.datum)}</span>
                      ${h.niveau ? `<span class="niveau-badge niveau-${h.niveau}">${NIVEAU_ICONS[h.niveau]} ${NIVEAU_LABELS[h.niveau]}</span>` : ''}
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
  }

  return html;
}

// ─── Throws tab ──────────────────────────────────────────────────────────────

function renderThrowsTab() {
  let html = `<h2 class="section-heading">Worpen</h2><div class="positions-grid">`;

  Object.keys(throwsData).forEach(category => {
    throwsData[category].forEach(t => {
      const progress = getProgress(t.name);
      const videoId  = getYouTubeId(t.link);
      html += `
        <div class="worp-kaart">
          ${videoId ? `
            <a href="${t.link}" target="_blank" class="sub-thumbnail-link">
              <img
                class="pos-photo"
                src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
                alt="${t.name}"
                loading="lazy"
                onerror="this.style.display='none'"
              >
            </a>
          ` : ''}
          <div class="pos-card-body">
            <div class="worp-naam-rij">
              <h3 class="pos-name">${t.name}</h3>
              ${progress ? `<span class="niveau-badge niveau-${progress}">${NIVEAU_ICONS[progress]} ${NIVEAU_LABELS[progress]}</span>` : ''}
            </div>
            <div class="pos-japanese">${category}</div>
            <div class="throw-beschrijving">${t.description}</div>
            <div class="throw-kuzushi"><strong>Kuzushi:</strong> ${t.kuzushi}</div>
            <div class="niveau-knoppen" style="margin-top:10px;">
              ${NIVEAUS.map(n => `
                <button
                  class="niveau-btn ${progress === n ? 'actief niveau-' + n : ''}"
                  onclick="window.setProgress('${t.name}', '${n}', this)"
                  title="${NIVEAU_LABELS[n]}">
                  ${NIVEAU_ICONS[n]} ${NIVEAU_LABELS[n]}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    });
  });

  html += `</div>`;
  return html;
}

// ─── Logboek tab (unchanged) ──────────────────────────────────────────────────

function renderLogboekTab(state) {
  const logTab = state.logTab || 'nieuw';

  let html = `
    <div class="logboek-tabs">
      <button class="logboek-tab ${logTab === 'nieuw'     ? 'active' : ''}" onclick="window.switchLogTab('nieuw')">➕ Nieuw loggen</button>
      <button class="logboek-tab ${logTab === 'overzicht' ? 'active' : ''}" onclick="window.switchLogTab('overzicht')">📋 Overzicht</button>
      <button class="logboek-tab ${logTab === 'stats'     ? 'active' : ''}" onclick="window.switchLogTab('stats')">📊 Voortgang</button>
    </div>
  `;

  html += renderTechniekOverzicht();

  if (logTab === 'nieuw')     html += renderNieuwSessieForm();
  if (logTab === 'overzicht') html += renderOverzicht();
  if (logTab === 'stats')     html += renderStats();

  return html;
}

function renderTechniekOverzicht() {
  const catChips = [
    ...groundPositions.map(p => ({ label: p.name, items: p.submissions.map(s => s.name) })),
    ...Object.entries(throwsData).map(([cat, worpen]) => ({ label: cat, items: worpen.map(w => w.name) }))
  ];

  let html = `<div class="techniek-overzicht">
    <div class="overzicht-header">Alle technieken</div>
  `;
  catChips.forEach(({ label, items }) => {
    html += `
      <div class="overzicht-rij">
        <span class="overzicht-cat-naam">${label}</span>
        <span class="overzicht-cat-items">${items.join(' · ')}</span>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function renderNieuwSessieForm() {
  const vandaag = new Date().toISOString().split('T')[0];
  const alleTechnieken = getAllTechniekMetCategorie();
  const categories = ['Alles', ...groundPositions.map(p => p.name), ...Object.keys(throwsData)];

  let html = `
    <div class="sessie-form">
      <h2 class="logboek-titel">Nieuwe trainingssessie</h2>

      <div class="categorie-filter" id="categorie-filter">
        ${categories.map(c => `
          <button class="categorie-filter-btn${c === 'Alles' ? ' actief' : ''}"
                  data-cat="${c}"
                  onclick="window.filterCategorie('${c}')">
            ${c}
          </button>
        `).join('')}
      </div>

      <div class="form-veld">
        <label for="sessie-datum">Datum</label>
        <input type="date" id="sessie-datum" value="${vandaag}" max="${vandaag}">
      </div>

      <div class="form-veld">
        <label for="techniek-zoek">Zoek techniek</label>
        <input type="text" id="techniek-zoek" placeholder="Bijv. armbar, seoi nage..." autocomplete="off" oninput="window.filterTechnieken(this.value)">
      </div>

      <div class="technieken-selectie" id="technieken-selectie">
        ${alleTechnieken.map((t, i) => {
          const progress = getProgress(t.naam);
          return `
            <div class="techniek-log-item" data-naam="${t.naam.toLowerCase()}" data-categorie="${t.categorie}" data-index="${i}">
              <div class="techniek-log-header">
                <span class="techniek-log-naam">${t.naam}</span>
                <select class="niveau-select" id="niveau-${i}">
                  <option value="">— niveau —</option>
                  ${NIVEAUS.map(n => `<option value="${n}" ${progress === n ? 'selected' : ''}>${NIVEAU_ICONS[n]} ${NIVEAU_LABELS[n]}</option>`).join('')}
                </select>
              </div>
              <textarea class="log-aantekening" id="sessie-note-${i}" placeholder="Aantekening (optioneel)..." rows="2"></textarea>
            </div>
          `;
        }).join('')}
      </div>

      <div class="sessie-acties">
        <button class="btn-opslaan" onclick="window.slaSessionOp()">💾 Sessie opslaan</button>
      </div>
      <div id="sessie-feedback" class="sessie-feedback"></div>
    </div>
  `;

  return html;
}

function renderOverzicht() {
  const sessies = loadSessionsSortedByDate();

  if (sessies.length === 0) {
    return `<div class="logboek-leeg"><p>Nog geen sessies gelogd.</p><p>Ga naar <strong>Nieuw loggen</strong> om je eerste les bij te houden.</p></div>`;
  }

  let html = `<h2 class="logboek-titel">Alle trainingen</h2><div class="sessies-grid">`;

  sessies.forEach(sessie => {
    html += `
      <div class="sessie-kaart">
        <div class="sessie-kaart-header">
          <span class="sessie-datum">${formatDatum(sessie.datum)}</span>
          <span class="sessie-techniek-count">${sessie.technieken.length} techniek(en)</span>
          <button class="btn-verwijder-sessie" onclick="window.verwijderSessie('${sessie.id}')" aria-label="Verwijder sessie">🗑️</button>
        </div>
        <ul class="sessie-techniek-lijst">
          ${sessie.technieken.map(t => `
            <li class="sessie-techniek-entry">
              <span class="sessie-techniek-naam">${t.naam}</span>
              ${t.niveau ? `<span class="niveau-badge niveau-${t.niveau}">${NIVEAU_ICONS[t.niveau]} ${NIVEAU_LABELS[t.niveau]}</span>` : ''}
              ${t.aantekening ? `<p class="sessie-aantekening">${escapeHTML(t.aantekening)}</p>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });
  html += `</div>`;

  return html;
}

function renderStats() {
  const stats      = getStats();
  const voortgang  = loadAllProgress();
  const alleTechnieken = getAllTechnieken();

  const metVoortgang = alleTechnieken.filter(n => voortgang[n]);
  const totaal = alleTechnieken.length;

  let html = `
    <h2 class="logboek-titel">Voortgang & Statistieken</h2>

    <div class="stats-samenvatting">
      <div class="stat-kaart">
        <span class="stat-getal">${stats.totaalSessies}</span>
        <span class="stat-label">Trainingen</span>
      </div>
      <div class="stat-kaart">
        <span class="stat-getal">${stats.uniekteTechnieken}</span>
        <span class="stat-label">Geoefend</span>
      </div>
      <div class="stat-kaart">
        <span class="stat-getal">${stats.verdeling.beheerst}</span>
        <span class="stat-label">Beheerst</span>
      </div>
    </div>

    <div class="niveau-balk-wrapper">
      ${NIVEAUS.map(n => `
        <div class="niveau-balk-rij">
          <span class="niveau-balk-label">${NIVEAU_ICONS[n]} ${NIVEAU_LABELS[n]}</span>
          <div class="niveau-balk">
            <div class="niveau-balk-vulling niveau-${n}" style="width:${totaal ? Math.round(stats.verdeling[n]/totaal*100) : 0}%"></div>
          </div>
          <span class="niveau-balk-count">${stats.verdeling[n]}</span>
        </div>
      `).join('')}
    </div>
  `;

  if (metVoortgang.length > 0) {
    html += `<h3 class="stats-subtitel">Technieken met voortgang</h3><div class="voortgang-lijst">`;
    metVoortgang.forEach(naam => {
      const n = voortgang[naam];
      html += `
        <div class="voortgang-item">
          <span class="voortgang-naam">${naam}</span>
          <span class="niveau-badge niveau-${n}">${NIVEAU_ICONS[n]} ${NIVEAU_LABELS[n]}</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  return html;
}

// ─── Window globals ───────────────────────────────────────────────────────────

window.switchTab = function(tab) {
  setState({ currentTab: tab, selectedPosition: null, logTab: 'nieuw' });
  renderApp();
};

window.switchLogTab = function(logTab) {
  setState({ logTab });
  renderApp();
};

window.showPositionDetail = function(id) {
  setState({ selectedPosition: id });
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToList = function() {
  setState({ selectedPosition: null });
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.saveLog = function(name, index) {
  const textarea = document.getElementById(`note-${index}`);
  if (!textarea) return;
  saveNote(name, textarea.value);
  const btn = textarea.parentElement.querySelector('.log-save-btn');
  btn.textContent = '✓ Opgeslagen';
  btn.style.background = 'var(--success)';
  setTimeout(() => { btn.textContent = 'Opslaan'; btn.style.background = ''; }, 2000);
};

window.setProgress = function(naam, niveau, btn) {
  saveProgress(naam, niveau);
  const knoppen = btn.closest('.niveau-knoppen').querySelectorAll('.niveau-btn');
  knoppen.forEach(k => {
    k.className = 'niveau-btn';
    NIVEAUS.forEach(n => { if (k.title === NIVEAU_LABELS[n] && n === niveau) k.classList.add('actief', 'niveau-' + n); });
  });
};

window.filterCategorie = function(cat) {
  document.querySelectorAll('.categorie-filter-btn').forEach(b => {
    b.classList.toggle('actief', b.dataset.cat === cat);
  });
  const search = (document.getElementById('techniek-zoek')?.value || '').toLowerCase();
  document.querySelectorAll('.techniek-log-item').forEach(item => {
    const matchCat    = cat === 'Alles' || item.dataset.categorie === cat;
    const matchSearch = !search || item.dataset.naam.includes(search);
    item.style.display = (matchCat && matchSearch) ? '' : 'none';
  });
};

window.filterTechnieken = function(query) {
  const activeCatBtn = document.querySelector('.categorie-filter-btn.actief');
  const cat   = activeCatBtn?.dataset.cat || 'Alles';
  const search = query.toLowerCase();
  document.querySelectorAll('.techniek-log-item').forEach(item => {
    const matchCat    = cat === 'Alles' || item.dataset.categorie === cat;
    const matchSearch = !search || item.dataset.naam.includes(search);
    item.style.display = (matchCat && matchSearch) ? '' : 'none';
  });
};

window.slaSessionOp = function() {
  const datum = document.getElementById('sessie-datum')?.value;
  const alleTechnieken = getAllTechniekMetCategorie();
  const technieken = [];

  alleTechnieken.forEach((t, i) => {
    const aantekening = document.getElementById(`sessie-note-${i}`)?.value?.trim() || '';
    const niveau      = document.getElementById(`niveau-${i}`)?.value || '';
    if (aantekening || niveau) {
      technieken.push({ naam: t.naam, aantekening, niveau });
    }
  });

  const feedback = document.getElementById('sessie-feedback');

  if (technieken.length === 0) {
    feedback.textContent = '⚠️ Voeg minstens één techniek toe met aantekening of niveau.';
    feedback.className = 'sessie-feedback fout';
    return;
  }

  saveSession(datum, technieken);
  feedback.textContent = `✅ Sessie opgeslagen met ${technieken.length} techniek(en)!`;
  feedback.className = 'sessie-feedback succes';
  setTimeout(() => { setState({ logTab: 'overzicht' }); renderApp(); }, 1200);
};

window.verwijderSessie = function(id) {
  if (confirm('Deze sessie verwijderen?')) {
    deleteSession(id);
    renderApp();
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDatum(iso) {
  const [jaar, maand, dag] = iso.split('-');
  const m = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  return `${parseInt(dag)} ${m[parseInt(maand)-1]} ${jaar}`;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function loadAllProgress() {
  try { return JSON.parse(localStorage.getItem('jijitsu_progress')) || {}; } catch { return {}; }
}
