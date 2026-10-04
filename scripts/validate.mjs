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
for (const field of ["talents", "cohorts", "relationships", "sources"]) {
  sets[field] = new Set(data[field].map((x) => x.id));
  assert.equal(
    sets[field].size,
    data[field].length,
    `Duplicate IDs in ${field}`,
  );
  assert(
    data[field].every((x) => /^[a-zA-Z0-9_-]+$/.test(x.id)),
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
  assert(["listed", "alum", "affiliate"].includes(t.status));
  sourceIds(t.source_ids);
  https(t.official_profile);
  https(t.portrait_url);
  await access(new URL(`../public/assets/${t.id}.png`, import.meta.url));
}
for (const r of data.relationships) {
  assert(
    r.member_ids.length >= 2 &&
      new Set(r.member_ids).size === r.member_ids.length,
  );
  assert(
    r.member_ids.every((id) => sets.talents.has(id)),
    `Unknown member in ${r.id}`,
  );
  assert(
    r.claim && r.time_scope && r.source_ids.length && r.sources.length,
    `Missing evidence in ${r.id}`,
  );
  sourceIds(r.source_ids);
  r.sources.forEach((s) => https(s.url));
}
for (const m of data.cohort_memberships)
  assert(sets.talents.has(m.talent_id) && sets.cohorts.has(m.cohort_id));
data.sources.forEach((s) => https(s.url));
console.log(
  `Validated ${data.talents.length} talents, ${data.relationships.length} ties, ${data.sources.length} sources and every local portrait.`,
);
