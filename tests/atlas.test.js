import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { cohortAffiliations, displayCohortId, isFormerTalent, matchesDirectory, parseRoute, relationTypeLabel, selectScope } from "../src/model.js";
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
  assert.equal(first.ids.size, 5);
  assert(first.relations.some((r) => r.id === "natsuiro_fubuki"));
  assert.equal(third.ids.size, 5);
  for (const id of ["noeflare", "pekomari", "mariflare", "noemari", "noepeko", "pekoflare", "shiraken", "mvp"])
    assert(third.relations.some((r) => r.id === id));
  assert.equal(
    third.relations.find((r) => r.id === "shiraken").member_ids.length,
    5,
  );
  assert.equal(third.relations.find((r) => r.id === "mvp").member_ids.length, 3);
});
test("Alumni filtering removes departed portraits and preserves documented guest units", () => {
  const scope = selectScope(data, { mode: "all", includeAlumni: false });
  assert.equal(
    scope.ids.size,
    data.talents.filter((t) => !isFormerTalent(t) && t.status !== "mom").length,
  );
  assert(
    scope.relations.every(
      (r) => r.member_ids.filter((id) => scope.ids.has(id)).length >=
        (r.member_ids.some((id) => id.startsWith("external:")) ? 1 : 2),
    ),
  );
  assert(
    ![...scope.ids].some(
      (id) => isFormerTalent(data.talents.find((t) => t.id === id)),
    ),
  );
});
test("Terminated contracts remain historical records and use the former-member filter", () => {
  for (const [id, cohort, end] of [["yozora-mel", "gen-1", "2024-01-16"], ["uruha-rushia", "gen-3", "2022-02-24"]]) {
    const talent = data.talents.find((t) => t.id === id);
    assert.equal(talent.status, "former");
    assert.equal(talent.departure_type, "contract_termination");
    assert.equal(talent.departure_date, end);
    const membership = cohortAffiliations(data, id)[0];
    assert.equal(membership.cohort_id, cohort);
    assert.equal(membership.ended_on, end);
    assert(membership.historical);
    assert(selectScope(data, { mode: "cohort", viewId: cohort }).ids.has(id));
    assert(!selectScope(data, { mode: "cohort", viewId: cohort, includeAlumni: false }).ids.has(id));
    assert.equal(parseRoute(`#talent=${id}&alumni=0`, data).selected, null);
    assert.equal(parseRoute(`#talent=${id}`, data).selected.id, id);
    assert(data.render_edges.filter((e) => e.source === id || e.target === id)
      .every((e) => data.relationships.some((r) => r.id === e.relation_id && r.member_ids.includes(id))),
    "Historical talent edges must come from evidenced collaborations");
  }
});
test("Fubuki overlaps two cohort filters with one canonical identity", () => {
  const fubuki = data.talents.find((t) => t.id === "shirakami-fubuki");
  assert.deepEqual(cohortAffiliations(data, fubuki.id).map((m) => m.cohort_id), ["gen-1", "gamers"]);
  for (const cohort of ["gen-1", "gamers"]) {
    const scope = selectScope(data, { mode: "cohort", viewId: cohort });
    assert(scope.ids.has(fubuki.id));
    assert.equal(displayCohortId(fubuki, { mode: "cohort", viewId: cohort }), cohort);
    assert.equal(new Set(scope.relations.map((r) => r.id)).size, scope.relations.length);
  }
  assert.equal(displayCohortId(fubuki, { mode: "all" }), "gen-1");
  assert.equal(data.talents.filter((t) => t.id === fubuki.id).length, 1);
});
test("Council navigation preserves Sana’s history without Promise membership", () => {
  const council = selectScope(data, { mode: "cohort", viewId: "council" });
  const promise = selectScope(data, { mode: "cohort", viewId: "promise" });
  assert(council.ids.has("tsukumo-sana"));
  assert(!promise.ids.has("tsukumo-sana"));
  assert.equal([...council.ids].filter((id) => promise.ids.has(id)).length, 4);
  assert.deepEqual(cohortAffiliations(data, "tsukumo-sana").map((m) => m.cohort_id), ["council"]);
  assert(cohortAffiliations(data, "tsukumo-sana")[0].historical);
  assert(!selectScope(data, { mode: "cohort", viewId: "council", includeAlumni: false }).ids.has("tsukumo-sana"));
  assert(data.cohorts.find((c) => c.id === "council").related_cohort_ids.includes("promise"));
  const hope = selectScope(data, { mode: "cohort", viewId: "hope" });
  assert(hope.ids.has("irys"));
  assert.equal(displayCohortId(data.talents.find((t) => t.id === "irys"), { mode: "cohort", viewId: "hope" }), "hope");
});
test("Named collaborations are discoverable by Japanese names and romanizations", () => {
  assert(matchesDirectory(data.relationships.find((r) => r.id === "holowitches_original"), "holoWitches · 2024", "holoWitches · 2024"));
  for (const [id, query] of [
    ["pekovivi", "ぺこヴィヴィ"],
    ["pekoshuba", "PekoSuba"],
    ["festivaluna", "フェスティバルーナ"],
    ["roboaz", "ろぼあず"],
    ["nenenetowawa", "ねねねトワワ"],
    ["oriends", "オレンズ"],
    ["goriponguess-samurai", "Samurai"],
    ["akisuba", "エンジェルヘヴン"],
    ["akisuba", "AkiSuba"],
    ["ccgg", "Autofister"],
    ["nerissa_elizabeth", "Bloodraven"],
    ["octoclock", "Octo'clock"],
    ["azulamy-koro", "クリスマス☆むかえ隊"],
    ["rionazki", "RiONAZKi"],
    ["soaro", "そあろ"],
    ["pizzatimesmith", "PizzaTimeSmith"],
    ["graondstone", "GRAONDSTONE"],
    ["kinpatsu-gumi", "金髪組"],
    ["soazko", "そらあずこよ"],
    ["azukoto", "AzuKoto"],
    ["regloss-anego-gumi", "Anego-gumi"],
  ]) {
    const record = data.relationships.find((r) => r.id === id);
    assert(record, `Missing accepted record ${id}`);
    assert(matchesDirectory(record, ` ${query} `), `Unsearchable name ${query}`);
    assert.equal(parseRoute(`#unit=${id}`, data).selected.id, id);
  }
});
test("Cross-agency units preserve guests without creating a Hololive-only duo", () => {
  const record = data.relationships.find((r) => r.id === "chikumaro");
  const guests = data.external_participants.filter((guest) => record.member_ids.includes(guest.id));
  assert.equal(record.member_ids.length, 4);
  assert.equal(guests.length, 2);
  assert(guests.every((guest) => record.member_ids.includes(guest.id)));
  assert(guests.every((guest) => !data.talents.some((t) => t.id === guest.id)));
  const scope = selectScope(data, { mode: "unit", viewId: "chikumaro" });
  assert.deepEqual([...scope.ids].sort(), ["aki-rosenthal", "yuzuki-choco"]);
  assert.equal(scope.relations[0].member_ids.length, 4);
  const edges = data.render_edges.filter((edge) => edge.relation_id === record.id);
  assert.equal(edges.length, 4);
  assert(edges.every((edge) => edge.type === "member_of_named_unit" && edge.target === "unit:chikumaro"));
  assert.equal(parseRoute("#unit=chikumaro", data).selected.id, "chikumaro");
});
test("External groups remain visible with one portrait and preserve complete source membership", () => {
  for (const [id, total] of [["azukoto", 2], ["azumimizushi", 3], ["shotgunrose", 3]]) {
    const scope = selectScope(data, { mode: "unit", viewId: id });
    assert.deepEqual([...scope.ids], ["azki"]);
    assert.equal(scope.relations.length, 1);
    assert.equal(scope.relations[0].member_ids.length, total);
    assert.equal(scope.relations[0].member_ids.filter((member) => member.startsWith("external:")).length, total - 1);
    assert.equal(parseRoute(`#unit=${id}`, data).selected.id, id);
    assert(selectScope(data, { mode: "person", viewId: "azki" }).relations.some((r) => r.id === id));
  }
});
test("Complete named groups stay distinct from cohorts and expanded lineups", () => {
  const members = (id) => data.relationships.find((r) => r.id === id).member_ids.slice().sort();
  assert.deepEqual(members("fwmcaz"), ["azki", "fuwawa-abyssgard", "mococo-abyssgard"]);
  assert.deepEqual(members("nepolabo"), ["momosuzu-nene", "omaru-polka", "shishiro-botan", "yukihana-lamy"]);
  assert.deepEqual(members("subachocolunatan"), ["himemori-luna", "oozora-subaru", "shishiro-botan", "yuzuki-choco"]);
  assert.deepEqual(members("goriponguess-samurai"), [...members("goriponguess"), "kazama-iroha"].sort());
  assert.deepEqual(members("goriponguess-hime"), [...members("goriponguess"), "himemori-luna"].sort());
  const mvp = selectScope(data, { mode: "unit", viewId: "mvp" });
  assert.equal(mvp.ids.size, 3);
  assert.equal(mvp.relations.length, 1);
  assert.equal(data.render_edges.filter((e) => e.relation_id === "mvp").length, 3);
  assert(data.render_edges.filter((e) => e.relation_id === "mvp").every((e) => e.target === "unit:mvp"));
  const tentative = data.relationships.find((r) => r.id === "regloss-kusogakizu");
  assert.equal(relationTypeLabel(tentative), "Provisional collaboration name");
  assert(matchesDirectory(tentative, "やきいもーず"));
});
test("Historical AZKi duos remain recorded when former members are hidden", () => {
  for (const [relation, talent] of [["aquaz", "minato-aqua"], ["azushio", "murasaki-shion"]]) {
    assert(selectScope(data, { mode: "person", viewId: "azki" }).relations.some((r) => r.id === relation));
    const hidden = selectScope(data, { mode: "person", viewId: "azki", includeAlumni: false });
    assert(!hidden.ids.has(talent));
    assert(!hidden.relations.some((r) => r.id === relation));
    assert(data.relationships.find((r) => r.id === relation).member_ids.includes(talent));
  }
});
test("Wiki additions preserve complete historical lineups and keep naming leads separate", () => {
  const family = data.relationships.find((r) => r.id === "momosuzu-family");
  assert.deepEqual(new Set(family.member_ids), new Set(["sakuramiko", "yozora-mel", "momosuzu-nene"]));
  const filtered = selectScope(data, { mode: "unit", viewId: family.id, includeAlumni: false });
  assert.equal(filtered.ids.size, 2);
  assert.equal(filtered.relations[0].member_ids.length, 3);
  assert.equal(data.render_edges.filter((e) => e.relation_id === family.id).length, 3);
  const dorobou = data.relationships.find((r) => r.id === "dorobou-kensetsu");
  assert.deepEqual(new Set(dorobou.member_ids), new Set(["nekomata-okayu", "takane-lui", "ookami-mio", "shirakami-fubuki", "la-darknesss", "inugami-korone"]));
  assert.equal(relationTypeLabel(dorobou), "In-game roleplay company");
  assert.equal(relationTypeLabel(data.relationships.find((r) => r.id === "kanaken")), "In-game roleplay company");
  assert.equal(relationTypeLabel(data.relationships.find((r) => r.id === "kamichamarose")), "Named gaming team");
  assert.equal(data.render_edges.filter((e) => e.relation_id === dorobou.id).length, 6);
  for (const [id, query] of [["azumion", "あずみぉーん"], ["koyoaz", "こよあず"], ["sakazuki", "さかずき"], ["momosuzu-family", "桃鈴家"], ["dabuchizu", "だぶちーず"], ["radehaji", "らではじ"], ["kanaazukoro", "かなあずころ"]])
    assert(matchesDirectory(data.relationships.find((r) => r.id === id), query));
  for (const [id, unverified] of [["koyoaz", "KoZKi"], ["as-tar", "INNK runaways"]])
    assert(!matchesDirectory(data.relationships.find((r) => r.id === id), unverified));
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
