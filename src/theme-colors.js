export const defaultColors = {
  "text": "#163d55",
  "surface": "#fff",
  "cyan": "#0089ab",
  "line": "#d9e7ed",
  "muted": "#597588",
  "focus": "#ad64c5",
  "hover": "#eef8fc",
  "link": "#007590",
  "brand": "#08a5cb",
  "switch-bg": "#edf8fd",
  "input-line": "#bbcfd8",
  "selected": "#eaf5fa",
  "unit-dot": "#9279b7",
  "duo-dot": "#c37667",
  "body-text": "#415f71",
  "portrait-line": "#d5e9f2",
  "time-line": "#c4b5db",
  "badge": "#edf7fb",
  "former-bg": "#e9edf1",
  "affiliate-bg": "#fff2d6",
  "avatar-bg": "#e3f0f6",
  "duo": "#b95468",
  "unit": "#775aa2",
  "alumni": "#7992a2",
  "affiliate": "#b45309",
  "map-bg": "#f5fbfe",
  "grid-dot": "#b2cfdd60",
  "legend-bg": "#ffffffea",
  "shadow-soft": "#163d5518",
  "shadow-panel": "#163d5520",
  "unit-bg": "#eee7f6",
  "unit-line": "#b7a4ce",
  "edge-line": "#a594bf",
  "edge-text": "#675879",
  "duo-text": "#973c53",
  "overlay": "#00a6cc"
};

function channels(hex) {
  return hex.slice(1).match(/../g).map((value) => parseInt(value, 16));
}
export function mixColors(first, second, weight) {
  const a = channels(first), b = channels(second);
  return "#" + a.map((value, i) => Math.round(value * (1 - weight) + b[i] * weight).toString(16).padStart(2, "0")).join("");
}
function luminance(hex) {
  const rgb = channels(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
export function contrastRatio(first, second) {
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function readable(color, background, minimum = 4.5) {
  const target = contrastRatio("#000000", background) > contrastRatio("#ffffff", background) ? "#000000" : "#ffffff";
  for (let step = 0; step <= 100; step++) {
    const candidate = mixColors(color, target, step / 100);
    if (contrastRatio(candidate, background) >= minimum) return candidate;
  }
  return target;
}
function readableOnSurfaces(color, backgrounds, minimum = 4.5) {
  const weakestContrast = (candidate) => Math.min(...backgrounds.map((background) => contrastRatio(candidate, background)));
  const target = weakestContrast("#000000") > weakestContrast("#ffffff") ? "#000000" : "#ffffff";
  for (let step = 0; step <= 100; step++) {
    const candidate = mixColors(color, target, step / 100);
    if (backgrounds.every((background) => contrastRatio(candidate, background) >= minimum)) return candidate;
  }
  return target;
}
export function themeColors(theme) {
  if (theme.id === "default") return defaultColors;
  const dark = theme.mode === "dark";
  const { background, primary, secondary } = theme;
  const tint = (accent, amount) => mixColors(background, accent, amount);
  // Each region has its own role in the palette, including the canvas itself.
  const page = tint(secondary, dark ? 0.20 : 0.10);
  const surface = mixColors(tint(secondary, dark ? 0.18 : 0.04), primary, dark ? 0.06 : 0.04);
  const header = mixColors(tint(secondary, dark ? 0.25 : 0.10), primary, dark ? 0.18 : 0.28);
  const toolbar = tint(primary, dark ? 0.10 : 0.12);
  const directory = tint(primary, dark ? 0.08 : 0.08);
  const inspector = tint(secondary, dark ? 0.28 : 0.17);
  const footer = tint(secondary, dark ? 0.35 : 0.24);
  const map = mixColors(tint(secondary, dark ? 0.16 : 0.025), primary, dark ? 0.025 : 0.055);
  const selected = mixColors(surface, secondary, dark ? 0.32 : 0.22);
  const hover = mixColors(surface, primary, dark ? 0.12 : 0.15);
  const badge = mixColors(surface, primary, 0.10);
  const former = mixColors(surface, secondary, 0.15);
  const affiliate = mixColors(surface, "#c88732", 0.15);
  const backgrounds = [surface, header, toolbar, directory, inspector, footer, page, map, hover, badge, former, affiliate];
  const text = readableOnSurfaces(dark ? "#e6eef8" : "#163d55", backgrounds, 7);
  const link = readableOnSurfaces(primary, backgrounds);
  const muted = readableOnSurfaces(mixColors(surface, text, 0.65), backgrounds);
  const unit = readable(secondary, map);
  const duo = readable(primary, map);
  const unitBackground = mixColors(surface, secondary, dark ? 0.50 : 0.24);
  return {
    text, surface, cyan: link,
    "page-bg": page, "header-bg": header, "toolbar-bg": toolbar,
    "directory-bg": directory, "inspector-bg": inspector, "footer-bg": footer,
    line: mixColors(surface, secondary, dark ? 0.60 : 0.40), muted,
    focus: readableOnSurfaces(theme.success || primary, backgrounds, 3), link,
    brand: readable(primary, header, 3), hover,
    "switch-bg": mixColors(toolbar, secondary, dark ? 0.25 : 0.16),
    "input-line": readableOnSurfaces(secondary, backgrounds, 3), selected,
    "unit-dot": unit, "duo-dot": duo, "body-text": text,
    "portrait-line": mixColors(surface, primary, 0.50), "time-line": unit,
    badge, "former-bg": former, "affiliate-bg": affiliate,
    "avatar-bg": mixColors(surface, primary, 0.10), duo, unit,
    alumni: readable(secondary, map, 3), affiliate: readable("#c88732", map, 3),
    "map-bg": map, "grid-dot": readable(secondary, map, 3) + (dark ? "28" : "30"),
    "legend-bg": footer + "f2", "shadow-soft": secondary + "24",
    "shadow-panel": mixColors(background, secondary, 0.25) + "80",
    "unit-bg": unitBackground, "unit-line": unit,
    "unit-text": readable(text, unitBackground),
    "edge-line": unit, "edge-text": readable(secondary, map),
    "duo-text": duo, overlay: primary,
    "selected-text": readable(text, selected),
    "selected-muted": readable(muted, selected),
  };
}
