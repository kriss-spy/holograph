function separate(cy) {
  // Compound layout handles cohort regions itself; this pass separates small flat neighborhoods,
  // including their labels, rather than just spacing portrait centers on a tiny fixed circle.
  if (cy.nodes(":parent").length) return;
  const nodes = cy.nodes().toArray();
  for (let pass = 0; pass < 90; pass++) {
    let moves = 0;
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j],
          ra = a.boundingBox({ includeLabels: true, includeOverlays: false }),
          rb = b.boundingBox({ includeLabels: true, includeOverlays: false });
        const ox = Math.min(ra.x2, rb.x2) - Math.max(ra.x1, rb.x1) + 34,
          oy = Math.min(ra.y2, rb.y2) - Math.max(ra.y1, rb.y1) + 34;
        if (ox <= 0 || oy <= 0) continue;
        const pa = a.position(),
          pb = b.position();
        if (ox < oy) {
          const step = (ox / 2 + 1) * (pa.x <= pb.x ? -1 : 1);
          a.position({ x: pa.x + step, y: pa.y });
          b.position({ x: pb.x - step, y: pb.y });
        } else {
          const step = (oy / 2 + 1) * (pa.y <= pb.y ? -1 : 1);
          a.position({ x: pa.x, y: pa.y + step });
          b.position({ x: pb.x, y: pb.y - step });
        }
        moves++;
      }
    if (!moves) break;
  }
}
function groupedForce(cy) {
  // Arrange compact cohort boxes as whole objects. Pulling individual members across
  // cohorts would otherwise stretch their enclosing regions into huge empty boxes.
  const roots = cy.nodes().filter((n) => !n.parent().length),
    elements = [],
    edges = new Set();
  roots.forEach((n) =>
    elements.push({
      data: { id: n.id(), w: n.outerWidth() + 60, h: n.outerHeight() + 70 },
    }),
  );
  cy.edges().forEach((e) => {
    const root = (n) => (n.parent().length ? n.parent().id() : n.id()),
      a = root(e.source()),
      b = root(e.target());
    if (a === b) return;
    const key = [a, b].sort().join("|");
    if (edges.has(key)) return;
    edges.add(key);
    elements.push({
      data: { id: "layout:" + edges.size, source: a, target: b },
    });
  });
  const graph = new cy.constructor({
    headless: true,
    styleEnabled: true,
    elements,
    style: [
      { selector: "node", style: { width: "data(w)", height: "data(h)" } },
    ],
  });
  graph
    .layout({
      name: "fcose",
      quality: "proof",
      animate: false,
      fit: false,
      randomize: true,
      nodeRepulsion: () => 12000,
      idealEdgeLength: () => 100,
      nodeSeparation: 80,
      numIter: 2500,
      gravity: 0.35,
      tile: true,
      tilingPaddingHorizontal: 80,
      tilingPaddingVertical: 80,
      packComponents: false,
    })
    .run();
  const bounds = graph.nodes().boundingBox();
  if (bounds.h > bounds.w * 1.2 && cy.width() > cy.height()) {
    const rotated = graph
      .nodes()
      .map((n) => ({ n, p: { x: n.position("y"), y: n.position("x") } }));
    rotated.forEach((x) => x.n.position(x.p));
  }
  separate(graph);
  roots.forEach((n) => {
    const q = graph.getElementById(n.id()).position(),
      p = n.position(),
      dx = q.x - p.x,
      dy = q.y - p.y;
    if (n.isParent()) {
      const next = n
        .descendants()
        .filter(":childless")
        .map((c) => ({
          n: c,
          p: { x: c.position("x") + dx, y: c.position("y") + dy },
        }));
      next.forEach((c) => c.n.position(c.p));
    } else n.position(q);
  });
  graph.destroy();
}
function force(cy) {
  if (!cy.nodes().length) return;
  if (cy.nodes(":parent").length === 1) {
    const parent = cy.nodes(":parent")[0],
      record = parent.json(),
      children = parent.children();
    children.move({ parent: null });
    parent.remove();
    force(cy);
    cy.add(record);
    children.move({ parent: record.data.id });
    return;
  }
  if (cy.nodes(":parent").length) {
    groupedForce(cy);
    return;
  }
  cy.layout({
    name: "fcose",
    quality: "proof",
    randomize: true,
    animate: false,
    fit: false,
    padding: 32,
    nodeDimensionsIncludeLabels: true,
    nodeSeparation: 110,
    nodeRepulsion: () => 18000,
    idealEdgeLength: () => 160,
    edgeElasticity: () => 0.25,
    nestingFactor: 0.2,
    numIter: 3000,
    tile: true,
    tilingPaddingVertical: 65,
    tilingPaddingHorizontal: 65,
    gravity: 0.12,
    gravityCompound: 0.6,
    packComponents: false,
  }).run();
  separate(cy);
}
function edgeLabels(cy) {
  const occupied = cy
    .nodes(":childless")
    .map((n) => n.boundingBox({ includeLabels: true, includeOverlays: false }));
  const overlap = (a, b) =>
    Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)) *
    Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
  cy.edges(".duo").forEach((e) => {
    const a = e.source().position(),
      b = e.target().position(),
      dx = b.x - a.x,
      dy = b.y - a.y,
      angle = Math.atan2(dy, dx),
      font = parseFloat(e.style("font-size")) || 14,
      w = e.data("label").length * font * 0.65 + 14,
      h = font + 14,
      rw = Math.abs(Math.cos(angle)) * w + Math.abs(Math.sin(angle)) * h,
      rh = Math.abs(Math.sin(angle)) * w + Math.abs(Math.cos(angle)) * h;
    let best;
    for (const t of [0.5, 0.35, 0.65, 0.25, 0.75])
      for (const side of [-1, 1]) {
        const x = a.x + dx * t - Math.sin(angle) * side * 16,
          y = a.y + dy * t + Math.cos(angle) * side * 16,
          box = {
            x1: x - rw / 2,
            x2: x + rw / 2,
            y1: y - rh / 2,
            y2: y + rh / 2,
          },
          cost =
            occupied.reduce((s, r) => s + overlap(box, r), 0) +
            Math.abs(t - 0.5);
        if (!best || cost < best.cost) best = { box, cost, x, y };
      }
    occupied.push(best.box);
    e.style({
      "text-margin-x": best.x - (a.x + b.x) / 2,
      "text-margin-y": best.y - (a.y + b.y) / 2,
    });
  });
}

export { force, separate, edgeLabels };
