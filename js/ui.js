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

// ─── Wizard constants ─────────────────────────────────────────────────────────

const WIZARD_POSITIES = [
  { id: 'guard',        label: 'Guard',        icon: '🛡️' },
  { id: 'half-guard',   label: 'Half Guard',   icon: '⚔️' },
  { id: 'side-control', label: 'Side Control', icon: '↔️' },
  { id: 'mount',        label: 'Mount',        icon: '⬆️' },
  { id: 'back-mount',   label: 'Back Mount',   icon: '🔄' },
  { id: 'worpen',       label: 'Worpen',       icon: '🌀' },
];

const SPARRING_MOODS = [
  { id: 'good',    label: 'Goed',   icon: '😊' },
  { id: 'average', label: 'Oké',    icon: '😐' },
  { id: 'bad',     label: 'Zwaar',  icon: '😤' },
];

const SPARRING_TAGS = [
  { id: 'submitted_someone', label: 'Iemand getapt' },
  { id: 'got_submitted',     label: 'Zelf getapt'   },
  { id: 'escaped_well',      label: 'Goed ontsnapt' },
  { id: 'struggled',         label: 'Geworsteld'    },
];

const WIZARD_STAPPEN = 5;

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
    const pos = groundPositions.find(p => p.id === state.selectedPosition);
    html += `
      <button class="back-btn" onclick="window.backToList()">← Terug</button>
      <h2 class="section-heading">
        ${pos.name}
        <span class="pos-japanese-inline">${pos.japanese}</span>
      </h2>
    `;

    pos.submissions.forEach((sub, index) => {
      const saved    = getNote(sub.name);
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
                <div class="log-label">🗓 Eerder geoefend (${history.length}×)</div>
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

// ─── Logboek tab ─────────────────────────────────────────────────────────────

function renderLogboekTab(state) {
  const logTab = state.logTab || 'nieuw';

  let html = `
    <div class="logboek-tabs">
      <button class="logboek-tab ${logTab === 'nieuw'     ? 'active' : ''}" onclick="window.switchLogTab('nieuw')">⚡ Loggen</button>
      <button class="logboek-tab ${logTab === 'overzicht' ? 'active' : ''}" onclick="window.switchLogTab('overzicht')">📋 Overzicht</button>
      <button class="logboek-tab ${logTab === 'stats'     ? 'active' : ''}" onclick="window.switchLogTab('stats')">📊 Voortgang</button>
    </div>
  `;

  if (logTab !== 'nieuw') html += renderTechniekOverzicht();

  if (logTab === 'nieuw')     html += renderLogWizard(state);
  if (logTab === 'overzicht') html += renderOverzicht();
  if (logTab === 'stats')     html += renderStats();

  return html;
}

// ─── Techniek overzicht (reference card) ─────────────────────────────────────

function renderTechniekOverzicht() {
  const catChips = [
    ...groundPositions.map(p => ({ label: p.name, items: p.submissions.map(s => s.name) })),
    ...Object.entries(throwsData).map(([cat, worpen]) => ({ label: cat, items: worpen.map(w => w.name) }))
  ];

  let html = `<div class="techniek-overzicht"><div class="overzicht-header">Alle technieken</div>`;
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

// ─── Log wizard ───────────────────────────────────────────────────────────────

function initWizardData() {
  return {
    datum: new Date().toISOString().split('T')[0],
    gym: '',
    duration: '',
    selectedPositions: [],
    selectedTechnieken: [],
    sparring: { mood: null, tags: [] },
    note: ''
  };
}

function collectWizardStapData(step) {
  const current = getState().wizardData || initWizardData();
  if (step === 1) {
    return {
      ...current,
      datum:    document.getElementById('w-datum')?.value    || current.datum,
      gym:      document.getElementById('w-gym')?.value.trim()   || '',
      duration: document.getElementById('w-duration')?.value || ''
    };
  }
  if (step === 4) {
    return { ...current, note: document.getElementById('w-note')?.value.trim() || '' };
  }
  return current;
}

function getTechniekVoorPositie(positieId) {
  if (positieId === 'worpen') return null; // handled separately
  const pos = groundPositions.find(p => p.id === positieId);
  return pos ? pos.submissions.map(s => s.name) : [];
}

function renderTechniekGroep(label, namen, selected) {
  return `
    <div class="techniek-groep">
      <div class="techniek-groep-header">${label}</div>
      <div class="techniek-checkboxes">
        ${namen.map(naam => `
          <label class="techniek-check ${selected.includes(naam) ? 'geselecteerd' : ''}">
            <input
              type="checkbox"
              class="techniek-checkbox-input"
              data-naam="${naam}"
              ${selected.includes(naam) ? 'checked' : ''}
              onchange="window.wizardToggleTechniek('${naam.replace(/'/g, "\\'")}', this.checked)">
            <span>${naam}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLogWizard(state) {
  const step = state.logStep || 1;
  const data = state.wizardData || initWizardData();

  const dots = Array.from({ length: WIZARD_STAPPEN }, (_, i) => `
    <div class="wizard-dot ${i + 1 === step ? 'actief' : ''} ${i + 1 < step ? 'gedaan' : ''}"></div>
  `).join('');

  let body = '';
  if (step === 1) body = renderWizardStap1(data);
  if (step === 2) body = renderWizardStap2(data);
  if (step === 3) body = renderWizardStap3(data);
  if (step === 4) body = renderWizardStap4(data);
  if (step === 5) body = renderWizardStap5(data);

  return `
    <div class="wizard-container">
      <div class="wizard-progress">${dots}</div>
      ${body}
    </div>
  `;
}

function renderWizardStap1(data) {
  const vandaag = new Date().toISOString().split('T')[0];
  return `
    <h2 class="wizard-titel">Training loggen</h2>
    <div class="wizard-form">
      <div class="form-veld">
        <label for="w-datum">Datum</label>
        <input type="date" id="w-datum" value="${data.datum || vandaag}" max="${vandaag}">
      </div>
      <div class="form-veld">
        <label for="w-gym">Gym <span class="wizard-optioneel">(optioneel)</span></label>
        <input type="text" id="w-gym" placeholder="bijv. Novaforce" value="${data.gym || ''}">
      </div>
      <div class="form-veld">
        <label for="w-duration">Duur in minuten <span class="wizard-optioneel">(optioneel)</span></label>
        <input type="number" id="w-duration" placeholder="90" min="1" max="300" value="${data.duration || ''}">
      </div>
    </div>
    <div class="wizard-acties">
      <button class="wizard-volgende" onclick="window.wizardVolgende(1)">Posities kiezen →</button>
    </div>
  `;
}

function renderWizardStap2(data) {
  return `
    <h2 class="wizard-titel">Welke posities geoefend?</h2>
    <div class="positie-grid">
      ${WIZARD_POSITIES.map(p => `
        <button
          class="positie-knop ${data.selectedPositions.includes(p.id) ? 'geselecteerd' : ''}"
          data-pos="${p.id}"
          onclick="window.wizardTogglePositie('${p.id}')">
          <span class="positie-icon">${p.icon}</span>
          <span class="positie-label">${p.label}</span>
        </button>
      `).join('')}
    </div>
    <div class="wizard-acties">
      <button class="wizard-terug" onclick="window.wizardTerug(2)">← Terug</button>
      <button
        id="wizard-next-btn"
        class="wizard-volgende ${data.selectedPositions.length === 0 ? 'disabled' : ''}"
        ${data.selectedPositions.length === 0 ? 'disabled' : ''}
        onclick="window.wizardVolgende(2)">
        Technieken kiezen →
      </button>
    </div>
  `;
}

function renderWizardStap3(data) {
  let groepen = '';
  let aantalGroepen = 0;

  data.selectedPositions.forEach(posId => {
    const posInfo = WIZARD_POSITIES.find(p => p.id === posId);
    if (posId === 'worpen') {
      Object.entries(throwsData).forEach(([cat, worpen]) => {
        groepen += renderTechniekGroep(cat, worpen.map(w => w.name), data.selectedTechnieken);
        aantalGroepen++;
      });
    } else {
      const namen = getTechniekVoorPositie(posId);
      if (namen && namen.length > 0) {
        groepen += renderTechniekGroep(posInfo.label, namen, data.selectedTechnieken);
        aantalGroepen++;
      }
    }
  });

  return `
    <h2 class="wizard-titel">Welke technieken geoefend?</h2>
    ${aantalGroepen === 0
      ? `<p class="wizard-hint">Geen technieken beschikbaar voor de geselecteerde posities.</p>`
      : groepen
    }
    <div class="wizard-acties">
      <button class="wizard-terug" onclick="window.wizardTerug(3)">← Terug</button>
      <button class="wizard-volgende" onclick="window.wizardVolgende(3)">Sparring feedback →</button>
    </div>
  `;
}

function renderWizardStap4(data) {
  const tags = data.sparring?.tags || [];
  return `
    <h2 class="wizard-titel">Hoe was het sparren?</h2>
    <div class="mood-knoppen">
      ${SPARRING_MOODS.map(m => `
        <button
          class="mood-knop ${data.sparring?.mood === m.id ? 'geselecteerd' : ''}"
          data-mood="${m.id}"
          onclick="window.wizardSetMood('${m.id}')">
          <span class="mood-icon">${m.icon}</span>
          <span class="mood-label">${m.label}</span>
        </button>
      `).join('')}
    </div>
    <div class="tag-knoppen">
      ${SPARRING_TAGS.map(t => `
        <button
          class="tag-knop ${tags.includes(t.id) ? 'geselecteerd' : ''}"
          data-tag="${t.id}"
          onclick="window.wizardToggleTag('${t.id}')">
          ${t.label}
        </button>
      `).join('')}
    </div>
    <div class="form-veld" style="margin-top:1rem;">
      <label for="w-note">Notitie <span class="wizard-optioneel">(optioneel)</span></label>
      <textarea
        id="w-note"
        class="log-textarea"
        placeholder="Wat wil je onthouden van deze training?"
        rows="3"
      >${data.note || ''}</textarea>
    </div>
    <div class="wizard-acties">
      <button class="wizard-terug" onclick="window.wizardTerug(4)">← Terug</button>
      <button class="wizard-opslaan" onclick="window.wizardOpslaan()">💾 Opslaan</button>
    </div>
  `;
}

function renderWizardStap5(data) {
  const mood = SPARRING_MOODS.find(m => m.id === data.sparring?.mood);
  const metaItems = [
    formatDatum(data.datum),
    data.gym      || null,
    data.duration ? data.duration + ' min' : null
  ].filter(Boolean);

  return `
    <div class="wizard-bevestiging">
      <div class="bevestiging-check">✅</div>
      <h2 class="wizard-titel">Training opgeslagen!</h2>
      <p class="bevestiging-meta">${metaItems.join(' · ')}</p>
      ${data.selectedTechnieken.length > 0 ? `<p class="bevestiging-sub">${data.selectedTechnieken.length} techniek(en) gelogd</p>` : ''}
      ${mood ? `<p class="bevestiging-sub">${mood.icon} ${mood.label}</p>` : ''}
      <div class="wizard-acties wizard-acties-center" style="margin-top:1.5rem;">
        <button class="wizard-terug" onclick="window.resetWizard()">➕ Nieuwe training</button>
        <button class="wizard-volgende" onclick="window.switchLogTab('overzicht')">📋 Bekijk overzicht</button>
      </div>
    </div>
  `;
}

// ─── Overzicht ────────────────────────────────────────────────────────────────

function renderOverzicht() {
  const sessies = loadSessionsSortedByDate();

  if (sessies.length === 0) {
    return `<div class="logboek-leeg"><p>Nog geen sessies gelogd.</p><p>Ga naar <strong>⚡ Loggen</strong> om je eerste les bij te houden.</p></div>`;
  }

  let html = `<h2 class="logboek-titel">Alle trainingen</h2><div class="sessies-grid">`;

  sessies.forEach(sessie => {
    const moodIcon = sessie.sparring?.mood
      ? ({ good: '😊', average: '😐', bad: '😤' })[sessie.sparring.mood] || ''
      : '';
    const tags = sessie.sparring?.tags || [];

    html += `
      <div class="sessie-kaart">
        <div class="sessie-kaart-header">
          <span class="sessie-datum">${formatDatum(sessie.datum)}</span>
          ${sessie.gym      ? `<span class="sessie-meta-chip">${sessie.gym}</span>` : ''}
          ${sessie.duration ? `<span class="sessie-meta-chip">${sessie.duration} min</span>` : ''}
          ${moodIcon        ? `<span class="sessie-meta-chip">${moodIcon}</span>` : ''}
          <span class="sessie-techniek-count">${sessie.technieken.length} tech.</span>
          <button class="btn-verwijder-sessie" onclick="window.verwijderSessie('${sessie.id}')" aria-label="Verwijder sessie">🗑️</button>
        </div>
        ${sessie.note ? `<p class="sessie-note">${escapeHTML(sessie.note)}</p>` : ''}
        ${tags.length > 0 ? `
          <div class="sessie-tags">
            ${tags.map(tag => {
              const t = SPARRING_TAGS.find(st => st.id === tag);
              return t ? `<span class="sessie-tag">${t.label}</span>` : '';
            }).join('')}
          </div>
        ` : ''}
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

// ─── Stats ────────────────────────────────────────────────────────────────────

function renderStats() {
  const stats         = getStats();
  const voortgang     = loadAllProgress();
  const alleTechnieken = getAllTechnieken();
  const metVoortgang  = alleTechnieken.filter(n => voortgang[n]);
  const totaal        = alleTechnieken.length;

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
  setState({ currentTab: tab, selectedPosition: null, logTab: 'nieuw', logStep: 1, wizardData: null });
  renderApp();
};

window.switchLogTab = function(logTab) {
  setState({ logTab, logStep: 1, wizardData: null });
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

window.verwijderSessie = function(id) {
  if (confirm('Deze sessie verwijderen?')) {
    deleteSession(id);
    renderApp();
  }
};

// ── Wizard globals ────────────────────────────────────────────────────────────

window.wizardVolgende = function(currentStep) {
  const data = collectWizardStapData(currentStep);
  setState({ logStep: currentStep + 1, wizardData: data });
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.wizardTerug = function(currentStep) {
  const data = collectWizardStapData(currentStep);
  setState({ logStep: currentStep - 1, wizardData: data });
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.wizardTogglePositie = function(id) {
  const s = getState();
  const data = s.wizardData || initWizardData();
  const positions = data.selectedPositions.includes(id)
    ? data.selectedPositions.filter(p => p !== id)
    : [...data.selectedPositions, id];
  setState({ wizardData: { ...data, selectedPositions: positions } });

  document.querySelector(`.positie-knop[data-pos="${id}"]`)
    ?.classList.toggle('geselecteerd', positions.includes(id));

  const nextBtn = document.getElementById('wizard-next-btn');
  if (nextBtn) {
    nextBtn.disabled = positions.length === 0;
    nextBtn.classList.toggle('disabled', positions.length === 0);
  }
};

window.wizardToggleTechniek = function(naam, checked) {
  const s = getState();
  const data = s.wizardData || initWizardData();
  const technieken = checked
    ? [...data.selectedTechnieken, naam]
    : data.selectedTechnieken.filter(t => t !== naam);
  setState({ wizardData: { ...data, selectedTechnieken: technieken } });

  document.querySelector(`input[data-naam="${naam}"]`)
    ?.closest('label')?.classList.toggle('geselecteerd', checked);
};

window.wizardSetMood = function(mood) {
  const s = getState();
  const data = s.wizardData || initWizardData();
  setState({ wizardData: { ...data, sparring: { ...(data.sparring || {}), mood } } });

  document.querySelectorAll('.mood-knop').forEach(b => {
    b.classList.toggle('geselecteerd', b.dataset.mood === mood);
  });
};

window.wizardToggleTag = function(tagId) {
  const s = getState();
  const data = s.wizardData || initWizardData();
  const tags = data.sparring?.tags || [];
  const newTags = tags.includes(tagId) ? tags.filter(t => t !== tagId) : [...tags, tagId];
  setState({ wizardData: { ...data, sparring: { ...(data.sparring || {}), tags: newTags } } });

  document.querySelector(`.tag-knop[data-tag="${tagId}"]`)
    ?.classList.toggle('geselecteerd', newTags.includes(tagId));
};

window.wizardOpslaan = function() {
  const data = collectWizardStapData(4);
  const technieken = data.selectedTechnieken.map(naam => ({ naam, aantekening: '', niveau: '' }));
  const extra = {
    gym:      data.gym,
    duration: data.duration,
    note:     data.note,
    sparring: data.sparring
  };
  saveSession(data.datum, technieken, extra);
  setState({ logStep: 5, wizardData: data });
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.resetWizard = function() {
  setState({ logStep: 1, wizardData: null });
  renderApp();
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
