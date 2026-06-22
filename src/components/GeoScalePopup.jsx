import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const STORAGE_KEY = "geoscale-popup-dismissed";

export default function GeoScalePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl rounded-2xl border border-accent/30 bg-[#111] shadow-2xl shadow-accent/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-accent hover:border-accent flex items-center justify-center transition-colors duration-200"
              aria-label="Close"
            >
              <FaTimes size={14} />
            </button>

            <div className="overflow-hidden">
              <img
                src="/projects/proj-geoscale.png"
                alt="GeoScale — compare true country sizes on an interactive map"
                className="w-full object-cover object-top"
              />
            </div>

            <div className="p-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white font-sans mb-1">GeoScale</h3>
                  <p className="text-white/50 text-sm font-sans leading-relaxed">
                    Geography quiz app with 10 random questions per session, live scoring, and full-stack deployment.
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <a
                    href="https://github.com/1Dhairyak/geoscale-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-white/30 text-white px-4 py-2 rounded-full text-sm font-mono hover:border-accent hover:text-accent transition-colors duration-200"
                  >
                    <FaGithub size={14} />
                    Repository
                  </a>
                  <button
                    onClick={() => {
                      dismiss();
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-full text-sm font-mono font-bold hover:bg-accent/80 transition-colors duration-200"
                  >
                    <FaExternalLinkAlt size={12} />
                    View Projects
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
