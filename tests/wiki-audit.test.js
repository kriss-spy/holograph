import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const data = read("../data/hololive-relations.json");
const audit = read("../research/wiki-name-audit.json");

test("Wiki audit keeps uncertainty outside canonical facts and checks complete memberships", () => {
  assert.equal(new Set(audit.candidates.map((c) => c.id)).size, audit.candidates.length);
  const talents = new Set(data.talents.map((t) => t.id));
  const states = new Set(["verified", "needs_primary_name_and_membership", "needs_spoken_name", "needs_explicit_membership", "needs_complete_historical_lineup", "needs_primary_and_external_scope", "verified_external_scope"]);
  for (const c of audit.candidates) {
    assert(c.name && c.romanization_aid && c.classification && c.reason && c.time_scope, c.id);
    assert(states.has(c.verification_state), c.id);
    assert(c.member_ids.length >= 2 && new Set(c.member_ids).size === c.member_ids.length, c.id);
    assert(c.member_ids.every((id) => talents.has(id) || id.startsWith("external:")), c.id);
    assert(c.discovery_urls.length, c.id);
    for (const url of [...c.discovery_urls, ...c.primary_evidence.map((s) => s.url)])
      assert.equal(new URL(url).protocol, "https:");
    assert.equal(c.ongoing_activity_verified, false);
    if (c.verification_state === "verified") {
      const record = data.relationships.find((r) => r.id === c.canonical_record_id);
      assert(record, c.id);
      assert.deepEqual(new Set(c.member_ids), new Set(record.member_ids), c.id);
      assert(c.primary_evidence.length, c.id);
      assert(c.primary_evidence.every((s) => record.sources.some((r) => r.url === s.url)), c.id);
      assert(c.primary_evidence.every((s) => !s.inspection.includes("uninspected")), c.id);
    } else {
      assert.equal(c.canonical_record_id, null, c.id);
    }
  }
  assert.equal(audit.metadata.original_index_inspected, false);
  const external = audit.candidates.find((c) => c.id === "chikumaro");
  assert.equal(external.member_ids.length, 4);
  assert.equal(external.member_ids.filter((id) => id.startsWith("external:")).length, 2);
  assert(!data.relationships.some((r) => r.id === "chikumaro"));
});
