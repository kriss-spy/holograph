import test from "node:test";
import assert from "node:assert/strict";
import cytoscape from "cytoscape";
import { DEFAULT_THEME, readTheme, resolveTheme, THEME_STORAGE_KEY, themes } from "../src/themes.js";
import { contrastRatio } from "../src/theme-colors.js";
import holodexThemes from "../src/holodex-themes.js";
import { graphThemeStyles } from "../src/graph-theme.js";

test("Theme preference defaults to light and handles invalid or blocked storage", () => {
  assert.equal(resolveTheme().id, DEFAULT_THEME);
  assert.equal(resolveTheme("unknown").mode, "light");
  assert.equal(readTheme({ getItem: () => { throw new Error("Blocked"); } }).id, DEFAULT_THEME);
  assert.equal(readTheme({ getItem: (key) => key === THEME_STORAGE_KEY ? "suisei" : null }).mode, "dark");
});

test("Changing graph theme preserves dragged positions, viewport, selection and sizing overrides", () => {
  const cy = cytoscape({
    headless: true, styleEnabled: true,
    style: graphThemeStyles(resolveTheme("default")),
    elements: [
      { data: { id: "a", label: "A", color: "#cfe9f7" }, classes: "picked", position: { x: 20, y: 30 } },
      { data: { id: "b", label: "B", color: "#cfe9f7" }, position: { x: 200, y: 300 } },
      { data: { id: "tie", source: "a", target: "b", label: "Duo", labelOffset: 18 }, classes: "duo" },
    ], layout: { name: "preset" },
  });
  try {
    const portrait = cy.getElementById("a");
    portrait.position({ x: 135, y: -90 });
    portrait.select();
    portrait.style({ width: 92, height: 92, "font-size": 20 });
    cy.zoom(0.7);
    cy.pan({ x: 42, y: 58 });
    const state = { position: portrait.position(), pan: cy.pan(), zoom: cy.zoom() };
    for (const id of ["suisei", "default"]) {
      cy.style(graphThemeStyles(resolveTheme(id)));
      assert.deepEqual(portrait.position(), state.position);
      assert.deepEqual(cy.pan(), state.pan);
      assert.equal(cy.zoom(), state.zoom);
      assert.equal(portrait.selected(), true);
      assert.equal(portrait.hasClass("picked"), true);
      assert.equal(portrait.numericStyle("width"), 92);
      assert.equal(cy.elements().length, 3);
      assert.equal(portrait.style("text-outline-color"), "rgb(" + resolveTheme(id).colors["map-bg"].slice(1).match(/../g).map((hex) => parseInt(hex, 16)).join(",") + ")");
    }
  } finally { cy.destroy(); }
});

test("All upstream palettes have both selectable variants with readable UI and graph labels", () => {
  assert.equal(themes.length, 49);
  assert.equal(new Set(themes.map((theme) => theme.id)).size, themes.length);
  for (const upstream of holodexThemes) {
    for (const mode of ["light", "dark"]) {
      const theme = themes.find((item) => item.name === upstream.name && item.mode === mode);
      assert(theme, `${upstream.name} ${mode} is available`);
      for (const [key, value] of Object.entries(upstream.themes[mode])) assert.equal(theme[key], value);
      const colors = theme.colors;
      for (const key of ["text", "muted", "body-text", "link"]) {
        assert(contrastRatio(colors[key], colors.surface) >= 4.5, `${theme.id} ${key} contrast`);
      }
      assert(contrastRatio(colors["unit-text"] || colors.text, colors["unit-bg"]) >= 4.5, `${theme.id} unit label contrast`);
      assert(contrastRatio(colors["edge-text"], colors["map-bg"]) >= 4.5, `${theme.id} edge label contrast`);
      assert(contrastRatio(colors["duo-text"], colors["map-bg"]) >= 4.5, `${theme.id} duo label contrast`);
      const surfaces = ["page-bg", "header-bg", "toolbar-bg", "directory-bg", "inspector-bg", "footer-bg", "map-bg"];
      for (const surface of surfaces) {
        assert(colors[surface], `${theme.id} defines ${surface}`);
        for (const text of ["text", "muted", "link"]) {
          assert(contrastRatio(colors[text], colors[surface]) >= 4.5, `${theme.id} ${text} on ${surface}`);
        }
      }
      assert.notEqual(colors["header-bg"], colors["map-bg"]);
      assert.notEqual(colors["directory-bg"], colors["inspector-bg"]);
      const graph = graphThemeStyles(theme);
      assert.equal(graph.find((rule) => rule.selector === "node").style["text-outline-color"], colors["map-bg"]);
      assert.equal(graph.find((rule) => rule.selector === "node.unit").style["background-color"], colors["unit-bg"]);
    }
  }
  assert.notEqual(resolveTheme("aqua-dark").colors["unit-bg"], resolveTheme("korone-dark").colors["unit-bg"]);
  assert.notEqual(resolveTheme("aqua-light").colors.link, resolveTheme("korone-light").colors.link);
});
