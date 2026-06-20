import { useEffect, useRef } from "react";

const snippets = [
  "@RestController", "@Service", "@Entity", "JpaRepository",
  "docker-compose up", "spring.jpa.ddl-auto", "@GetMapping",
  "@PostMapping", "JWT.verify()", "RedisTemplate",
  "@SpringBootTest", "ResponseEntity<>", "Optional.of()",
  "SELECT * FROM", "CREATE TABLE", "@Column", "@ManyToOne",
  "useEffect(() => {", "useState()", "fetch('/api')",
  "npm run dev", "git push origin", "mvn clean install",
  "SETEX token", "@Valid", "HttpStatus.OK",
  "@ElementCollection", "Pageable.ofSize(10)",
  "WebSocketSession", "ObjectMapper", "@Autowired",
];

export default function FloatingBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999 };
    let dragging = null;
    let dragOffX = 0, dragOffY = 0;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      text: snippets[Math.floor(Math.random() * snippets.length)],
      speed: 0.15 + Math.random() * 0.3,
      baseAlpha: 0.08 + Math.random() * 0.18,
      alpha: 0.08 + Math.random() * 0.18,
      size: 10 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 0.2,
      // physics
      vx: 0,
      vy: 0,
      // shy effect push
      pushX: 0,
      pushY: 0,
      // throw state
      thrown: false,
    }));

    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    // Get text width for hit testing
    function getTextWidth(p) {
      ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
      return ctx.measureText(p.text).width;
    }

    function hitTest(p, cx, cy) {
      const w = getTextWidth(p);
      return cx >= p.x && cx <= p.x + w && cy >= p.y - p.size && cy <= p.y + 4;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Network dots
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fill();
      }

      // Floating snippets
      particles.forEach((p, idx) => {
        if (dragging && dragging === p) {
          // Being dragged — follow mouse
          p.x = mouse.x - dragOffX;
          p.y = mouse.y - dragOffY;
          p.alpha = Math.min(p.baseAlpha * 3.5, 0.9);
        } else if (p.thrown) {
          // Physics after throw
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.vy += p.speed * 0.05; // gentle downward drift

          // Edge bounce
          const tw = getTextWidth(p);
          if (p.x < 0) { p.x = 0; p.vx *= -0.6; }
          if (p.x + tw > W) { p.x = W - tw; p.vx *= -0.6; }
          if (p.y < p.size) { p.y = p.size; p.vy *= -0.6; }
          if (p.y > H + 20) { p.thrown = false; }

          // Settle: once velocity is tiny, resume normal float
          if (Math.abs(p.vx) < 0.08 && Math.abs(p.vy) < 0.08) {
            p.thrown = false;
            p.vx = 0;
            p.vy = 0;
          }

          p.alpha = p.baseAlpha;
        } else {
          // Normal float + shy effect from mouse
          p.y -= p.speed;
          p.x += p.drift;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const SHY_RADIUS = 120;

          if (dist < SHY_RADIUS && dist > 0) {
            const force = (1 - dist / SHY_RADIUS) * 2.8;
            p.pushX += (dx / dist) * force;
            p.pushY += (dy / dist) * force;
            p.alpha = Math.min(p.baseAlpha * 4, 0.85);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.06;
          }

          p.pushX *= 0.88;
          p.pushY *= 0.88;
          p.x += p.pushX;
          p.y += p.pushY;

          if (p.y < -20) {
            p.y = H + 20;
            p.x = Math.random() * W;
            p.text = snippets[Math.floor(Math.random() * snippets.length)];
            p.pushX = 0;
            p.pushY = 0;
          }
        }

        ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
        const glowing = !p.thrown && Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2) < 120;
        if (glowing || dragging === p) {
          ctx.shadowColor = "#00ff9d";
          ctx.shadowBlur = dragging === p ? 20 : 10;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(0,255,157,${p.alpha})`;
        ctx.fillText(p.text, p.x, p.y);
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    // Mouse move — update position
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Touch support
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    // Track last few mouse positions for throw velocity
    const trail = [];
    const onMouseMoveTrail = (e) => {
      trail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (trail.length > 8) trail.shift();
    };

    // Mouse down — check if clicking a particle
    const onMouseDown = (e) => {
      const cx = e.clientX, cy = e.clientY;
      // Check in reverse so top-rendered particle wins
      for (let i = particles.length - 1; i >= 0; i--) {
        if (hitTest(particles[i], cx, cy)) {
          dragging = particles[i];
          dragOffX = cx - dragging.x;
          dragOffY = cy - dragging.y;
          dragging.thrown = false;
          dragging.vx = 0;
          dragging.vy = 0;
          trail.length = 0;
          break;
        }
      }
    };

    // Mouse up — release with throw velocity
    const onMouseUp = () => {
      if (dragging) {
        // Compute velocity from recent trail
        if (trail.length >= 2) {
          const recent = trail.slice(-4);
          const dt = (recent[recent.length - 1].t - recent[0].t) || 16;
          const dx = recent[recent.length - 1].x - recent[0].x;
          const dy = recent[recent.length - 1].y - recent[0].y;
          dragging.vx = (dx / dt) * 16;
          dragging.vy = (dy / dt) * 16;
        }
        dragging.thrown = true;
        dragging.alpha = dragging.baseAlpha;
        dragging = null;
      }
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousemove", onMouseMoveTrail);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", onMouseMoveTrail);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ pointerEvents: "all", cursor: "default" }}
    />
  );
}
