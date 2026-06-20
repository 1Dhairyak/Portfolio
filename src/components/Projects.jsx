import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const SLIDE_INTERVAL = 4000;

export default function Projects() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c === projects.length - 1 ? 0 : c + 1));
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c === 0 ? projects.length - 1 : c - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const getIndex = (offset) => (current + offset + projects.length) % projects.length;

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.96 }),
  };

  return (
    <section id="projects" className="relative z-10 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-4xl font-bold text-white mb-4 font-sans tracking-wide">
          Projects
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center text-white/40 font-mono text-sm mb-16">
          // shipped, deployed, and actually working
        </motion.p>
        <div className="relative flex items-center justify-center gap-6 min-h-[420px]">
          <div className="hidden lg:block w-64 flex-shrink-0 cursor-pointer opacity-40 scale-90 transition-opacity duration-300 hover:opacity-60" onClick={prev}>
            <ProjectCard project={projects[getIndex(-1)]} mini />
          </div>
          <div className="w-full max-w-md flex-shrink-0 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: "easeInOut" }} style={{ willChange: "transform, opacity" }}>
                <ProjectCard project={projects[current]} main />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="hidden lg:block w-64 flex-shrink-0 cursor-pointer opacity-40 scale-90 transition-opacity duration-300 hover:opacity-60" onClick={next}>
            <ProjectCard project={projects[getIndex(1)]} mini />
          </div>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 text-white/60 hover:border-accent hover:text-accent flex items-center justify-center transition-colors duration-200 lg:hidden">←</button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 text-white/60 hover:border-accent hover:text-accent flex items-center justify-center transition-colors duration-200 lg:hidden">→</button>
        </div>
        <div className="flex justify-center gap-2 mt-10">
          {projects.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-accent w-6" : "bg-white/25 w-2 hover:bg-white/50"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, main, mini }) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${main ? "border-accent/30 bg-white/[0.04] shadow-xl shadow-accent/5" : "border-white/10 bg-white/[0.02]"}`}>
      {project.image ? (
        <div className="w-full overflow-hidden" style={{ height: main ? "200px" : "130px" }}>
          <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        </div>
      ) : (
        <div className="flex items-center justify-center font-mono text-5xl" style={{ background: project.color, height: main ? "200px" : "130px" }}>
          {project.icon}
        </div>
      )}
      <div className={main ? "p-6" : "p-4"}>
        <h3 className={`text-white font-bold font-sans ${main ? "text-2xl mb-2" : "text-base mb-1"}`}>{project.title}</h3>
        {main && <p className="text-white/50 text-sm mb-4 leading-relaxed font-sans">{project.description}</p>}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-accent/70 border border-accent/20 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
        {main && (
          <div className="flex gap-3">
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-white/30 text-white px-4 py-2 rounded-full text-sm font-mono hover:border-accent hover:text-accent transition-colors duration-200">
                <FaGithub size={14} />Repository
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-full text-sm font-mono font-bold hover:bg-accent/80 transition-colors duration-200">
                <FaExternalLinkAlt size={12} />Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}