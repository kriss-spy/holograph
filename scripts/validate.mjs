import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
const raw = await readFile(
  new URL("../data/hololive-relations.json", import.meta.url),
  "utf8",
);
export const data = JSON.parse(raw);
assert(
  !/\/home\/|obsidian:|file:\/\/|obsidian_path|source_note/.test(raw),
  "Public data contains a private path",
);
const sets = {};
for (const field of ["talents", "external_participants", "cohorts", "relationships", "sources"]) {
  const records = data[field] || [];
  sets[field] = new Set(records.map((x) => x.id));
  assert.equal(
    sets[field].size,
    records.length,
    `Duplicate IDs in ${field}`,
  );
  assert(
    records.every((x) => (field === "external_participants"
      ? /^external:[a-z0-9-]+$/ : /^[a-zA-Z0-9_-]+$/).test(x.id)),
    `Unsafe ID in ${field}`,
  );
}
function sourceIds(ids) {
  assert(
    ids.every((id) => sets.sources.has(id)),
    "Missing source reference",
  );
}
function https(url) {
  assert.equal(new URL(url).protocol, "https:", `Unsafe source URL: ${url}`);
}
for (const t of data.talents) {
  assert(sets.cohorts.has(t.primary_cohort_id));
  assert(["listed", "alum", "former", "affiliate"].includes(t.status));
  if (t.status === "former") {
    assert.equal(t.departure_type, "contract_termination");
    assert(/^\d{4}-\d{2}-\d{2}$/.test(t.departure_date));
    assert(t.status_meaning && t.source_ids.length);
  }
  sourceIds(t.source_ids);
  https(t.official_profile);
  https(t.portrait_url);
  await access(new URL(`../public/assets/${t.id}.png`, import.meta.url));
}
const participants = new Map([...data.talents, ...(data.external_participants || [])]
  .map((participant) => [participant.id, participant]));
for (const guest of data.external_participants || []) {
  assert(guest.name_en && guest.name_ja && guest.source_ids.length,
    `Missing guest context in ${guest.id}`);
  sourceIds(guest.source_ids);
  https(guest.official_profile);
  assert(!sets.talents.has(guest.id), "Guests must not inflate the Hololive portrait roster");
}
for (const r of data.relationships) {
  assert(
    r.member_ids.length >= 2 &&
      new Set(r.member_ids).size === r.member_ids.length,
  );
  assert(
    r.member_ids.every((id) => participants.has(id)),
    `Unknown member in ${r.id}`,
  );
  assert(
    r.claim && r.time_scope && r.source_ids.length && r.sources.length,
    `Missing evidence in ${r.id}`,
  );
  sourceIds(r.source_ids);
  r.sources.forEach((s) => https(s.url));
  assert(
    r.member_ids.every((id, index) =>
      participants.get(id).name_en === r.members[index]),
    `Member names disagree with canonical IDs in ${r.id}`,
  );
  assert(
    r.sources.every((s) => r.source_ids.some((id) =>
      data.sources.find((source) => source.id === id).url === s.url)),
    `Inline evidence lacks a matching source record in ${r.id}`,
  );
}
const expectedEdges = data.relationships.flatMap((r) => {
  const shared = { relation_id: r.id, directed: false, source_ids: r.source_ids };
  return r.member_ids.length === 2
    ? [{ id: r.id, source: r.member_ids[0], target: r.member_ids[1],
        type: r.type, label: r.label, ...shared }]
    : r.member_ids.map((id) => ({ id: `${r.id}--${id}`, source: id,
        target: `unit:${r.id}`, type: "member_of_named_unit", label: r.label, ...shared }));
});
const sortEdges = (edges) => edges.slice().sort((a, b) => a.id.localeCompare(b.id));
assert.deepEqual(sortEdges(data.render_edges), sortEdges(expectedEdges),
  "Derived edges must exactly preserve duo ties and group membership");
for (const m of data.cohort_memberships) {
  assert(sets.talents.has(m.talent_id) && sets.cohorts.has(m.cohort_id));
  sourceIds(m.source_ids);
  if (m.started_on && m.ended_on) assert(m.started_on <= m.ended_on);
}
for (const c of data.cohorts) {
  assert.deepEqual(new Set(c.member_ids), new Set(data.cohort_memberships
    .filter((m) => m.cohort_id === c.id).map((m) => m.talent_id)),
    `Cohort membership disagrees in ${c.id}`);
  assert((c.related_cohort_ids || []).every((id) => sets.cohorts.has(id)));
  sourceIds(c.context_source_ids || []);
}
data.sources.forEach((s) => https(s.url));
console.log(
  `Validated ${data.talents.length} talents, ${data.relationships.length} ties, ${data.sources.length} sources and every local portrait.`,
);
