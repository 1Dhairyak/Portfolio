// Theme switch that burns the old page away, starting at (x, y).
//
// View Transitions snapshot both themes. The new theme is revealed through a ragged clip-path that
// spreads unevenly (tongues surge and stall, the edge crawls, it never un-burns). A canvas with its own
// view-transition-name paints above both snapshots and draws the scorch, burning line, flame licks and
// embers. One rAF loop computes the front and feeds the same points to both the clip and the canvas.
// (Precomputed multi-keyframe clip-path animations hitch in Chrome, so the clip is set per frame.)

const DURATION = 2400; // ms — total burn time
const JAG_MAX = 70; // px, cap on edge raggedness
const TAU = Math.PI * 2;

let burning = false;

// Periodic 2D value noise in [-1, 1]: u wraps around the circle [0, 1), v is time.
function valueNoise(period) {
  const rows = 32;
  const g = Float32Array.from({ length: period * rows }, () => Math.random() * 2 - 1);
  const sm = (t) => t * t * (3 - 2 * t);
  return (u, v) => {
    const x = u * period;
    const i = Math.floor(x);
    const fx = sm(x - i);
    const j = Math.floor(v);
    const fy = sm(v - j);
    const i0 = ((i % period) + period) % period;
    const i1 = (i0 + 1) % period;
    const j0 = (j % rows) * period;
    const j1 = ((j + 1) % rows) * period;
    const top = g[j0 + i0] + (g[j0 + i1] - g[j0 + i0]) * fx;
    const bot = g[j1 + i0] + (g[j1 + i1] - g[j1 + i0]) * fx;
    return top + (bot - top) * fy;
  };
}

// Sum of octaves [[period, amplitude, timeScale], ...], normalized to [-1, 1].
function fbm(octaves) {
  const layers = octaves.map(([period, amp, ts]) => ({ n: valueNoise(period), amp, ts }));
  const norm = octaves.reduce((s, o) => s + o[1], 0);
  return (u, t) => {
    let s = 0;
    for (const l of layers) s += l.amp * l.n(u, t * l.ts);
    return s / norm;
  };
}

// Distance from (x, y) to the viewport edge along direction (c, s).
function toEdge(x, y, c, s, W, H) {
  const tx = c > 1e-6 ? (W - x) / c : c < -1e-6 ? -x / c : Infinity;
  const ty = s > 1e-6 ? (H - y) / s : s < -1e-6 ? -y / s : Infinity;
  return Math.min(tx, ty);
}

const ease = (p) => p * p * (3 - 2 * p); // slow ignition, catches, slows on the last corners

// Fire canvas + frame(p, dt, now) that advances the front, draws it, and returns the matching clip-path.
function createFire(x, y, W, H) {
  // vertices on the burn front: a phone's front is far shorter, so fewer points look the same and cost half
  const POINTS = W < 768 ? 320 : 600;
  // ── the burn front: radius per vertex, only ever grows ──
  const spread = fbm([[3, 1, 1.2], [7, 0.6, 2.5]]); // which way the fire runs; surges and stalls
  const jag = fbm([[16, 1, 3], [40, 0.6, 5], [100, 0.35, 7], [220, 0.2, 9]]); // ragged, crawling edge
  const hot = fbm([[9, 1, 6], [23, 0.5, 11]]); // where the line burns hottest
  const scorch = fbm([[6, 1, 0.8], [19, 0.5, 1.5]]); // how far the char reaches ahead
  const cos = new Float32Array(POINTS);
  const sin = new Float32Array(POINTS);
  for (let i = 0; i < POINTS; i++) {
    cos[i] = Math.cos((i / POINTS) * TAU);
    sin[i] = Math.sin((i / POINTS) * TAU);
  }
  const speed = (i, p) => 1 + 0.38 * spread(i / POINTS, p * 2);
  // final radius at which even the slowest direction has cleared the screen
  let end = 0;
  for (let i = 0; i < POINTS; i++) {
    end = Math.max(end, (toEdge(x, y, cos[i], sin[i], W, H) + 60 + JAG_MAX) / speed(i, 1));
  }

  const rr = new Float32Array(POINTS);
  const px = new Float32Array(POINTS);
  const py = new Float32Array(POINTS);
  const heat = new Float32Array(POINTS);
  const reach = new Float32Array(POINTS);
  const embers = [];
  let spawnDebt = 0;

  const canvas = document.createElement("canvas");
  canvas.className = "theme-fire";
  // the glow is soft anyway; on phones 1x halves the blur/raster work against their 3x screens
  const dpr = W < 768 ? 1 : Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // closed polygon at radius rr[i] + offset(i)
  const ring = (offset) => {
    const path = new Path2D();
    for (let i = 0; i < POINTS; i++) {
      const r = rr[i] + offset(i);
      i ? path.lineTo(x + cos[i] * r, y + sin[i] * r) : path.moveTo(x + cos[i] * r, y + sin[i] * r);
    }
    path.closePath();
    return path;
  };
  // Paint only the blurred shadow of a shape (shape drawn off-canvas, shadow offset back on) = soft fill.
  // Shadow offset/blur are in device pixels, hence the dpr factors.
  const OFF = 20000;
  const shadowFill = (path, blur, color) => {
    ctx.save();
    ctx.translate(-OFF, 0);
    ctx.shadowOffsetX = OFF * dpr;
    ctx.shadowBlur = blur * dpr;
    ctx.shadowColor = color;
    ctx.fillStyle = "#000";
    ctx.fill(path);
    ctx.restore();
  };
  const visible = (i) => px[i] > -20 && px[i] < W + 20 && py[i] > -20 && py[i] < H + 20;

  // Advances the front to progress p, draws the fire, returns the matching clip-path.
  function frame(p, dt, now) {
    const secs = now / 1000;
    const base = end * ease(p);
    const amp = Math.min(0.14 * base, JAG_MAX);
    let onScreen = 0;
    let clip = "polygon(";
    for (let i = 0; i < POINTS; i++) {
      rr[i] = Math.max(rr[i], base * speed(i, p) + amp * jag(i / POINTS, p)); // fire never retreats
      px[i] = x + cos[i] * rr[i];
      py[i] = y + sin[i] * rr[i];
      heat[i] = hot(i / POINTS, secs);
      reach[i] = 30 + 60 * (0.5 + 0.5 * scorch(i / POINTS, secs));
      if (visible(i)) onScreen++;
      clip += `${px[i].toFixed(1)}px ${py[i].toFixed(1)}px${i < POINTS - 1 ? "," : ")"}`;
    }
    const front = ring(() => 0);
    const fade = Math.min(1, (1 - p) / 0.12); // particles die out before the layer is removed

    ctx.clearRect(0, 0, W, H);

    // 1. scorch on the old page (outside the front): soft brown with uneven reach, black char at the line
    ctx.save();
    const outside = new Path2D();
    outside.rect(0, 0, W, H);
    outside.addPath(front);
    ctx.clip(outside, "evenodd");
    shadowFill(ring((i) => reach[i] * 0.7), 28, "rgba(85,40,10,0.55)");
    shadowFill(ring((i) => 2 + 6 * (0.5 + 0.5 * heat[i])), 5, "rgba(12,5,2,0.9)");
    ctx.restore();

    // 2. the burning line, flickering
    const fl = 0.9 + 0.1 * Math.sin(now / 43) + 0.07 * Math.sin(now / 17);
    ctx.shadowColor = "rgba(255,80,0,0.9)";
    ctx.shadowBlur = 20 * fl;
    ctx.lineWidth = 6 * fl;
    ctx.strokeStyle = "rgba(255,84,8,0.85)";
    ctx.stroke(front);
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(255,160,50,0.95)";
    ctx.stroke(front);

    // hot stretches glow white-yellow and throw up small flame licks
    const hotPath = new Path2D();
    const licks = new Path2D();
    for (let i = 0; i < POINTS; i++) {
      if (heat[i] < 0.1) continue;
      const j = (i + 1) % POINTS;
      hotPath.moveTo(px[i], py[i]);
      hotPath.lineTo(px[j], py[j]);
      if (i % 6 === 0 && visible(i)) {
        // lick leans outward from the front and upward, flickering in height
        const h = (10 + 32 * heat[i]) * (0.6 + 0.4 * Math.sin(now / 55 + i * 1.7)) * fade;
        const dx = cos[i] * 0.6;
        const dy = sin[i] * 0.6 - 0.8;
        const n = Math.hypot(dx, dy);
        const w = 3 + 4 * heat[i];
        licks.moveTo(px[i] - sin[i] * w, py[i] + cos[i] * w);
        licks.quadraticCurveTo(px[i] + (dx / n) * h * 0.5, py[i] + (dy / n) * h * 0.5, px[i] + (dx / n) * h, py[i] + (dy / n) * h);
        licks.quadraticCurveTo(px[i] + (dx / n) * h * 0.4, py[i] + (dy / n) * h * 0.4, px[i] + sin[i] * w, py[i] - cos[i] * w);
        licks.closePath();
      }
    }
    ctx.shadowColor = "rgba(255,120,20,1)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "rgba(255,110,15,0.75)";
    ctx.fill(licks);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,240,190,1)";
    ctx.stroke(hotPath);
    ctx.shadowBlur = 0;

    // 3. embers lifting off the line
    spawnDebt += onScreen * 0.35 * dt;
    while (spawnDebt >= 1 && embers.length < 300) {
      spawnDebt--;
      const i = (Math.random() * POINTS) | 0;
      if (px[i] < 0 || px[i] > W || py[i] < 0 || py[i] > H) continue;
      embers.push({
        x: px[i], y: py[i],
        vx: (Math.random() - 0.5) * 60, vy: -(30 + Math.random() * 90),
        life: 0, max: 0.6 + Math.random() * 1.1,
        size: 0.9 + Math.random() * 2, seed: Math.random() * TAU,
      });
    }
    for (let n = embers.length - 1; n >= 0; n--) {
      const e = embers[n];
      e.life += dt;
      if (e.life >= e.max) { embers.splice(n, 1); continue; }
      e.vy -= 45 * dt; // heat lifts them
      e.x += (e.vx + Math.sin(e.life * 9 + e.seed) * 30) * dt;
      e.y += e.vy * dt;
      const age = e.life / e.max;
      const al = (1 - age) * fade;
      ctx.fillStyle = `rgba(255,${(110 * (1 - age)) | 0},0,${al * 0.25})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * 3, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(255,${(230 - 150 * age) | 0},${(140 * (1 - age)) | 0},${al})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, TAU);
      ctx.fill();
    }
    return clip;
  }

  return { canvas, ctx, frame };
}

// Burns once on a small detached canvas so the first real click doesn't pay for JIT and GPU shader
// compiles (measured: ~130ms hitch on a cold first switch without this). Call when the page is idle.
export function warmUpBurn() {
  const { ctx, frame } = createFire(300, 0, 600, 400);
  for (let i = 1; i <= 8; i++) frame(i / 9, 1 / 60, i * 16);
  ctx.getImageData(0, 0, 1, 1); // force the GPU to actually execute the recorded draws
}

function applyTheme(next) {
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch { /* storage blocked */ }
}

// The one entry point for changing theme: burns from (x, y) where supported, else switches instantly.
// UI that shows the current theme should watch <html data-theme> (see ThemeToggle).
export function switchTheme(next, x, y) {
  if (document.documentElement.dataset.theme === next) return;
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme(next);
    return;
  }
  burnThemeSwitch(() => applyTheme(next), x, y);
}

function burnThemeSwitch(apply, x, y) {
  if (burning) return; // let the fire finish
  burning = true;

  const root = document.documentElement;
  const { canvas, frame } = createFire(x, y, innerWidth, innerHeight);

  root.classList.add("theme-switching");
  const vt = document.startViewTransition(() => {
    apply();
    document.body.appendChild(canvas);
  });

  vt.ready
    .then(() => {
      // Paused carrier animation: holds the per-frame clip and keeps the transition alive until finish().
      const clip = frame(0, 0, document.timeline.currentTime);
      const anim = root.animate([{ clipPath: clip }, { clipPath: clip }], {
        duration: DURATION, fill: "both", pseudoElement: "::view-transition-new(root)",
      });
      anim.pause();
      const start = document.timeline.currentTime;
      let last = start;
      const tick = () => {
        if (!canvas.isConnected) return;
        const now = document.timeline.currentTime;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const p = Math.min((now - start) / DURATION, 1);
        const c = frame(p, dt, now);
        anim.effect.setKeyframes([{ clipPath: c }, { clipPath: c }]);
        if (p < 1) requestAnimationFrame(tick);
        else anim.finish();
      };
      requestAnimationFrame(tick);
    })
    .catch(() => {}); // transition skipped (e.g. tab hidden): theme still applied

  vt.finished.finally(() => {
    canvas.remove();
    root.classList.remove("theme-switching");
    burning = false;
  });
}
