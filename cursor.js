// Target cursor: corner brackets that spin while roaming and snap around links, buttons and photos.
// Vanilla port of React Bits' <TargetCursor /> (MIT, reactbits.dev). Mouse only; touch keeps native behaviour.
(() => {
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  if (!fine.matches) return;

  const S = {
    targetSelector: "a, button, summary, .polaroid, .band, .cursor-target",
    cursorColor: "#ffffff",
    spinDuration: 2,
    hoverDuration: 0.2,
    parallaxOn: true,
    size: 36,
    cornerSize: 12,
    thickness: 3,
    padding: 6,
    matchRadius: true,
    dotSize: 4,
    showLabel: true,
    clickEffect: true,
  };
  // Labels shown above the brackets when locked on
  for (const [sel, text] of [[".card", "Open"], [".polaroid", "Drag"], [".band", "Move"], ["#sound", "Sound"], [".icons a", "Profile"], [".btn", "Go"]]) {
    document.querySelectorAll(sel).forEach((el) => el.dataset.cursorLabel ||= text);
  }

  const CORNER_ANGLES = [0, 90, 180, 270];
  const QUARTER = Math.PI / 2;
  const spring = (st, goal, k, c, dt) => {
    const h = dt / 2;
    for (let i = 0; i < 2; i++) {
      st.v += (k * (goal - st.x) - c * st.v) * h;
      st.x += st.v * h;
    }
  };

  const root = document.createElement("div");
  root.className = "target-cursor";
  root.setAttribute("aria-hidden", "true");
  root.style.opacity = "0";
  const corners = CORNER_ANGLES.map(() => root.appendChild(Object.assign(document.createElement("span"), { className: "target-cursor__corner" })));
  const dot = root.appendChild(Object.assign(document.createElement("span"), { className: "target-cursor__dot" }));
  const label = root.appendChild(Object.assign(document.createElement("span"), { className: "target-cursor__label" }));
  document.body.append(root);
  corners.forEach((c) => Object.assign(c.style, { width: `${S.cornerSize}px`, height: `${S.cornerSize}px`, borderWidth: `${S.thickness}px 0 0 ${S.thickness}px` }));
  Object.assign(dot.style, { width: `${S.dotSize}px`, height: `${S.dotSize}px` });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const style = document.head.appendChild(document.createElement("style"));
  const pointer = { x: 0, y: 0, inside: false, seen: false, pressed: false };
  const st = () => ({ x: 0, v: 0 });
  const cX = st(), cY = st(), hW = st(), hH = st(), rad = st(), turn = st(), lock = st(), press = st(), presence = st();
  let target = null, targetRadius = 0, quarter = 0, spinSpeed = 0, raf = 0, last = 0, lastLabel = "";

  const hideCursor = () => {
    const rule = pointer.inside ? "html, html * { cursor: none !important; }" : "";
    if (style.textContent !== rule) style.textContent = rule;
  };
  const findTarget = (x, y, el) => (el || document.elementFromPoint(x, y))?.closest?.(S.targetSelector) || null;
  const lockOn = (next) => {
    if (next === target) return;
    target = next;
    if (target) {
      quarter = Math.round(turn.x / QUARTER);
      targetRadius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      spinSpeed = 0;
    }
  };

  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (target && !target.isConnected) lockOn(null);
    const rect = target ? target.getBoundingClientRect() : null;
    const locked = !!rect && pointer.inside;
    const snapW = 4.6 / S.hoverDuration, snapK = snapW * snapW, snapC = 2 * 0.62 * snapW;

    spring(presence, pointer.inside ? 1 : 0, 260, 32, dt);
    spring(lock, locked ? 1 : 0, snapK, 2 * snapW, dt);
    spring(press, pointer.pressed && S.clickEffect ? 1 : 0, 900, 40, dt);

    let gx = pointer.x, gy = pointer.y, gw = S.size / 2, gh = S.size / 2, gr = Math.min(2, S.cornerSize / 4);
    if (locked) {
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2, lean = S.parallaxOn ? 0.08 : 0;
      gx = cx + (pointer.x - cx) * lean;
      gy = cy + (pointer.y - cy) * lean;
      const odd = Math.abs(quarter) % 2 === 1;
      const w = rect.width / 2 + S.padding, h = rect.height / 2 + S.padding;
      gw = odd ? h : w;
      gh = odd ? w : h;
      gr = S.matchRadius ? Math.min(targetRadius + Math.max(0, S.padding), S.cornerSize) : 0;
    }
    if (!pointer.inside && presence.x < 0.01) pointer.seen = false;
    if (!pointer.seen) { cX.x = gx; cY.x = gy; hW.x = gw; hH.x = gh; pointer.seen = pointer.inside; }

    const follow = locked ? snapK : 2200, followC = locked ? snapC : 2 * Math.sqrt(2200);
    spring(cX, gx, follow, followC, dt);
    spring(cY, gy, follow, followC, dt);
    spring(hW, gw, snapK, snapC, dt);
    spring(hH, gh, snapK, snapC, dt);
    spring(rad, gr, snapK, 2 * snapW, dt);
    if (locked) spring(turn, quarter * QUARTER, snapK, snapC, dt);
    else {
      const speed = S.spinDuration > 0 && !reduce ? (Math.PI * 2) / S.spinDuration : 0;
      spinSpeed += (speed - spinSpeed) * (1 - Math.exp(-dt * 3));
      turn.v = spinSpeed;
      turn.x += spinSpeed * dt;
    }

    const squeeze = 1 - press.x * 0.14, cos = Math.cos(turn.x), sin = Math.sin(turn.x);
    const w = Math.max(0, hW.x) * squeeze, h = Math.max(0, hH.x) * squeeze;
    const local = [[-w, -h], [w, -h], [w, h], [-w, h]];
    const r = Math.max(0, Math.min(rad.x, S.cornerSize)), deg = (turn.x * 180) / Math.PI;
    let left = Infinity, top = Infinity;
    corners.forEach((corner, i) => {
      const [lx, ly] = local[i];
      const x = cX.x + lx * cos - ly * sin, y = cY.x + lx * sin + ly * cos;
      left = Math.min(left, x);
      top = Math.min(top, y);
      corner.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(CORNER_ANGLES[i] + deg).toFixed(2)}deg)`;
      corner.style.borderTopLeftRadius = `${r.toFixed(2)}px`;
    });
    dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${(1 - press.x * 0.35).toFixed(3)})`;

    const text = S.showLabel && target ? target.dataset.cursorLabel || "" : "";
    if (text && text !== lastLabel) label.textContent = lastLabel = text;
    const shown = text ? Math.max(0, Math.min(1, lock.x)) : 0;
    label.style.transform = `translate3d(${left.toFixed(2)}px, ${(top - 8).toFixed(2)}px, 0) translateY(-100%) translateY(${((1 - shown) * 4).toFixed(2)}px)`;
    label.style.opacity = shown.toFixed(3);
    root.style.opacity = Math.max(0, Math.min(1, presence.x)).toFixed(3);

    const resting = !pointer.inside && presence.x < 0.002 && Math.abs(presence.v) < 0.002 && Math.abs(lock.x) < 0.002 && Math.abs(press.x) < 0.002;
    const spinning = pointer.inside && !locked && spinSpeed > 0.0001;
    const moving =
      Math.abs(cX.v) + Math.abs(cY.v) + Math.abs(hW.v) + Math.abs(hH.v) + Math.abs(turn.v) > 0.01 ||
      Math.abs(gx - cX.x) + Math.abs(gy - cY.x) > 0.05 ||
      Math.abs(lock.v) + Math.abs(press.v) + Math.abs(presence.v) > 0.001;
    if (!resting && (spinning || moving || locked)) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  addEventListener("pointermove", (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (!pointer.inside) { pointer.inside = true; hideCursor(); }
    lockOn(findTarget(pointer.x, pointer.y, e.target));
    wake();
  }, { passive: true });
  addEventListener("pointerdown", (e) => { if (!e.pointerType || e.pointerType === "mouse") { pointer.pressed = true; wake(); } }, { passive: true });
  addEventListener("pointerup", () => { pointer.pressed = false; wake(); }, { passive: true });
  addEventListener("scroll", () => { if (pointer.inside) { lockOn(findTarget(pointer.x, pointer.y)); wake(); } }, { passive: true, capture: true });
  const leave = () => { pointer.inside = false; pointer.pressed = false; lockOn(null); hideCursor(); wake(); };
  document.documentElement.addEventListener("pointerleave", leave);
  addEventListener("blur", leave);
})();
