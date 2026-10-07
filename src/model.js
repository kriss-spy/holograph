/** The legacy alumni route flag includes all departed members. */
export const isFormerTalent = (talent) => ["alum", "former"].includes(talent.status);

/** Explain the evidenced relationship without turning roleplay into a social claim. */
export function relationTypeLabel(relation) {
  const labels = {
    fictional_company_unit: "In-game roleplay company",
    game_origin_unit: "Game-origin collaboration unit",
    gaming_unit: "Named gaming team",
    performance_trio: "Documented performance trio",
    performance_duo: "Documented performance pair",
    music_duo: "Music collaboration duo",
    media_project_cast: "Dated project cast",
    named_friendship_collaboration_group: "Public friendship & collaboration group",
  };
  return labels[relation.type] || (relation.member_ids.length === 2
    ? "Public collaboration duo" : "Named collaboration unit");
}

export function cohortAffiliations(data, talentId) {
  return data.cohort_memberships
    .filter((m) => m.talent_id === talentId)
    .map((m) => ({
      ...m,
      label: data.cohorts.find((c) => c.id === m.cohort_id).label,
      historical: m.type === "historical_cohort" || m.time_scope === "historical" || Boolean(m.ended_on),
    }));
}

/** Display placement never changes membership or creates another talent identity. */
export function displayCohortId(talent, { mode, viewId }) {
  return mode === "cohort" ? viewId : talent.primary_cohort_id;
}

/** Canonical records remain searchable by their documented alternate names. */
export function matchesDirectory(item, query, displayName = "") {
  const names = item.member_ids
    ? [item.label, ...(item.aliases || []), ...item.members]
    : [item.name_en, item.name_ja, ...item.aliases];
  return [displayName, ...names].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}

/** URL state is validated against this research snapshot before it reaches the renderer. */
export function parseRoute(hash, data, topics = []) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const route = {
    mode: "all",
    viewId: null,
    selected: null,
    layout: "auto",
    includeAlumni: params.get("alumni") !== "0",
  };
  if (["auto", "force", "circle", "grid"].includes(params.get("layout")))
    route.layout = params.get("layout");
  for (const [key, collection, mode, kind] of [
    ["unit", data.relationships, "unit", "unit"],
    ["talent", data.talents, "person", "talent"],
    ["cohort", data.cohorts, "cohort", null],
  ]) {
    const id = params.get(key);
    if (collection.some((item) => item.id === id)) {
      Object.assign(route, {
        mode,
        viewId: id,
        selected: kind ? { kind, id } : null,
      });
      if (
        kind === "talent" &&
        !route.includeAlumni &&
        isFormerTalent(data.talents.find((t) => t.id === id))
      )
        route.selected = null;
      return route;
    }
  }
  const topic = topics.find((t) => params.has(t.id));
  if (topic)
    Object.assign(route, {
      mode: "topic",
      viewId: topic.id,
      selected: topic.selectedUnit
        ? { kind: "unit", id: topic.selectedUnit }
        : null,
    });
  return route;
}

/** Unit membership stays a group; filtering never fabricates pairwise friendships. */
export function selectScope(
  data,
  { mode, viewId, includeAlumni = true },
  topics = [],
) {
  let ids, relations;
  if (mode === "topic") {
    const topic = topics.find((t) => t.id === viewId);
    ids = new Set(Object.keys(topic.positions));
    relations = data.relationships.filter((r) =>
      topic.relations.includes(r.id),
    );
  } else if (mode === "unit") {
    relations = data.relationships.filter((r) => r.id === viewId);
    ids = new Set(relations.flatMap((r) => r.member_ids));
  } else if (mode === "person") {
    relations = data.relationships.filter((r) => r.member_ids.includes(viewId));
    ids = new Set([viewId, ...relations.flatMap((r) => r.member_ids)]);
  } else if (mode === "cohort") {
    ids = new Set(
      data.cohort_memberships
        .filter((m) => m.cohort_id === viewId)
        .map((m) => m.talent_id),
    );
    relations = data.relationships;
  } else {
    ids = new Set(data.talents.map((t) => t.id));
    relations = data.relationships;
  }
  const allowed = new Set(
    data.talents
      .filter((t) => includeAlumni || !isFormerTalent(t))
      .map((t) => t.id),
  );
  ids = new Set([...ids].filter((id) => allowed.has(id)));
  relations = relations.filter(
    (r) => r.member_ids.filter((id) => ids.has(id)).length >= 2,
  );
  return { ids, relations };
}
