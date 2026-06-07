// js/state.js

let state = {
  currentTab: "ground",
  selectedPosition: null,
  logTab: "nieuw",
  logStep: 1,
  wizardData: null,
  theme: localStorage.getItem("theme") || "light"
};

export function getState() {
  return { ...state };
}

export function setState(newState) {
  state = { ...state, ...newState };
  if (newState.theme) {
    localStorage.setItem("theme", newState.theme);
  }
  return getState();
}
