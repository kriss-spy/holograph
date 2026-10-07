import { currentTheme } from "./themes.js";
import { graphThemeStyles } from "./graph-theme.js";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import * as AtlasLayout from "./graph-layout.js";
import D from "../data/hololive-relations.json";
import { portraits, portraitDefault } from "./portraits.js";
import { cohortAffiliations, displayCohortId, isHololiveMom, isTalentVisible, isRelationVisible, matchesDirectory, parseRoute, relationTypeLabel, selectScope } from "./model.js";
cytoscape.use(fcose);
const $ = (s) => document.querySelector(s),
  T = new Map(D.talents.map((t) => [t.id, t])),
  G = new Map((D.external_participants || []).map((g) => [g.id, g])),
  R = new Map(D.relationships.map((r) => [r.id, r]));
const shortLabels = {
  micomet: "miComet",
  okakoro: "OkaKoro",
  fubumio: "FubuMio",
  shiraken: "Shiraken",
  orio: "ORIO",
  negiu: "NEGI☆U",
  umisea: "UMISEA",
  startend: "Startend",
  bakatare: "Bakatare",
  holotori: "HOLOTORI",
  holowitches_original: "holoWitches · 2024",
  holowitches_2025: "holoWitches · 2025",
  soraz: "SorAZ",
  fuwamoco: "FUWAMOCO",
  mikkorone: "Mikkorone",
  kanaken: "Kanaken",
  chadcast: "CHADCast",
  baerys: "BaeRyS",
  ccgg: "Autofister / CCGG",
  nerissa_elizabeth: "Bloodraven",
  koyokuro: "KoyoKuro",
  fams: "FAMS",
  okfams: "OKFAMS",
  ayafubumi: "AyaFubuMi",
};
for (const r of D.relationships)
  if (!shortLabels[r.id]) shortLabels[r.id] = r.label.split(" / ")[0];
const colors = [
  "#cfe9f7",
  "#dcd5f1",
  "#f5e2cb",
  "#d4eddf",
  "#f3d8e2",
  "#e8e7c9",
];
const mainCohorts = D.cohorts;
const C = new Map(
  mainCohorts.map((c, i) => [c.id, { ...c, color: colors[i % colors.length] }]),
);
// View identity is independent of the item inspected within that view.
const TOPICS = [
  {
    id: "focus",
    label: "Okayu & Korone",
    description: "A closer look at OkaKoro, GAMERS friends and shared units.",
    selectedUnit: "okakoro",
    positions: {
      "nekomata-okayu": [-160, -100],
      "inugami-korone": [150, -100],
      sakuramiko: [460, -75],
      "shirakami-fubuki": [-330, 180],
      "ookami-mio": [-10, 270],
      "nakiri-ayame": [-330, 480],
      "oozora-subaru": [400, 460],
    },
    relations: ["okakoro", "mikkorone", "fubumio", "fams", "okfams"],
    hubs: { fams: { x: -70, y: 490 }, okfams: { x: 95, y: 130 } },
  },
];
const topicById = new Map(TOPICS.map((t) => [t.id, t]));
let mode = "all",
  viewId = null,
  selected = null,
  directory = "units";
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const img = (t) => "assets/" + (t.portrait_asset || t.id + ".png");
const crop = (t) => portraits[t.id] || portraitDefault;
function avatar(t, extra = "") {
  const c = crop(t);
  return `<span class="avatar ${extra}" aria-hidden="true" style="background-image:url('${img(t)}');background-size:${c.scale}% ${c.scaleY || c.scale}%;background-position:${c.x}% ${c.y}%"></span>`;
}
const visibility = () => ({ includeAlumni: $("#alumni").checked, includeMoms: $("#moms").checked });
const visibleStatus = (t) => isTalentVisible(t, visibility());
const affiliations = (t) => cohortAffiliations(D, t.id);
const affiliationLabel = (m) => m.label + (m.historical ? " (historical)" : "");
const niceType = relationTypeLabel;
const cy = cytoscape({
  container: $("#graph"),
  elements: [],
  layout: { name: "preset" },
  minZoom: 0.025,
  maxZoom: 3,
  wheelSensitivity: 2.5,
  style: graphThemeStyles(currentTheme()),
});
// Updating the stylesheet preserves elements, selection, positions and viewport.
window.addEventListener("themechange", () => {
  cy.style(graphThemeStyles(currentTheme()));
});
function portraitElement(t, position, parent) {
  const secondary = affiliations(t).filter((m) => m.cohort_id !== t.primary_cohort_id);
  const placement = displayCohortId(t, { mode, viewId: $("#cohort").value });
  return {
    data: {
      id: t.id,
      label: t.name_en.replace(" ", "\n") + (mode === "all" && secondary.length ? "\nAlso " + secondary.map(affiliationLabel).join(" · ") : ""),
      color: C.get(placement)?.color || "#cfe9f7",
      image: img(t),
      cropScale: crop(t).scale + "%",
      cropScaleY: (crop(t).scaleY || crop(t).scale) + "%",
      cropX: crop(t).x + "%",
      cropY: crop(t).y + "%",
      ...(parent ? { parent } : {}),
      kind: "talent",
    },
    position,
    classes: "talent " + t.status,
  };
}
function scope() {
  return selectScope(
    D,
    {
      mode,
      viewId: mode === "cohort" ? $("#cohort").value : viewId,
      ...visibility(),
    },
    TOPICS,
  );
}
function draw() {
  $("#notice").hidden = true;
  const { ids, relations } = scope(),
    els = [];
  if (mode === "person" && !ids.has(viewId)) {
    $("#notice").textContent = isHololiveMom(T.get(viewId))
      ? "This mom is hidden. Enable Include Hololive moms to show her connections."
      : "This talent is hidden. Enable Include former members to show their historical record.";
    $("#notice").hidden = false;
  }
  if (mode === "unit" && !isRelationVisible(R.get(viewId), visibility())) {
    $("#notice").textContent = "This connection is hidden. Enable Include Hololive moms to show it.";
    $("#notice").hidden = false;
  }
  if (mode === "cohort" && viewId === "hololive-moms" && !$("#moms").checked) {
    $("#notice").textContent = "Enable Include Hololive moms to explore this group.";
    $("#notice").hidden = false;
  }
  const atlas = mode === "all" || mode === "cohort";
  const layoutChoice = $("#layout").value;
  const useForce =
    layoutChoice === "force" || (layoutChoice === "auto" && mode !== "topic");
  if (atlas) {
    let groupIndex = 0;
    const placement = (t) => displayCohortId(t, { mode, viewId: $("#cohort").value });
    const cohortCount = mainCohorts.filter((c) =>
      D.talents.some((t) => ids.has(t.id) && placement(t) === c.id),
    ).length;
    for (const c of mainCohorts) {
      const members = D.talents.filter(
        (t) => ids.has(t.id) && placement(t) === c.id,
      );
      if (!members.length) continue;
      const gi = groupIndex++,
        angle = (gi / cohortCount) * Math.PI * 2 - Math.PI / 2,
        radius =
          cohortCount === 1
            ? 0
            : Math.max(620, (cohortCount * 620) / (2 * Math.PI)),
        origin =
          layoutChoice === "circle"
            ? { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
            : { x: (gi % 5) * 650, y: Math.floor(gi / 5) * 470 };
      els.push({
        data: {
          id: "cohort:" + c.id,
          label: c.label + (c.type === "historical_cohort" ? " (historical)" : ""),
          color: C.get(c.id).color,
        },
        classes: "cohort",
      });
      members.forEach((t, i) =>
        els.push(
          portraitElement(
            t,
            {
              x: origin.x + (i % 3) * 175,
              y: origin.y + Math.floor(i / 3) * 205,
            },
            "cohort:" + c.id,
          ),
        ),
      );
    }
  } else if (mode === "topic") {
    const pos = topicById.get(viewId).positions;
    [...ids].forEach((id) =>
      els.push(portraitElement(T.get(id), { x: pos[id][0], y: pos[id][1] })),
    );
  } else {
    const n = ids.size;
    [...ids].forEach((id, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2,
        rad = Math.max(280, n * 48);
      els.push(
        portraitElement(T.get(id), {
          x: Math.cos(a) * rad,
          y: Math.sin(a) * rad,
        }),
      );
    });
  }
  const positions = new Map(
    els.filter((e) => e.position).map((e) => [e.data.id, e.position]),
  );
  const custom = mode === "topic" ? topicById.get(viewId).hubs : {};
  relations.forEach((r, i) => {
    const mids = r.member_ids.filter((id) => ids.has(id));
    if (r.member_ids.length === 2 && mids.length === 2) {
      els.push({
        data: {
          id: "edge:" + r.id,
          source: mids[0],
          target: mids[1],
          label: r.type === "family_mother_daughter" ? "Mother & daughter" : shortLabels[r.id],
          labelOffset: i % 2 ? 18 : -18,
          relation: r.id,
        },
        classes: "duo",
      });
    } else {
      const avg = {
        x: mids.reduce((v, id) => v + positions.get(id).x, 0) / mids.length,
        y: mids.reduce((v, id) => v + positions.get(id).y, 0) / mids.length,
      };
      const position =
        mode === "topic"
          ? custom[r.id]
          : mode === "unit"
            ? { x: 0, y: 0 }
            : {
                x: avg.x + Math.cos(i * 2.4) * 100,
                y: avg.y + Math.sin(i * 2.4) * 100,
              };
      els.push({
        data: {
          id: "unit:" + r.id,
          label:
            shortLabels[r.id] +
            (mids.length < r.member_ids.length
              ? "\n" + mids.length + " of " + r.member_ids.length + " shown"
              : ""),
          relation: r.id,
          kind: "unit",
          partial: mids.length < r.member_ids.length,
        },
        position,
        classes: "unit",
      });
      mids.forEach((id) =>
        els.push({
          data: {
            id: "edge:" + r.id + ":" + id,
            source: id,
            target: "unit:" + r.id,
            label: "",
            relation: r.id,
          },
          classes: "membership",
        }),
      );
    }
  });
  cy.elements().remove();
  cy.add(els);
  cy.nodes(".talent").style({
    width: atlas ? 100 : 155,
    height: atlas ? 100 : 155,
    "font-size": atlas ? 14 : 23,
  });
  cy.nodes(".unit").style({
    width: atlas ? 110 : 150,
    height: (node) => node.data("partial") ? (atlas ? 54 : 74) : (atlas ? 36 : 50),
    "font-size": atlas ? 12 : 19,
    "text-max-width": atlas ? 90 : 130,
  });
  // Measure the wrapped label before layout so collision spacing includes its full box.
  cy.nodes(".unit").forEach((node) => {
    const label = node.boundingBox({ includeNodes: false, includeLabels: true, includeOverlays: false });
    node.style("height", Math.max(node.numericStyle("height"), Math.ceil(label.h) + 16));
  });
  cy.edges().style({ "font-size": atlas ? 11 : 20 });
  if (useForce) {
    try {
      AtlasLayout.force(cy);
    } catch (error) {
      console.error("Layout failed", error);
      cy.layout({
        name: "grid",
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 1.6,
        fit: false,
      }).run();
      $("#notice").textContent =
        "The automatic layout could not finish. Showing a grid; try another layout.";
      $("#notice").hidden = false;
    }
  } else if (!atlas && layoutChoice === "circle") {
    cy.layout({
      name: "circle",
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true,
      spacingFactor: 1.6,
      fit: false,
    }).run();
    AtlasLayout.separate(cy);
  } else if (!atlas && layoutChoice === "grid") {
    cy.layout({
      name: "grid",
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true,
      spacingFactor: 1.5,
      fit: false,
    }).run();
  } else {
    AtlasLayout.separate(cy);
  }
  AtlasLayout.edgeLabels(cy);
  cy.fit(undefined, 32);
  const name =
    mode === "topic"
      ? topicById.get(viewId).label
      : mode === "all"
        ? "The full roster"
        : mode === "cohort"
          ? D.cohorts.find((c) => c.id === $("#cohort").value)?.label
          : mode === "person"
            ? T.get(viewId).name_en
            : shortLabels[viewId];
  $("#map-title").textContent = name;
  $("#map-subtitle").textContent =
    mode === "topic"
      ? topicById.get(viewId).description
      : mode === "all"
        ? "Explore recorded connections across cohorts. Try circular or force-directed layout."
        : mode === "cohort"
          ? "Recorded ties involving members here. Shared units may include others."
          : "Selected ties from the research snapshot; dates appear in the source panel.";
  $("#map-count").textContent =
    `${ids.size} ${ids.size === 1 ? "talent" : "talents"} / ${relations.length} recorded ${relations.length === 1 ? "tie" : "ties"}`;
  document.querySelectorAll("[data-topic]").forEach((b) => {
    const active = mode === "topic" && viewId === b.dataset.topic;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active);
  });
  $("#all").classList.toggle("active", mode === "all");
  $("#all").setAttribute("aria-pressed", mode === "all");
  mark();
}
function mark() {
  cy.elements().removeClass("picked");
  if (!selected) return;
  if (selected.kind === "talent")
    cy.getElementById(selected.id).addClass("picked");
  else
    cy.elements()
      .filter((e) => e.data("relation") === selected.id)
      .addClass("picked");
}
function showDetails() {
  const box = $("#inspector");
  if (!selected) {
    box.innerHTML = `<p class="type">${mode === "cohort" ? "Cohort overview" : "Atlas overview"}</p><h2>Explore the connections</h2><p>Select a portrait, unit or connection to read its sources. Choose a topic above for a curated view.</p><h3>In this view</h3><p>${esc($("#map-count").textContent)}</p><p class="coverage-note">This is a researched selection. Zero recorded ties means a coverage gap, not an absence of relationships.</p><h3>Reading the map</h3><p>Pastel regions show cohorts. Solid lines show duos or family ties; dotted lines show unit membership.</p><p>Use the scroll wheel or + / − to zoom toward a portrait. Drag the background to pan.</p>`;
    if (mode === "cohort") {
      const cohort = D.cohorts.find((c) => c.id === $("#cohort").value);
      box.insertAdjacentHTML("beforeend", cohortContext([cohort.id]));
      bindCohortLinks(box);
    }
    return;
  }
  if (selected.kind === "unit") {
    const r = R.get(selected.id);
    box.innerHTML = `<p class="type">${niceType(r)}</p><h2>${esc(shortLabels[r.id])}</h2><div class="members">${r.member_ids
      .map((id) => {
        const t = T.get(id);
        if (!t) {
          const guest = G.get(id);
          return `<span class="member external-guest"><span><a href="${esc(guest.official_profile)}" target="_blank" rel="noopener">${esc(guest.name_en)}</a><small>Guest${guest.agency ? " · " + esc(guest.agency) : ""}</small></span></span>`;
        }
        return `<button class="member" data-person="${id}">${avatar(t)}<span>${esc(t.name_en)}</span></button>`;
      })
      .join(
        "",
      )}</div>${r.member_ids.some((id) => G.has(id)) ? '<p class="coverage-note">The complete lineup includes guests outside the Hololive portrait roster. The graph shows the members in the selected roster.</p>' : ''}<p>${esc(r.claim)}</p>${r.id === "okakoro" ? "<p>Both belong to hololive GAMERS. Fubuki also describes the six members of OKFAMS, including Okayu and Korone, as close friends.</p>" : ""}<h3>When this was documented</h3><p class="time">${esc(r.time_scope)}</p><h3>Evidence</h3><ul class="sources">${r.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a><small>${esc(s.evidence)}</small></li>`).join("")}${r.id === "okakoro" ? '<li><a href="https://hololive.hololivepro.com/en/talents/shirakami-fubuki/" target="_blank" rel="noopener">Fubuki’s official Q&A</a><small>Public description of the six-person OKFAMS friendship group.</small></li>' : ""}</ul><p style="font-size:10px">A documented collaboration is not a measure of personal closeness. Historical records remain visible.</p>`;
  } else {
    const t = T.get(selected.id),
      rs = D.relationships.filter((r) => r.member_ids.includes(t.id) && isRelationVisible(r, visibility())),
      cs = affiliations(t);
    const statusLabel = t.status === "mom" ? "Hololive mom · family guest" : t.status === "listed" ? "Listed talent" : t.status === "alum" ? "Alum" : t.status === "former" ? "Former member · contract terminated" : "Affiliate";
    box.innerHTML = `${avatar(t, "portrait")}<p class="type">Talent</p><h2>${esc(t.name_en)}</h2><p>${esc(t.name_ja)}</p><span class="badge ${t.status}">${statusLabel}</span>${isHololiveMom(t) ? `<p>${esc(t.status_meaning)}</p>` : ""}${t.status === "former" ? `<p>Contract terminated ${esc(t.departure_date)}. This historical record remains available after departure.</p>` : ""}<h3>Cohorts</h3>${cs.map((m) => `<button class="relation-link" data-cohort="${esc(m.cohort_id)}">${esc(affiliationLabel(m))}</button>`).join("")}${cohortContext(cs.map((m) => m.cohort_id))}<h3>Recorded connections</h3>${rs.length ? rs.map((r) => `<button class="relation-link" data-unit="${r.id}">${esc(shortLabels[r.id])}</button>`).join("") : "<p>No named ties have been researched for this talent in this selection. This does not mean they have no connections.</p>"}<h3>Sources</h3>${t.portrait_credit ? `<p class="artwork-credit">${esc(t.portrait_credit)}</p>` : ""}<ul class="sources">${t.source_ids.map((id) => {
      const s = D.sources.find((s) => s.id === id);
      return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`;
    }).join("")}</ul>`;
  }
  box
    .querySelectorAll("[data-person]")
    .forEach((b) => (b.onclick = () => choose("talent", b.dataset.person)));
  box
    .querySelectorAll("[data-unit]")
    .forEach((b) => (b.onclick = () => choose("unit", b.dataset.unit)));
  bindCohortLinks(box);
  mark();
}
function cohortContext(ids) {
  return ids.map((id) => D.cohorts.find((c) => c.id === id)).filter((c) => c.navigation_note).map((c) =>
    `<h3>${esc(c.label)} context</h3><p>${esc(c.navigation_note)}</p>${(c.related_cohort_ids || []).map((id) => `<button class="relation-link" data-cohort="${esc(id)}">Explore ${esc(D.cohorts.find((c) => c.id === id).label)} · related cohort</button>`).join("")}<ul class="sources">${(c.context_source_ids || []).map((id) => {
      const s = D.sources.find((s) => s.id === id);
      return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`;
    }).join("")}</ul>`).join("");
}
function bindCohortLinks(box) {
  box.querySelectorAll("[data-cohort]").forEach((b) => b.onclick = () => chooseCohort(b.dataset.cohort));
}
function chooseCohort(id) {
  mode = id ? "cohort" : "all";
  viewId = id || null;
  selected = null;
  $("#cohort").value = id;
  saveRoute();
  refresh();
}
function renderDirectory() {
  $("#units-tab span").textContent = D.relationships.filter((r) => isRelationVisible(r, visibility())).length;
  const visibleTalents = D.talents.filter(visibleStatus).length;
  $("#people-tab span").textContent = visibleTalents;
  $("#all").textContent = "All " + visibleTalents + " talents";
  $("#clear-search").hidden = !$("#search").value;
  const q = $("#search").value.trim().toLocaleLowerCase();
  let items = directory === "units" ? D.relationships : D.talents;
  items = items.filter((x) => (directory === "units" ? isRelationVisible(x, visibility()) : visibleStatus(x)) && matchesDirectory(x, q, shortLabels[x.id]));
  $("#results").innerHTML =
    items
      .map((x) =>
        directory === "units"
          ? `<button class="result ${selected?.id === x.id ? "active" : ""}" data-unit="${x.id}"><i class="unit-dot ${x.member_ids.length === 2 ? "duo" : ""}"></i><span>${esc(shortLabels[x.id])}<small>${x.member_ids.length} talents${x.type === "media_project_cast" ? " · historical cast" : ""}</small></span></button>`
          : `<button class="result ${selected?.id === x.id ? "active" : ""}" data-person="${x.id}">${avatar(x)}<span>${esc(x.name_en)}<small>${esc(affiliations(x).map(affiliationLabel).join(" · "))}${x.status !== "listed" ? " · " + (x.status === "former" ? "former member" : x.status === "mom" ? "family guest" : x.status) : ""}</small></span></button>`,
      )
      .join("") ||
    '<p class="empty">No matches. Try another name or switch between talents and units.</p>';
  $("#results")
    .querySelectorAll("[data-unit]")
    .forEach((b) => (b.onclick = () => choose("unit", b.dataset.unit)));
  $("#results")
    .querySelectorAll("[data-person]")
    .forEach((b) => (b.onclick = () => choose("talent", b.dataset.person)));
}
function choose(kind, id) {
  selected = { kind, id };
  mode = kind === "unit" ? "unit" : "person";
  viewId = id;
  $("#cohort").value = "";
  saveRoute();
  draw();
  showDetails();
  renderDirectory();
}
for (const c of D.cohorts) {
  const o = document.createElement("option");
  o.value = c.id;
  o.textContent = c.label;
  $("#cohort").append(o);
}
function refresh() {
  draw();
  showDetails();
  renderDirectory();
}
for (const topic of TOPICS) {
  const b = document.createElement("button");
  b.id = topic.id;
  b.dataset.topic = topic.id;
  b.textContent = topic.label;
  b.onclick = () => {
    mode = "topic";
    viewId = topic.id;
    selected = topic.selectedUnit
      ? { kind: "unit", id: topic.selectedUnit }
      : null;
    $("#cohort").value = "";
    saveRoute();
    refresh();
  };
  $("#topics").append(b);
}
$("#all").onclick = () => {
  mode = "all";
  viewId = null;
  selected = null;
  $("#cohort").value = "";
  saveRoute();
  refresh();
};
$("#cohort").onchange = () => {
  chooseCohort($("#cohort").value);
};
$("#alumni").onchange = $("#moms").onchange = () => {
  if (selected?.kind === "talent" && !visibleStatus(T.get(selected.id)))
    selected = null;
  if (selected?.kind === "unit" && !isRelationVisible(R.get(selected.id), visibility()))
    selected = null;
  saveRoute();
  refresh();
};
$("#units-tab").onclick = () => {
  directory = "units";
  $("#units-tab").classList.add("active");
  $("#people-tab").classList.remove("active");
  renderDirectory();
};
$("#people-tab").onclick = () => {
  directory = "people";
  $("#people-tab").classList.add("active");
  $("#units-tab").classList.remove("active");
  renderDirectory();
};
$("#search").oninput = renderDirectory;
$("#clear-search").onclick = () => {
  $("#search").value = "";
  renderDirectory();
  $("#search").focus();
};
$("#search").onkeydown = (e) => {
  if (e.key === "Escape" && $("#search").value) {
    e.stopPropagation();
    $("#clear-search").click();
  }
};
$("#layout").onchange = () => {
  saveRoute();
  draw();
};
$("#fit").onclick = () => cy.fit(undefined, 28);
$("#zoom-in").onclick = () =>
  cy.zoom({
    level: Math.min(3, cy.zoom() * 1.6),
    renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
  });
$("#zoom-out").onclick = () =>
  cy.zoom({
    level: Math.max(0.025, cy.zoom() / 1.6),
    renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
  });
$("#export").onclick = async () => {
  const button = $("#export");
  button.disabled = true;
  button.textContent = "Preparing image…";
  try {
    await Promise.all(
      [...scope().ids].map(
        (id) =>
          new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.src = img(T.get(id));
          }),
      ),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    const a = document.createElement("a");
    a.download =
      "hololive-" +
      (mode === "all"
        ? "atlas"
        : mode === "cohort"
          ? $("#cohort").value
          : viewId) +
      ".png";
    a.href = cy.png({
      bg: currentTheme().colors["map-bg"],
      full: true,
      scale: 2,
      maxWidth: 5000,
      maxHeight: 5000,
    });
    a.click();
  } catch (e) {
    $("#map-subtitle").textContent =
      "Image export failed. Check that portraits have loaded and try again.";
  } finally {
    button.disabled = false;
    button.textContent = "Save map image";
  }
};
cy.on("tap", "node", (event) => {
  const n = event.target;
  if (n.hasClass("talent")) selected = { kind: "talent", id: n.id() };
  else if (n.hasClass("unit"))
    selected = { kind: "unit", id: n.data("relation") };
  else return;
  showDetails();
  renderDirectory();
});
cy.on("tap", "edge", (event) => {
  selected = { kind: "unit", id: event.target.data("relation") };
  showDetails();
  renderDirectory();
});
cy.on("dbltap", "node.talent", (event) => {
  choose("talent", event.target.id());
});
function saveRoute() {
  const key = mode === "person" ? "talent" : mode;
  const head =
    mode === "all"
      ? "all"
      : mode === "topic"
        ? viewId
        : key +
          "=" +
          encodeURIComponent(mode === "cohort" ? $("#cohort").value : viewId);
  const params = new URLSearchParams();
  if ($("#layout").value !== "auto") params.set("layout", $("#layout").value);
  if (!$("#alumni").checked) params.set("alumni", "0");
  if ($("#moms").checked) params.set("moms", "1");
  const hash = "#" + head + (params.size ? "&" + params : "");
  if (location.hash !== hash) history.pushState(null, "", hash);
}
function restoreRoute() {
  const route = parseRoute(location.hash, D, TOPICS);
  mode = route.mode;
  viewId = route.viewId;
  selected = route.selected;
  $("#cohort").value = mode === "cohort" ? viewId : "";
  $("#layout").value = route.layout;
  $("#alumni").checked = route.includeAlumni;
  $("#moms").checked = route.includeMoms;
  refresh();
}
window.addEventListener("hashchange", () => {
  if (location.hash !== "#search") restoreRoute();
});
$(".skip-link").onclick = (event) => {
  event.preventDefault();
  $("#search").focus();
};
cy.on("free", "node", () => AtlasLayout.edgeLabels(cy));
cy.on("zoom", () => {
  $("#zoom-level").textContent = Math.round(cy.zoom() * 100) + "%";
});
const covered = new Set(D.relationships.flatMap((r) => r.member_ids).filter((id) => T.has(id)));
$("#units-tab span").textContent = D.relationships.length;
$("#people-tab span").textContent = D.talents.length;
$("#all").textContent = "All " + D.talents.length + " talents";
$(".coverage p").textContent =
  `Named ties cover ${covered.size} of ${D.talents.length} talents. Missing ties mean incomplete research.`;
const pane = $(".map-pane"),
  inspector = $("#inspector"),
  inspectorHome = inspector.parentNode;
let expanded = false,
  previousOverflow = "";
function setExpanded(value) {
  if (expanded === value) return;
  expanded = value;
  pane.classList.toggle("is-expanded", value);
  $("#fullscreen").textContent = value ? "⤡ Exit fullscreen" : "⛶ Fullscreen";
  $("#fullscreen").setAttribute("aria-pressed", String(value));
  if (value) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pane.append(inspector);
  } else {
    document.body.style.overflow = previousOverflow;
    inspector.classList.remove("details-open");
    $("#fullscreen-details").setAttribute("aria-expanded", "false");
    inspectorHome.append(inspector);
    $("#fullscreen").focus();
  }
  requestAnimationFrame(() => {
    cy.resize();
    cy.fit(undefined, 32);
  });
}
$("#fullscreen").onclick = async () => {
  if (expanded) {
    if (document.fullscreenElement === pane) await document.exitFullscreen();
    setExpanded(false);
  } else {
    setExpanded(true);
    try {
      if (pane.requestFullscreen) await pane.requestFullscreen();
    } catch {
      /* Expanded-page fallback when the embedded browser does not permit native fullscreen. */
    }
  }
};
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement === pane) setExpanded(true);
  else if (expanded) setExpanded(false);
  requestAnimationFrame(() => {
    cy.resize();
    cy.fit(undefined, 32);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && expanded && !document.fullscreenElement) {
    setExpanded(false);
  }
});
$("#fullscreen-details").onclick = () => {
  const open = inspector.classList.toggle("details-open");
  $("#fullscreen-details").setAttribute("aria-expanded", String(open));
};
restoreRoute();
let previousGraphSize = "";
new ResizeObserver((entries) => {
  cy.resize();
  const { width, height } = entries[0].contentRect;
  const size = width + "x" + height;
  if (expanded && size !== previousGraphSize) cy.fit(undefined, 32);
  previousGraphSize = size;
}).observe($("#graph"));
$("#loading").hidden = true;
