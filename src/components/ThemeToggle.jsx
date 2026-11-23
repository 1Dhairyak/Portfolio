import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import { burnThemeSwitch, warmUpBurn } from "../themeBurn";

const spring = { type: "spring", stiffness: 220, damping: 20 };

// 8 sun rays as [x1, y1, x2, y2] around the 24x24 center
const rays = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return [8, 10.5].flatMap((d) => [12 + Math.cos(a) * d, 12 + Math.sin(a) * d]);
});

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const dark = theme === "dark";

  // Pre-compile the fire while the page is idle so the first click is as smooth as the rest
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    idle(warmUpBurn, { timeout: 4000 });
  }, []);

  const toggle = (e) => {
    const next = dark ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      root.dataset.theme = next;
      flushSync(() => setTheme(next));
      try { localStorage.setItem("theme", next); } catch { /* storage blocked */ }
    };

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    // The old page burns away from the button, revealing the new theme.
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    burnThemeSwitch(apply, left + width / 2, top + height / 2);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      title={`Switch to ${dark ? "light" : "dark"} theme`}
      className="w-9 h-9 shrink-0 rounded-full border border-white/10 text-white/80 hover:text-accent hover:border-accent/50 flex items-center justify-center transition-colors duration-200"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <mask id="theme-toggle-moon">
          <rect width="24" height="24" fill="white" />
          <motion.circle r="7.5" fill="black" initial={false} animate={dark ? { cx: 17.5, cy: 7 } : { cx: 32, cy: -8 }} transition={spring} />
        </mask>
        <motion.circle cx="12" cy="12" fill="currentColor" mask="url(#theme-toggle-moon)" initial={false} animate={{ r: dark ? 9 : 5 }} transition={spring} />
        <motion.g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={dark ? { rotate: -60, scale: 0.4, opacity: 0 } : { rotate: 0, scale: 1, opacity: 1 }}
          transition={spring}
        >
          {rays.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </motion.g>
      </svg>
    </button>
  );
}
