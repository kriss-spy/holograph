import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { parseRoute, selectScope } from "../src/model.js";
import { force } from "../src/graph-layout.js";
const data = JSON.parse(
  readFileSync(new URL("../data/hololive-relations.json", import.meta.url)),
);
cytoscape.use(fcose);

test("Shared links restore valid filters and reject nonexistent records", () => {
  const r = parseRoute("#talent=nakiri-ayame&layout=circle&alumni=0", data);
  assert.equal(r.mode, "person");
  assert.equal(r.viewId, "nakiri-ayame");
  assert.equal(r.layout, "circle");
  assert.equal(r.includeAlumni, false);
  assert.equal(parseRoute("#unit=missing&layout=missing", data).mode, "all");
  assert.equal(parseRoute("#all", data).selected, null);
  assert.equal(parseRoute("#cohort=gen-3", data).selected, null);
  assert.equal(
    parseRoute("#focus&layout=grid", data, [
      { id: "focus", selectedUnit: "okakoro" },
    ]).selected.id,
    "okakoro",
  );
});
test("Gen 1 and Gen 3 retain evidenced internal ties, including partial units", () => {
  const first = selectScope(data, { mode: "cohort", viewId: "gen-1" });
  const third = selectScope(data, { mode: "cohort", viewId: "gen-3" });
  assert.equal(first.ids.size, 4);
  assert.equal(first.relations.length, 1);
  assert.equal(third.ids.size, 4);
  assert.equal(third.relations.length, 7);
  assert.equal(
    third.relations.find((r) => r.id === "shiraken").member_ids.length,
    5,
  );
});
test("Alumni filtering removes portraits and ties with fewer than two visible members", () => {
  const scope = selectScope(data, { mode: "all", includeAlumni: false });
  assert.equal(
    scope.ids.size,
    data.talents.filter((t) => t.status !== "alum").length,
  );
  assert(
    scope.relations.every(
      (r) => r.member_ids.filter((id) => scope.ids.has(id)).length >= 2,
    ),
  );
  assert(
    ![...scope.ids].some(
      (id) => data.talents.find((t) => t.id === id).status === "alum",
    ),
  );
});
test("Ayame force layout has finite positions and no overlapping portraits or unit boxes", () => {
  const { ids, relations } = selectScope(data, {
    mode: "person",
    viewId: "nakiri-ayame",
  });
  const elements = [...ids].map((id) => ({ data: { id } }));
  for (const r of relations) {
    elements.push({ data: { id: r.id }, classes: "unit" });
    for (const id of r.member_ids)
      elements.push({ data: { id: r.id + id, source: id, target: r.id } });
  }
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    elements,
    style: [
      { selector: "node", style: { width: 155, height: 155 } },
      { selector: ".unit", style: { width: 150, height: 50 } },
    ],
  });
  try {
    force(cy);
    const nodes = cy.nodes().toArray();
    assert.equal(nodes.length, 9);
    for (let i = 0; i < nodes.length; i++) {
      assert(
        Number.isFinite(nodes[i].position("x")) &&
          Number.isFinite(nodes[i].position("y")),
      );
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].boundingBox(),
          b = nodes[j].boundingBox();
        assert(
          !(
            Math.min(a.x2, b.x2) > Math.max(a.x1, b.x1) &&
            Math.min(a.y2, b.y2) > Math.max(a.y1, b.y1)
          ),
        );
      }
    }
  } finally {
    cy.destroy();
  }
});
