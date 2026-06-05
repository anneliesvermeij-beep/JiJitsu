// js/log.js - Trainingslogboek via localStorage

const STORAGE_KEY = 'jijitsu_log';

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