// Hero portraits as WebGL planes: film grain, a slow scan line, and a lens ripple + RGB split that follow the mouse.
// Each <img> stays underneath as the fallback, so the page never waits on Three.js.
const bands = [...document.querySelectorAll(".band")];
const skip = matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection?.saveData;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uMouse, uRes, uImg;
uniform float uPower, uTime, uSeed;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  // object-fit: cover
  vec2 ratio = vec2(min((uRes.x / uRes.y) / (uImg.x / uImg.y), 1.0), min((uRes.y / uRes.x) / (uImg.y / uImg.x), 1.0));
  vec2 uv = vUv * ratio + (1.0 - ratio) * 0.5;
  vec2 d = (vUv - uMouse) * vec2(uRes.x / uRes.y, 1.0);
  float f = smoothstep(0.42, 0.0, length(d)) * uPower;
  vec2 off = normalize(d + 1e-4) * f * 0.03 * ratio;
  vec3 c = vec3(texture2D(uTex, uv - off * 1.9).r, texture2D(uTex, uv - off).r, texture2D(uTex, uv - off * 0.25).r);
  c = (c - 0.5) * 1.12 + 0.5;
  c += (hash(floor(vUv * uRes) + floor(uTime * 15.0)) - 0.5) * 0.11;
  float scan = fract(uTime * 0.09 + uSeed);
  c += smoothstep(0.012, 0.0, abs(vUv.y - (1.0 - scan))) * 0.18;
  c *= 1.0 - 0.4 * smoothstep(0.45, 0.98, length(vUv - 0.5));
  gl_FragColor = vec4(c, 1.0);
}`;

if (bands.length && !skip) {
  import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js")
    // Seed by position in its pair so the looped copy's scan line matches the original exactly
    .then((THREE) => bands.forEach((band, i) => mount(THREE, band, (i % 2) * 0.5).catch(() => band.querySelector("canvas")?.remove())))
    .catch(() => {});
}

async function mount(THREE, band, seed) {
  const img = band.querySelector("img");
  // A detached copy: a laid-out <img> reports its CSS size, not its pixel size
  const pic = new Image();
  pic.src = img.currentSrc || img.src;
  await pic.decode();

  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");

  const tex = new THREE.Texture(pic);
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  const u = {
    uTex: { value: tex },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImg: { value: new THREE.Vector2(pic.naturalWidth, pic.naturalHeight) },
    uPower: { value: 0 },
    uTime: { value: 0 },
    uSeed: { value: seed },
  };
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ uniforms: u, fragmentShader: FRAG, vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }" }),
  ));
  const camera = new THREE.Camera();
  img.after(canvas);

  const target = new THREE.Vector2(0.5, 0.5);
  let power = 0, last = null, visible = true, raf = 0, lastT = 0;
  band.addEventListener("pointermove", (e) => {
    const r = band.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
    if (last) power = Math.min(1, power + Math.hypot(x - last.x, y - last.y) * 5);
    last = { x, y };
    target.set(x, y);
    wake();
  });
  band.addEventListener("pointerleave", () => { last = null; });

  function wake() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
  function frame(t) {
    raf = 0;
    // 60fps while the ripple is alive, ~15fps for grain and scan line when idle
    if (power < 0.002 && t - lastT < 66) { wake(); return; }
    lastT = t;
    u.uMouse.value.lerp(target, 0.16);
    power *= 0.94;
    u.uPower.value = power;
    u.uTime.value = t / 1000;
    renderer.render(scene, camera);
    canvas.classList.add("ready");
    wake();
  }

  new ResizeObserver(() => {
    const w = band.clientWidth, h = band.clientHeight;
    renderer.setSize(w, h, false);
    u.uRes.value.set(w, h);
    wake();
  }).observe(band);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }).observe(band);
  document.addEventListener("visibilitychange", wake);
}
