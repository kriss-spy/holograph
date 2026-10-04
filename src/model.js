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
        data.talents.find((t) => t.id === id).status === "alum"
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
      .filter((t) => includeAlumni || t.status !== "alum")
      .map((t) => t.id),
  );
  ids = new Set([...ids].filter((id) => allowed.has(id)));
  relations = relations.filter(
    (r) => r.member_ids.filter((id) => ids.has(id)).length >= 2,
  );
  return { ids, relations };
}
