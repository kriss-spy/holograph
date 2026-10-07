import holodexThemes from "./holodex-themes.js";
import { themeColors } from "./theme-colors.js";

export const THEME_STORAGE_KEY = "holograph-theme";
export const DEFAULT_THEME = "default";
export const themes = [
  { id: "default", name: "Default", mode: "light", background: "#f5fbfe" },
  ...holodexThemes.flatMap(({ name, themes: variants }) =>
    ["light", "dark"].map((mode) => ({
      id: name === "Suisei" && mode === "dark" ? "suisei" : `${name.toLowerCase()}-${mode}`,
      name, mode, ...variants[mode],
    })),
  ),
].map((theme) => ({ ...theme, colors: themeColors(theme) }));

export function themeStylesheet() {
  return themes.map((theme) => {
    const selector = theme.id === DEFAULT_THEME ? ":root" : `:root[data-theme="${theme.id}"]`;
    const properties = Object.entries(theme.colors).map(([key, value]) => `--${key}:${value};`).join("");
    return `${selector}{color-scheme:${theme.mode};${properties}}`;
  }).join("\n") + `
select { color-scheme: inherit; }
select option, select optgroup {
  background-color: var(--surface);
  color: var(--text);
}
select option:checked {
  background-color: var(--selected);
  color: var(--selected-text, var(--text));
}
`;
}

export function resolveTheme(id) {
  return themes.find((theme) => theme.id === id) || themes[0];
}
export function readTheme(storage) {
  try { return resolveTheme(storage.getItem(THEME_STORAGE_KEY)); }
  catch { return resolveTheme(DEFAULT_THEME); }
}
export function currentTheme() {
  return resolveTheme(document.documentElement.dataset.theme);
}
export function applyTheme(id, persist = false) {
  const theme = resolveTheme(id);
  document.documentElement.dataset.theme = theme.id;
  document.documentElement.style.colorScheme = theme.mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.colors["header-bg"] || theme.background);
  const picker = document.querySelector("#theme");
  if (picker) picker.value = theme.id;
  if (persist) {
    try { window.localStorage.setItem(THEME_STORAGE_KEY, theme.id); } catch { /* Still works for this visit. */ }
  }
  window.dispatchEvent(new Event("themechange"));
}
export function initializeTheme() {
  let saved = resolveTheme(DEFAULT_THEME);
  try { saved = readTheme(window.localStorage); } catch { /* Storage may be blocked. */ }
  applyTheme(saved.id);
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) applyTheme(event.newValue);
  });
  document.addEventListener("DOMContentLoaded", () => {
    const picker = document.querySelector("#theme");
    if (!picker) return;
    for (const mode of ["light", "dark"]) {
      const group = document.createElement("optgroup");
      group.label = mode === "light" ? "Light themes" : "Dark themes";
      for (const theme of themes.filter((item) => item.mode === mode)) {
        const option = document.createElement("option");
        option.value = theme.id;
        option.textContent = theme.name;
        group.append(option);
      }
      picker.append(group);
    }
    picker.value = currentTheme().id;
    picker.addEventListener("change", () => applyTheme(picker.value, true));
  }, { once: true });
}
