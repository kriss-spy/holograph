import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { matchesDirectory, selectScope } from '../src/model.js';
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)));
const data = read('../data/hololive-relations.json');
const audit = read('../research/sora-name-audit.json');
test('Sora audit preserves primary-supported complete lineups and explicit uncertainty', () => {
  assert.equal(new Set(audit.candidates.map(c => c.id)).size, audit.candidates.length);
  for (const c of audit.candidates) {
    assert(c.reason && c.time_scope && c.discovery_urls.length, c.id);
    assert.equal(c.ongoing_activity_verified, false, c.id);
    assert(c.member_ids.includes('tokino-sora'), c.id);
    if (c.verification_state !== 'verified') {
      assert.equal(c.canonical_record_id, null, c.id);
      continue;
    }
    const r = data.relationships.find(r => r.id === c.canonical_record_id);
    assert(r, c.id);
    assert.deepEqual(new Set(r.member_ids), new Set(c.member_ids), c.id);
    assert(c.primary_evidence.length, c.id);
    for (const s of c.primary_evidence) {
      assert(s.owner && s.evidence_date && s.inspection && s.supports, c.id);
      assert(r.sources.some(x => x.url === s.url), c.id);
    }
    for (const name of [c.name, ...c.aliases, ...c.reading_aids])
      assert(matchesDirectory(r, name), c.id + ' ' + name);
  }
  const trio = data.relationships.find(r => r.id === 'watanuki-sisters');
  const quartet = data.relationships.find(r => r.id === 'april-fools');
  assert.equal(trio.type, 'media_project_cast');
  assert.equal(trio.member_ids.length, 3);
  assert.equal(quartet.member_ids.length, 4);
  assert(quartet.member_ids.includes('external:mononobe-alice'));
  assert(!trio.member_ids.includes('external:mononobe-alice'));
});
test('Sora history and project snapshots survive former-member filtering without rewriting canonical membership', () => {
  const old = data.relationships.find(r => r.id === 'hoshimatic-2023');
  const newer = data.relationships.find(r => r.id === 'hoshimatic-2026');
  assert.equal(old.member_ids.length, 10);
  assert.equal(newer.member_ids.length, 9);
  assert(old.member_ids.includes('sakamata-chloe'));
  assert(!newer.member_ids.includes('sakamata-chloe'));
  const hidden = selectScope(data, {mode:'person',viewId:'tokino-sora',includeAlumni:false});
  assert(!hidden.ids.has('yozora-mel'));
  assert(hidden.ids.has('sakamata-chloe')); // Affiliate visibility is independent of departed members.
  assert(!hidden.relations.some(r => r.id === 'yozora-no-toki'));
  assert(hidden.relations.some(r => r.id === old.id && r.member_ids.length === 10));
  assert(hidden.relations.some(r => r.id === 'april-fools' && r.member_ids.length === 4));
});
