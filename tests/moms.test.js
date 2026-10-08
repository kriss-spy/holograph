import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseRoute, selectScope, relationTypeLabel } from '../src/model.js';
const data = JSON.parse(readFileSync(new URL('../data/hololive-relations.json', import.meta.url)));
const moms = data.talents.filter((t) => t.status === 'mom');

test('Moms toggle preserves the default roster and independently filters family guests', () => {
  const normal = selectScope(data, { mode: 'all' });
  const included = selectScope(data, { mode: 'all', includeMoms: true });
  assert.equal(normal.ids.size, 80);
  assert.equal(normal.relations.length, 151);
  assert.equal(included.ids.size, 87);
  assert.equal(included.relations.length, 160);
  for (const mom of moms) {
    assert(!normal.ids.has(mom.id));
    assert(included.ids.has(mom.id));
    const family = included.relations.find((r) => r.type === 'family_mother_daughter' && r.member_ids.includes(mom.id));
    assert(family.member_ids.includes(mom.daughter_id));
    assert.equal(relationTypeLabel(family), 'Mother & daughter');
  }
  const current = selectScope(data, { mode: 'all', includeMoms: true, includeAlumni: false });
  assert(moms.every((m) => current.ids.has(m.id)));
  assert(!current.ids.has('uruha-rushia'));
});

test('Shared mom links and family scopes honor both independent filters', () => {
  const route = parseRoute('#talent=pekomama&moms=1&alumni=0&layout=circle', data);
  assert.equal(route.includeMoms, true);
  assert.equal(route.includeAlumni, false);
  assert.equal(route.selected.id, 'pekomama');
  assert.equal(parseRoute('#talent=pekomama', data).selected, null);
  assert.equal(parseRoute('#unit=pekomama_family', data).selected, null);
  assert.equal(parseRoute('#all&moms=garbage', data).includeMoms, false);
  const family = selectScope(data, { mode: 'unit', viewId: 'pekomama_family', includeMoms: true });
  assert.deepEqual([...family.ids].sort(), ['pekomama', 'usada-pekora']);
  assert.equal(family.relations.length, 1);
  assert.equal(selectScope(data, { mode: 'unit', viewId: 'pekomama_family' }).relations.length, 0);
  assert.equal(selectScope(data, { mode: 'unit', viewId: 'pekomama_family' }).ids.size, 0);
  assert.equal(selectScope(data, { mode: 'cohort', viewId: 'hololive-moms' }).ids.size, 0);
  assert.equal(selectScope(data, { mode: 'cohort', viewId: 'hololive-moms', includeMoms: true }).ids.size, 7);
});

test('AZKi shows Vivi only when their shared anniversary event is visible', () => {
  const normal = selectScope(data, { mode: 'person', viewId: 'azki' });
  assert(normal.ids.has('azki'));
  assert(!normal.ids.has('kikirara-vivi'));
  assert(!normal.relations.some((r) => r.id === 'pekomama_anniversary_2025'));
  // Other guests keep their independently documented AZKi connections.
  assert(normal.ids.has('usada-pekora'));
  assert(normal.ids.has('tokino-sora'));

  const included = selectScope(data, { mode: 'person', viewId: 'azki', includeMoms: true });
  assert(included.ids.has('kikirara-vivi'));
  assert(included.relations.some((r) => r.id === 'pekomama_anniversary_2025'));
});

test('Talent and unit views do not retain portraits from filtered-out connections', () => {
  for (const includeMoms of [false, true]) {
    for (const includeAlumni of [false, true]) {
      const filters = { includeMoms, includeAlumni };
      for (const talent of data.talents) {
        const scope = selectScope(data, { mode: 'person', viewId: talent.id, ...filters });
        if ((!includeMoms && talent.status === 'mom') ||
            (!includeAlumni && ['alum', 'former'].includes(talent.status))) {
          assert.equal(scope.ids.size, 0, `Hidden talent ${talent.id} has portraits`);
          assert.equal(scope.relations.length, 0, `Hidden talent ${talent.id} has connections`);
        } else {
          assert(scope.ids.has(talent.id));
          for (const id of scope.ids) {
            assert(id === talent.id || scope.relations.some((r) => r.member_ids.includes(id)),
              `${id} has no visible connection in ${talent.id}'s view`);
          }
        }
      }
      for (const relation of data.relationships) {
        const scope = selectScope(data, { mode: 'unit', viewId: relation.id, ...filters });
        for (const id of scope.ids) {
          assert(scope.relations.some((r) => r.member_ids.includes(id)),
            `${id} remains in filtered unit ${relation.id}`);
        }
      }
    }
  }
});

test('Guest streams keep complete lineups and never create pairwise friendships', () => {
  const event = data.relationships.find((r) => r.id === 'pekomama_anniversary_2025');
  assert.equal(event.member_ids.length, 8);
  assert.equal(relationTypeLabel(event), 'Dated family guest collaboration');
  const edges = data.render_edges.filter((e) => e.relation_id === event.id);
  assert.equal(edges.length, 8);
  assert(edges.every((e) => e.target === `unit:${event.id}`));
  assert.equal(selectScope(data, { mode: 'person', viewId: 'usada-pekora' }).relations.some((r) => r.id === event.id), false);
  assert(selectScope(data, { mode: 'person', viewId: 'pekomama', includeMoms: true }).ids.has('houshou-marine'));
});
