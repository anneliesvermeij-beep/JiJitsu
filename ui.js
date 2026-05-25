// js/state.js - Centrale state management

let state = {
  currentTab: "ground",
  selectedPosition: null,
  theme: localStorage.getItem("theme") || "light"
};

export function getState() {
  return { ...state };
}

export function setState(newState) {
  state = { ...state, ...newState };
  
  // Sla theme op in localStorage
  if (newState.theme) {
    localStorage.setItem("theme", newState.theme);
  }
  
  return getState();
}

export function resetState() {
  state = {
    currentTab: "ground",
    selectedPosition: null,
    theme: localStorage.getItem("theme") || "light"
  };
  return getState();
}