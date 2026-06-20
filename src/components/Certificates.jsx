import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certificates } from "../data/certificates";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(certificates.map((c) => c.category)))];

const categoryColors = {
  Cloud: "#4285F4",
  ML: "#FF4B6E",
  "Web Dev": "#00C4B4",
  Algorithms: "#CFB87C",
  Other: "#888888",
  All: "#00ff9d",
};

function TerminalDots({ small = false }) {
  const size = small ? "w-2 h-2" : "w-3 h-3";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`${size} rounded-full bg-red-500`} />
      <span className={`${size} rounded-full bg-yellow-400`} />
      <span className={`${size} rounded-full bg-green-400`} />
    </div>
  );
}

export default function Certificates() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered =
    activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  return (
    <section id="certificates" className="relative z-10 py-28 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Page header: terminal code block ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden mb-14 shadow-2xl"
        >
          {/* Title bar */}
          <div className="flex items-center gap-3 px-5 py-3 bg-[#1a1a1a] border-b border-white/5">
            <TerminalDots />
            <span className="ml-2 text-xs text-white/30 font-mono">~/portfolio/certificates.js</span>
            <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              ● LIVE
            </span>
          </div>

          {/* Code block */}
          <div className="px-6 py-6 font-mono text-sm leading-8 overflow-x-auto">
            <p>
              <span className="text-purple-400">import</span>
              <span className="text-white/50"> {"{ "}</span>
              <span className="text-accent">certificates</span>
              <span className="text-white/50"> {"} "}</span>
              <span className="text-purple-400">from</span>
              <span className="text-orange-300"> "./data"</span>
              <span className="text-white/50">;</span>
            </p>
            <p className="mt-1">
              <span className="text-purple-400">const</span>
              <span className="text-blue-300"> achievements</span>
              <span className="text-white/50"> = {"{"}</span>
            </p>
            <p className="pl-8">
              <span className="text-green-300">total</span>
              <span className="text-white/50">: </span>
              <span className="text-orange-300">{certificates.length}</span>
              <span className="text-white/50">,</span>
            </p>
            <p className="pl-8">
              <span className="text-green-300">categories</span>
              <span className="text-white/50">: </span>
              <span className="text-orange-300">
                [{ALL_CATEGORIES.slice(1).map((c) => `"${c}"`).join(", ")}]
              </span>
              <span className="text-white/50">,</span>
            </p>
            <p className="pl-8">
              <span className="text-green-300">status</span>
              <span className="text-white/50">: </span>
              <span className="text-green-400">"verified ✓"</span>
            </p>
            <p>
              <span className="text-white/50">{"}"}</span>
              <span className="text-white/30">;</span>
            </p>
            <p className="mt-2 text-white/20">
              <span className="text-accent/50">{">"}</span> Rendering{" "}
              <span className="text-accent">{filtered.length}</span> certificates
              {activeCategory !== "All" && (
                <span className="text-white/30"> in <span className="text-accent">{activeCategory}</span></span>
              )}
              <span className="animate-pulse text-accent">_</span>
            </p>
          </div>
        </motion.div>

        {/* ── Section title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-3">
            <span className="text-white/30">&lt;</span>
            <span className="text-accent">Certificates</span>
            <span className="text-white/30"> /&gt;</span>
          </h2>
          <p className="text-white/30 font-mono text-sm tracking-widest">
            $ cat achievements.log <span className="text-accent animate-pulse">|</span>
          </p>
        </motion.div>

        {/* ── Category filter bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 mb-12 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <TerminalDots small />
            <span className="text-white/20 font-mono text-xs">filter@certs:~$</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-accent/60 font-mono text-xs">grep --category=</span>
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const color = categoryColors[cat] || "#00ff9d";
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border"
                  style={
                    isActive
                      ? { background: color + "22", color, borderColor: color + "99", fontWeight: 700 }
                      : { background: "transparent", color: "rgba(255,255,255,0.35)", borderColor: "rgba(255,255,255,0.1)" }
                  }
                >
                  {isActive && <span className="mr-1">▶</span>}
                  {cat}
                  <span className="ml-2 opacity-50">
                    ({cat === "All" ? certificates.length : certificates.filter((c) => c.category === cat).length})
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, i) => (
              <motion.div
                key={cert.name}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ delay: i * 0.06, duration: 0.35, type: "spring", stiffness: 200 }}
                className="bg-[#0d0d0d] border rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
                style={{
                  borderColor: hoveredCard === cert.name ? cert.color + "55" : "rgba(255,255,255,0.08)",
                  boxShadow: hoveredCard === cert.name ? `0 0 24px ${cert.color}18` : "none",
                }}
                onMouseEnter={() => setHoveredCard(cert.name)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelected(cert)}
              >
                {/* Terminal title bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#151515] border-b border-white/5">
                  <TerminalDots small />
                  <span className="ml-auto text-[10px] font-mono text-white/20 truncate max-w-[120px]">
                    {cert.name.replace(/ /g, "_").toLowerCase().slice(0, 20)}.cert
                  </span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ color: cert.color, background: cert.color + "22" }}
                  >
                    {cert.category}
                  </span>
                </div>

                {/* Image / placeholder */}
                <div className="relative h-36 overflow-hidden"
                  style={{ background: cert.color + "08" }}>
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border"
                        style={{ borderColor: cert.color + "33", background: cert.color + "11" }}
                      >
                        🎓
                      </div>
                      <p className="font-mono text-[10px]" style={{ color: cert.color + "66" }}>
                        {cert.issuer}
                      </p>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                  {/* Hover "click to expand" hint */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === cert.name ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
                  >
                    <span className="font-mono text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg bg-black/40">
                      $ cat details →
                    </span>
                  </motion.div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3
                    className="font-mono text-sm font-semibold leading-snug mb-2 transition-colors duration-200"
                    style={{ color: hoveredCard === cert.name ? cert.color : "rgba(255,255,255,0.85)" }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-white/35 font-mono text-xs mb-0.5">
                    <span className="text-white/20">// issuer: </span>{cert.issuer}
                  </p>
                  <p className="text-white/35 font-mono text-xs mb-3">
                    <span className="text-white/20">// year: </span>{cert.year}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills?.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-white/35"
                      >
                        {s}
                      </span>
                    ))}
                    {cert.skills?.length > 3 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-white/20">
                        +{cert.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-white/20 text-sm">// No certificates found in this category</p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          LIGHTBOX MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 260, damping: 22 }}
              className="bg-[#0d0d0d] border rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ borderColor: selected.color + "44" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal title bar */}
              <div
                className="flex items-center gap-3 px-5 py-3.5 border-b sticky top-0 z-10"
                style={{ background: "#111", borderColor: selected.color + "22" }}
              >
                <TerminalDots />
                <span className="ml-1 text-xs font-mono text-white/30">certificate_details.json</span>
                <span
                  className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{ color: selected.color, borderColor: selected.color + "44", background: selected.color + "11" }}
                >
                  {selected.category}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/30 hover:text-white transition-colors text-base leading-none ml-2"
                >
                  ✕
                </button>
              </div>

              {/* Certificate image */}
              {selected.image ? (
                <div className="bg-white/5 border-b border-white/5">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full max-h-64 object-contain"
                  />
                </div>
              ) : (
                <div
                  className="h-32 flex items-center justify-center border-b border-white/5"
                  style={{ background: selected.color + "08" }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border"
                    style={{ borderColor: selected.color + "33", background: selected.color + "11" }}
                  >
                    🎓
                  </div>
                </div>
              )}

              {/* Modal body */}
              <div className="p-6">
                <h3 className="font-mono text-lg font-bold mb-5" style={{ color: selected.color }}>
                  {selected.name}
                </h3>

                {/* JSON-style details */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 font-mono text-xs leading-7 mb-5">
                  <p><span className="text-white/25">{"{"}</span></p>
                  <p className="pl-5">
                    <span className="text-blue-300">issuer</span>
                    <span className="text-white/25">: </span>
                    <span className="text-orange-300">"{selected.issuer}"</span>
                    <span className="text-white/25">,</span>
                  </p>
                  <p className="pl-5">
                    <span className="text-blue-300">year</span>
                    <span className="text-white/25">: </span>
                    <span className="text-orange-300">"{selected.year}"</span>
                    <span className="text-white/25">,</span>
                  </p>
                  <p className="pl-5">
                    <span className="text-blue-300">category</span>
                    <span className="text-white/25">: </span>
                    <span style={{ color: selected.color }}>"{selected.category}"</span>
                    <span className="text-white/25">,</span>
                  </p>
                  <p className="pl-5">
                    <span className="text-blue-300">skills</span>
                    <span className="text-white/25">: </span>
                    <span className="text-green-300">
                      [{selected.skills?.map((s) => `"${s}"`).join(", ")}]
                    </span>
                  </p>
                  <p><span className="text-white/25">{"}"}</span></p>
                </div>

                {/* Skills tags */}
                {selected.skills?.length > 0 && (
                  <div className="mb-5">
                    <p className="font-mono text-[11px] text-white/25 mb-2">// skills covered</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.skills.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-mono px-3 py-1 rounded-lg border"
                          style={{ color: selected.color + "cc", borderColor: selected.color + "33", background: selected.color + "0d" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verify button */}
                {selected.verifyUrl ? (
                  <a
                    href={selected.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded-xl border transition-all duration-200 hover:opacity-80"
                    style={{ color: selected.color, borderColor: selected.color + "44", background: selected.color + "11" }}
                  >
                    $ curl -X GET /verify/certificate →
                  </a>
                ) : (
                  <p className="font-mono text-[11px] text-white/15">
                    // no public verify URL available
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
