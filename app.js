// Sound + music, count-up numbers, solid nav on scroll, draggable photo pile.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };

  // Never-ending page: a copy of the hero sits after the footer. The moment it reaches the top of the
  // screen we jump to the real top, which looks identical, so scrolling just keeps going.
  // Built here (before hero.js runs) so the copy gets the same WebGL treatment as the original.
  const hero = $(".hero");
  const loop = hero.cloneNode(true);
  loop.removeAttribute("id");
  loop.setAttribute("aria-hidden", "true");
  loop.inert = true;
  $$("[id]", loop).forEach((el) => el.removeAttribute("id"));
  const h1 = $("h1", loop), title = document.createElement("div"); // one real h1 per page
  title.className = h1.className;
  title.setAttribute("style", h1.getAttribute("style") || "");
  title.innerHTML = h1.innerHTML;
  h1.replaceWith(title);
  const loopTop = document.createElement("div");
  loopTop.style.cssText = "position:absolute;top:0;height:1px;width:1px";
  loop.prepend(loopTop);
  const tail = document.createElement("div"); // guarantees the copy can reach the top of the screen
  tail.style.height = "45vh";
  tail.setAttribute("aria-hidden", "true");
  $(".foot").after(loop, tail);
  addEventListener("scroll", () => {
    const top = loop.offsetTop;
    if (scrollY >= top) scrollTo({ top: scrollY - top, behavior: "instant" });
  }, { passive: true });

  // Nav gets a backdrop away from the top (the real top and its copy both count as "top")
  const nav = $(".nav");
  const atTop = new Map();
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => atTop.set(e.target, e.isIntersecting));
    nav.classList.toggle("solid", ![...atTop.values()].some(Boolean));
  });
  navIO.observe($("#top-sentinel"));
  navIO.observe(loopTop);

  // Sound: off by default. On = reveal hit, then the music bed fades in (Web Audio, so the loop is gapless).
  const btn = $("#sound");
  const sfx = {};
  let on = false, ctx, gain, music;
  const play = (n, vol = 0.6) => {
    if (!on || !sfx[n]) return;
    const a = sfx[n].cloneNode();
    a.volume = vol;
    a.play().catch(() => {});
  };
  async function startMusic() {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") await ctx.resume();
    if (!gain) {
      gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
    }
    music ||= fetch("/sfx/music.mp3").then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).then((buf) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(gain);
      src.start();
    });
    await music;
    if (on) gain.gain.setTargetAtTime(0.3, ctx.currentTime, 1.4); // slow fade in
  }
  function setSound(v) {
    on = v;
    btn.setAttribute("aria-pressed", String(v));
    document.body.classList.toggle("sound-on", v);
    store.set("sy.sound", v ? "1" : "0");
    if (v) {
      for (const n of ["reveal", "swoosh", "hit"]) sfx[n] ||= new Audio(`/sfx/${n}.mp3`);
      play("reveal", 0.8);
      startMusic().catch(() => {});
    } else if (gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
  }
  btn.addEventListener("click", () => setSound(!on));
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (on) ctx.resume();
  });
  if (store.get("sy.sound") === "1") {
    // Browsers block audio until a gesture, so resume on the first one
    const resume = (e) => {
      removeEventListener("pointerdown", resume);
      removeEventListener("keydown", resume);
      if (!on && !e.target.closest?.("#sound")) setSound(true);
    };
    addEventListener("pointerdown", resume);
    addEventListener("keydown", resume);
  }

  // Section headlines swoosh in (when sound is on) and numbers count up
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      seen.unobserve(e.target);
      play("swoosh", 0.35);
      if (reduce) continue;
      $$("[data-count]", e.target).forEach((el) => {
        const end = Number(el.dataset.count), t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / 1100);
          el.textContent = Math.round(end * (1 - (1 - p) ** 3));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  }, { threshold: 0.4 });
  $$(".sec .big, .statement .big").forEach((h) => seen.observe(h));

  // Photo pile: drag, shuffle, tidy, double-click to zoom
  const pile = $(".pile");
  if (!pile) return;
  const cards = $$(".polaroid", pile);
  let z = 10;
  const place = (el, x, y, r) => {
    const W = pile.clientWidth, H = pile.clientHeight, w = el.offsetWidth, h = el.offsetHeight;
    x = Math.min(Math.max(x, -w * 0.25), W - w * 0.75);
    y = Math.min(Math.max(y, -h * 0.1), H - h * 0.8);
    el._p = { x, y, r };
    el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
  };
  const shuffle = () => {
    const W = pile.clientWidth, H = pile.clientHeight;
    cards.forEach((el) => place(el, Math.random() * (W - el.offsetWidth), Math.random() * (H - el.offsetHeight), Math.random() * 24 - 12));
  };
  const tidy = () => {
    // Greedy rows (photos have different widths), centred, rows overlap if the pile is short
    const W = pile.clientWidth, H = pile.clientHeight, gap = 14, rows = [];
    let row = [], used = 0;
    for (const el of cards) {
      if (row.length && used + el.offsetWidth > W) { rows.push([row, used - gap]); row = []; used = 0; }
      row.push(el);
      used += el.offsetWidth + gap;
    }
    rows.push([row, used - gap]);
    const h = cards[0].offsetHeight;
    const dy = rows.length > 1 ? Math.min(h + gap, (H - h) / (rows.length - 1)) : 0;
    rows.forEach(([els, width], r) => {
      let x = (W - width) / 2;
      for (const el of els) { place(el, x, r * dy, 0); x += el.offsetWidth + gap; }
    });
  };
  // Start stacked in the middle, deal the photos out when the pile scrolls into view
  cards.forEach((el, i) => place(el, (pile.clientWidth - el.offsetWidth) / 2, (pile.clientHeight - el.offsetHeight) / 2, i * 3 - 12));
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); shuffle(); } }, { threshold: 0.3 }).observe(pile);
  new ResizeObserver(() => cards.forEach((el) => place(el, el._p.x, el._p.y, el._p.r))).observe(pile);
  $("#shuffle").addEventListener("click", () => { shuffle(); play("swoosh", 0.5); });
  $("#tidy").addEventListener("click", () => { tidy(); play("hit", 0.5); });

  const zoom = document.createElement("dialog");
  zoom.className = "zoom";
  document.body.append(zoom);
  zoom.addEventListener("click", () => zoom.close());
  const open = (el) => {
    const img = $("img", el);
    zoom.innerHTML = `<img src="${img.src}" alt="${img.alt}"><p>${$("figcaption", el).textContent}</p>`;
    zoom.showModal();
    play("swoosh", 0.4);
  };

  cards.forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      el.setPointerCapture(e.pointerId);
      el.classList.add("drag");
      el.style.zIndex = ++z;
      const sx = e.clientX - el._p.x, sy = e.clientY - el._p.y;
      const move = (ev) => place(el, ev.clientX - sx, ev.clientY - sy, el._p.r);
      const up = () => {
        el.classList.remove("drag");
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        play("hit", 0.35);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
    el.addEventListener("dblclick", () => open(el));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") open(el); });
  });
})();
