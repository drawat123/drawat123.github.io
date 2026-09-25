(() => {
  const R = window.RESUME;
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Small element builder; text always goes through textContent.
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c) node.append(c);
    return node;
  }
  function svg(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  }
  const tagList = (tags) => el("div", { class: "tags" }, tags.map((t) => el("span", { class: "tag", "data-tag": t, text: t })));

  const ICONS = {
    mail: "M2 5h20v14H2zM2 6l10 7 10-7",
    linkedin: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z",
    github: "M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z",
  };
  function icon(name, stroke) {
    const s = svg("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" });
    const p = svg("path", { d: ICONS[name] });
    if (stroke) { s.style.fill = "none"; p.setAttribute("stroke", "currentColor"); p.setAttribute("stroke-width", "2"); p.setAttribute("stroke-linejoin", "round"); }
    s.append(p);
    return s;
  }
  function contactButtons() {
    return [
      el("a", { class: "btn primary", href: `mailto:${R.links.email}` }, [icon("mail", true), "Email me"]),
      el("a", { class: "btn", href: R.links.linkedin, target: "_blank", rel: "noopener" }, [icon("linkedin"), "LinkedIn"]),
      el("a", { class: "btn", href: R.links.github, target: "_blank", rel: "noopener" }, [icon("github"), "GitHub"]),
    ];
  }

  // ---------- Hero ----------
  document.title = `${R.name} — Software Engineer`;
  $("#hero-meta").textContent = `${R.title} · ${R.company} · ${R.location}`;
  $("#hero-name").textContent = R.name;
  $("#hero-sub").textContent =
    "Connecting industrial controllers to the cloud — across desktop software, cloud services and device firmware design.";
  $("#hero-cta").append(...contactButtons());
  $("#contact-cta").append(...contactButtons());
  $("#stats").append(...R.stats.map((s) => el("div", {}, [el("dt", { text: s.value }), el("dd", { text: s.label })])));
  $("#summary").textContent = R.summary;
  $("#footer-text").textContent = `© ${new Date().getFullYear()} ${R.name}`;

  // Typing rotator.
  const rot = $("#rotator");
  if (reduceMotion) {
    rot.textContent = R.rotating[0];
  } else {
    let i = 0, n = 0, deleting = false;
    (function tick() {
      const word = R.rotating[i];
      n += deleting ? -1 : 1;
      rot.textContent = word.slice(0, n);
      let delay = deleting ? 35 : 70;
      if (!deleting && n === word.length) { deleting = true; delay = 1800; }
      else if (deleting && n === 0) { deleting = false; i = (i + 1) % R.rotating.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  // ---------- Featured work: interactive flow diagrams ----------
  // A feature has either `nodes` + `flow`, or `modes` (each with its own nodes/flow) shown behind a toggle.
  const NW = 132, NH = 64, PAD = 26;
  const key = (a, b) => [a, b].sort().join("|");

  function buildFeature(f) {
    const modes = f.modes || [{ nodes: f.nodes, flow: f.flow }];
    let mode = modes.find((m) => m.default) || modes[0];
    let pos, edges, nodeEls, packet, current = 0, anim = null, autoTimer = null, userTookOver = false;

    const stage = el("div", { class: "stage" });
    const caption = el("p", { class: "caption", "aria-live": "polite" });
    const dots = el("div", { class: "dots", role: "tablist", "aria-label": "Steps" });
    const prevBtn = el("button", { class: "step-btn", type: "button", text: "← Back" });
    const nextBtn = el("button", { class: "step-btn primary", type: "button", text: "Next step →" });
    const note = el("p", { class: "mode-note" });

    function drawDiagram() {
      pos = Object.fromEntries(mode.nodes.map((n) => [n.id, n]));
      const xs = mode.nodes.map((n) => n.x), ys = mode.nodes.map((n) => n.y);
      const x0 = Math.min(...xs) - NW / 2 - PAD, y0 = Math.min(...ys) - NH / 2 - PAD - (mode.group ? 18 : 0);
      const w = Math.max(...xs) - Math.min(...xs) + NW + PAD * 2, h = Math.max(...ys) + NH / 2 + PAD - y0;
      const d = svg("svg", { class: "diagram", viewBox: `${x0} ${y0} ${w} ${h}`, role: "img", "aria-label": `${f.name} data-flow diagram` });

      if (mode.group) {
        const g = mode.group.nodes.map((id) => pos[id]);
        const gx = Math.min(...g.map((n) => n.x)) - NW / 2 - 12, gy = Math.min(...g.map((n) => n.y)) - NH / 2 - 30;
        const gw = Math.max(...g.map((n) => n.x)) - Math.min(...g.map((n) => n.x)) + NW + 24;
        const gh = Math.max(...g.map((n) => n.y)) - Math.min(...g.map((n) => n.y)) + NH + 42;
        d.append(svg("rect", { class: "group", x: gx, y: gy, width: gw, height: gh, rx: 16 }));
        const gl = svg("text", { class: "group-label", x: gx + 14, y: gy + 19 });
        gl.textContent = mode.group.label;
        d.append(gl);
      }
      // One edge per distinct pair of neighbouring nodes across all steps.
      edges = {};
      for (const step of mode.flow) {
        for (let i = 0; i < step.path.length - 1; i++) {
          const k = key(step.path[i], step.path[i + 1]);
          if (!edges[k]) {
            const [a, b] = k.split("|").map((id) => pos[id]);
            edges[k] = svg("line", { class: "edge", x1: a.x, y1: a.y, x2: b.x, y2: b.y });
            d.append(edges[k]);
          }
        }
      }
      // Added before the nodes so the packet slides underneath them.
      packet = svg("circle", { class: "packet", r: 7, cx: -999, cy: -999 });
      d.append(packet);

      nodeEls = {};
      for (const n of mode.nodes) {
        const g = svg("g", { class: "node" });
        g.append(svg("rect", { x: n.x - NW / 2, y: n.y - NH / 2, width: NW, height: NH, rx: 12 }));
        const label = svg("text", { class: "label", x: n.x, y: n.y - 2, "text-anchor": "middle" });
        label.textContent = n.label;
        const sub = svg("text", { class: "sub", x: n.x, y: n.y + 17, "text-anchor": "middle" });
        sub.textContent = n.sub;
        g.append(label, sub);
        nodeEls[n.id] = g;
        d.append(g);
      }
      stage.replaceChildren(d);

      dots.replaceChildren(...mode.flow.map((_, k) =>
        el("button", { type: "button", role: "tab", "aria-label": `Step ${k + 1}`, onclick: () => { takeOver(); show(k); } })));
      note.textContent = mode.note || "";
      note.hidden = !mode.note;
    }

    function animatePacket(path) {
      cancelAnimationFrame(anim);
      if (reduceMotion) { packet.setAttribute("cx", -999); return; }
      const hop = 650, start = performance.now(), hops = path.length - 1;
      (function frame(now) {
        const t = Math.min((now - start) / hop, hops);
        const i = Math.min(Math.floor(t), hops - 1), local = t - i;
        const a = pos[path[i]], b = pos[path[i + 1]];
        const e = local < .5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
        packet.setAttribute("cx", a.x + (b.x - a.x) * e);
        packet.setAttribute("cy", a.y + (b.y - a.y) * e);
        if (t < hops) anim = requestAnimationFrame(frame);
      })(start);
    }

    function show(i) {
      current = (i + mode.flow.length) % mode.flow.length;
      const step = mode.flow[current];
      Object.values(edges).forEach((e) => e.classList.remove("on"));
      Object.values(nodeEls).forEach((n) => n.classList.remove("on"));
      step.path.forEach((id) => nodeEls[id].classList.add("on"));
      for (let k = 0; k < step.path.length - 1; k++) edges[key(step.path[k], step.path[k + 1])].classList.add("on");
      caption.replaceChildren(el("span", { class: "n", text: `${current + 1}/${mode.flow.length}` }), step.text);
      [...dots.children].forEach((d, k) => { d.classList.toggle("on", k === current); d.setAttribute("aria-selected", k === current); });
      animatePacket(step.path);
    }
    function takeOver() { userTookOver = true; clearInterval(autoTimer); }

    prevBtn.addEventListener("click", () => { takeOver(); show(current - 1); });
    nextBtn.addEventListener("click", () => { takeOver(); show(current + 1); });

    let toggle = null;
    if (modes.length > 1) {
      toggle = el("div", { class: "modes", role: "group", "aria-label": "Compare flows" }, modes.map((m) =>
        el("button", {
          type: "button", class: "mode-btn", "aria-pressed": String(m === mode), text: m.label,
          onclick: (ev) => {
            takeOver();
            mode = m;
            [...toggle.children].forEach((b) => b.setAttribute("aria-pressed", String(b === ev.currentTarget)));
            drawDiagram();
            show(0);
          },
        })));
    }

    const card = el("article", { class: "feature", "data-tags": f.tags.join("|") }, [
      el("div", { class: "feature-head" }, [
        el("div", {}, [el("h3", { text: f.name }), el("p", { class: "feature-role", text: f.role })]),
      ]),
      el("p", { class: "tagline", text: f.tagline }),
      toggle,
      note,
      stage,
      el("div", { class: "flow-controls" }, [prevBtn, nextBtn, dots]),
      caption,
      tagList(f.tags),
    ]);
    drawDiagram();
    show(0);

    // Auto-advance while visible, until the visitor clicks anything.
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        clearInterval(autoTimer);
        if (entry.isIntersecting && !userTookOver) autoTimer = setInterval(() => show(current + 1), 4600);
      }, { threshold: .6 }).observe(card);
    }
    return card;
  }
  $("#featured").append(...R.featured.map(buildFeature));

  $("#projects").append(...R.projects.map((p) =>
    el("article", { class: "card", "data-tags": p.tags.join("|") }, [el("h4", { text: p.name }), el("p", { text: p.text }), tagList(p.tags)])));

  // ---------- Experience timeline ----------
  let roleSeq = 0;
  $("#timeline").append(...R.experience.map((c, ci) =>
    el("li", { class: "company" }, [
      el("h3", { text: c.company }),
      el("p", { class: "place", text: c.place }),
      ...c.roles.map((r, ri) => {
        const id = `role-${roleSeq++}`;
        const open = ci === 0 && ri < 2; // latest roles start expanded
        const chev = svg("svg", { class: "chev", viewBox: "0 0 24 24", "aria-hidden": "true" });
        chev.append(svg("path", { d: "M6 9l6 6 6-6" }));
        const body = el("div", { class: "role-body", id }, [el("ul", {}, r.points.map((p) => el("li", { text: p }))), tagList(r.tags)]);
        body.hidden = !open;
        const toggle = el("button", {
          class: "role-toggle", type: "button", "aria-expanded": String(open), "aria-controls": id,
          onclick: () => { const exp = toggle.getAttribute("aria-expanded") === "true"; toggle.setAttribute("aria-expanded", String(!exp)); body.hidden = exp; },
        }, [el("span", { class: "t", text: r.title }), el("span", { class: "d" }, [r.dates, chev])]);
        return el("div", { class: "role", "data-tags": r.tags.join("|") }, [toggle, body]);
      }),
    ])));

  // ---------- Skills filter ----------
  let active = null;
  const chips = [];
  for (const [group, skills] of Object.entries(R.skills)) {
    $("#skill-groups").append(el("div", { class: "skill-group" }, [
      el("h3", { text: group }),
      el("div", { class: "chips" }, skills.map((s) => {
        const chip = el("button", { class: "chip", type: "button", "aria-pressed": "false", text: s, onclick: () => applyFilter(active === s ? null : s) });
        chips.push(chip);
        return chip;
      })),
    ]));
  }
  function applyFilter(skill) {
    active = skill;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.textContent === skill)));
    document.querySelectorAll(".tag").forEach((t) => t.classList.toggle("hit", !!skill && t.dataset.tag === skill));
    let hits = 0;
    document.querySelectorAll("[data-tags]").forEach((item) => {
      const match = !!skill && item.dataset.tags.split("|").includes(skill);
      item.classList.toggle("match", match);
      item.classList.toggle("dim", !!skill && !match);
      if (match) {
        hits++;
        const toggle = item.querySelector(".role-toggle");
        if (toggle && toggle.getAttribute("aria-expanded") === "false") toggle.click();
      }
    });
    $("#filter-status").hidden = !skill;
    if (skill) {
      $("#filter-name").textContent = skill;
      $("#filter-count").textContent = `${hits} ${hits === 1 ? "item" : "items"} across work and experience`;
    }
  }
  $("#filter-clear").addEventListener("click", () => applyFilter(null));

  // ---------- Education ----------
  $("#education-list").append(...R.education.map((e) =>
    el("li", {}, [el("strong", { text: e.name }), el("div", { class: "org", text: `${e.org} · ${e.dates}` })])));
  $("#cert-list").append(el("li", {}, [el("strong", { text: "Certifications" })]), ...R.certifications.map((c) => el("li", { text: c })));

  // ---------- Theme, print, scroll-spy ----------
  $("#theme-btn").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });
  $("#print-btn").addEventListener("click", () => window.print());

  const links = [...document.querySelectorAll(".nav-links a")];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }
})();
