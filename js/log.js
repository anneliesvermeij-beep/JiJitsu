// js/log.js - Trainingslogboek via localStorage

const STORAGE_KEY = 'jijitsu_log';
const SESSIONS_KEY = 'jijitsu_sessions';
const PROGRESS_KEY = 'jijitsu_progress';

export const NIVEAUS = ['beginner', 'gevorderd', 'beheerst'];
export const NIVEAU_LABELS = { beginner: 'Beginner', gevorderd: 'Gevorderd', beheerst: 'Beheerst' };
export const NIVEAU_ICONS  = { beginner: '🟡', gevorderd: '🟠', beheerst: '🟢' };

// ─── Backwards-compatible: per-techniek aantekening ─────────────────────────
// (bestaande functies ongewijzigd zodat je huidige code blijft werken)

export function getLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveNote(techniqueName, note) {
  const log = getLog();
  log[techniqueName] = {
    note,
    date: new Date().toLocaleDateString('nl-NL'),
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export function getNote(techniqueName) {
  return getLog()[techniqueName] || null;
}

// ─── Voortgang per techniek ──────────────────────────────────────────────────

export function saveProgress(techniqueName, niveau) {
  const data = loadAllProgress();
  data[techniqueName] = niveau;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function getProgress(techniqueName) {
  return loadAllProgress()[techniqueName] || null;
}

export function loadAllProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

// ─── Trainingssessies ────────────────────────────────────────────────────────
// Sessie: { id, datum, gym?, duration?, note?, sparring?, technieken: [{naam, aantekening, niveau}] }

export function saveSession(datum, technieken, extra = {}) {
  const sessies = loadAllSessions();
  const sessie = {
    id: Date.now().toString(),
    datum,
    ...(extra.gym      && { gym: extra.gym }),
    ...(extra.duration && { duration: parseInt(extra.duration) }),
    ...(extra.note     && { note: extra.note }),
    ...(extra.sparring?.mood && { sparring: extra.sparring }),
    technieken: technieken.filter(t => t.naam),
  };
  sessies.push(sessie);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessies));

  sessie.technieken.forEach(t => {
    if (t.niveau)           saveProgress(t.naam, t.niveau);
    if (t.aantekening?.trim()) saveNote(t.naam, t.aantekening);
  });

  return sessie;
}

export function loadAllSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function loadSessionsSortedByDate() {
  return loadAllSessions().sort((a, b) => b.datum.localeCompare(a.datum));
}

export function deleteSession(id) {
  const sessies = loadAllSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessies));
}

export function getSessionsForTechnique(naam) {
  return loadSessionsSortedByDate()
    .map(s => {
      const t = s.technieken.find(t => t.naam === naam);
      return t ? { datum: s.datum, ...t } : null;
    })
    .filter(Boolean);
}

// ─── Statistieken ────────────────────────────────────────────────────────────

export function getStats() {
  const sessies = loadAllSessions();
  const voortgang = loadAllProgress();
  const uniek = new Set(sessies.flatMap(s => s.technieken.map(t => t.naam)));
  const verdeling = { beginner: 0, gevorderd: 0, beheerst: 0 };
  Object.values(voortgang).forEach(n => { if (verdeling[n] !== undefined) verdeling[n]++; });
  return { totaalSessies: sessies.length, uniekteTechnieken: uniek.size, verdeling };
}
