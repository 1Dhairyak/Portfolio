import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import profileImg from "../assets/profile.jpg";
import { switchTheme } from "../themeBurn";

// The intro shows both themes side by side, so it uses their fixed colors rather than the theme tokens.
const SIDES = {
  dark: { bg: "#0a0a0a", fg: "#ffffff", glow: "rgba(0,255,157,0.14)", pill: "border border-[#00ff9d] text-[#00ff9d]", Icon: FaMoon, label: "Dark" },
  light: { bg: "#7bdff2", fg: "#0c2d3d", glow: "rgba(255,255,255,0.5)", pill: "bg-[#f2b5d4] text-[#0c2d3d]", Icon: FaSun, label: "Light" },
};
const EASE = [0.76, 0, 0.24, 1];
const OUT = [0.22, 1, 0.36, 1];

// Text drawn twice and clipped at the screen's center line, so each half gets its own color.
function SplitText({ as: Tag = "div", className = "", children }) {
  return (
    <Tag className={`relative w-screen text-center ${className}`}>
      <span className="block" style={{ color: SIDES.dark.fg, clipPath: "inset(0 50% 0 0)" }}>{children}</span>
      <span className="absolute inset-0 block" aria-hidden="true" style={{ color: SIDES.light.fg, clipPath: "inset(0 0 0 50%)" }}>
        {children}
      </span>
    </Tag>
  );
}

// "Introducing Dhairyak": pick a side, the halves part, and the page burns into the chosen theme.
export default function Intro() {
  const [open, setOpen] = useState(true);
  const [choice, setChoice] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const pick = (side) => {
    if (choice) return;
    setChoice(side);
    setOpen(false);
  };

  const onExitComplete = () => {
    document.documentElement.classList.add("intro-done"); // starts entrance-only effects (e.g. the name highlight)
    switchTheme(choice, innerWidth / 2, innerHeight / 2);
  };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          key="intro"
          role="dialog"
          aria-label="Introducing Dhairyak — choose a theme"
          className="fixed inset-0 z-[100] flex select-none"
          initial="hidden"
          animate="shown"
          exit="gone"
          variants={{ gone: { opacity: 0, transition: { when: "afterChildren", duration: 0.01 } } }}
        >
          {["dark", "light"].map((side) => {
            const { bg, glow, pill, Icon, label } = SIDES[side];
            return (
              <motion.button
                key={side}
                onClick={() => pick(side)}
                onMouseEnter={() => setHover(side)}
                onMouseLeave={() => setHover(null)}
                aria-label={`Enter in ${label.toLowerCase()} theme`}
                className="relative flex-1 h-full cursor-pointer overflow-hidden focus:outline-none"
                style={{ background: bg }}
                variants={{ gone: { x: side === "dark" ? "-100%" : "100%", transition: { duration: 0.85, ease: EASE } } }}
              >
                {/* soft light rising in the hovered half */}
                <span
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 88%, ${glow}, transparent 60%)`, opacity: hover === side ? 1 : 0 }}
                />
                <span className={`absolute inset-x-0 bottom-[11%] flex justify-center transition-transform duration-300 ${hover === side ? "scale-110" : ""}`}>
                  <motion.span
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm font-bold tracking-wider uppercase ${pill}`}
                    variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.6, ease: OUT } } }}
                  >
                    <Icon size={13} /> {label}
                  </motion.span>
                </span>
              </motion.button>
            );
          })}

          {/* center: photo on the seam, name split across both themes */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              className="rounded-full p-1 mb-7 shadow-2xl"
              style={{ background: "linear-gradient(90deg, #00ff9d 50%, #f2b5d4 50%)" }}
              variants={{
                hidden: { opacity: 0, scale: 0.6 },
                shown: { opacity: 1, scale: 1, transition: { delay: 0.15, duration: 0.9, ease: OUT } },
                gone: { opacity: 0, scale: 0.85, transition: { duration: 0.45, ease: EASE } },
              }}
            >
              <img src={profileImg} alt="Dhairyak" className="block w-36 h-36 md:w-48 md:h-48 rounded-full object-cover object-top" />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                shown: { opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.7, ease: OUT } },
                gone: { opacity: 0, transition: { duration: 0.3 } },
              }}
            >
              <SplitText className="font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-2">Introducing</SplitText>
            </motion.div>

            <div className="overflow-hidden pb-2">
              <motion.div
                variants={{
                  hidden: { y: "110%" },
                  shown: { y: 0, transition: { delay: 0.75, duration: 0.9, ease: EASE } },
                  gone: { opacity: 0, transition: { duration: 0.3 } },
                }}
              >
                <SplitText as="h1" className="font-sans font-extrabold tracking-tight leading-[1.1] text-[clamp(3rem,11vw,7.5rem)]">
                  Dhairyak
                </SplitText>
              </motion.div>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                shown: { opacity: 0.7, transition: { delay: 1.5, duration: 0.6 } },
                gone: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              <SplitText className="font-mono text-[11px] md:text-xs tracking-widest mt-3">choose a side</SplitText>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
