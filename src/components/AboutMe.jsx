import { motion } from "framer-motion";
import { skills } from "../data/skills";

export default function AboutMe() {
  return (
    <section id="about" className="relative z-10 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-4xl font-bold text-white mb-16 font-sans tracking-wide">
          About <span className="text-accent">Me</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-accent font-mono text-sm mb-2">Hey There!</p>
            <h3 className="text-white font-bold text-2xl mb-5 font-sans leading-snug">I am Dhairya, a Backend and Cloud Engineer and Full Stack Developer.</h3>
            <p className="text-white/60 leading-relaxed mb-4 font-sans">
              4th-year Computer Science Engineering student at LPU, specializing in Cloud Computing — originally from <span className="text-accent font-semibold">Patna, Bihar</span>. I build production-grade Java Spring Boot backends with microservice architecture, JWT security, Redis caching, and PostgreSQL — paired with React frontends that are fast, animated, and actually shipped.
            </p>
            <p className="text-white/60 leading-relaxed font-sans">
              I have deployed 8+ full-stack projects to Vercel and Render, solved real engineering problems from rate limiters to Testcontainers integration tests. I care about clean code, correct architecture, and not shipping bugs to production.
            </p>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 mt-8 border border-accent text-accent px-6 py-2.5 rounded-full font-mono text-sm hover:bg-accent hover:text-black transition-colors duration-200">
              Read More →
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-accent font-mono font-semibold mb-5">Skills</p>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h4 className="text-white font-bold text-lg mb-3 font-sans">
                  {category === "cloud" ? "Cloud / DevOps" : category === "database" ? "Database" : category === "backend" ? "Back-End" : "Front-End"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <motion.span key={skill.name} whileHover={{ scale: 1.45 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} style={{ willChange: "transform" }} className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full font-mono hover:border-accent hover:text-accent hover:bg-accent/10 hover:shadow-[0_0_14px_rgba(0,255,157,0.35)] transition-colors duration-150 cursor-default origin-center">
                      <span>{skill.icon}</span>{skill.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}