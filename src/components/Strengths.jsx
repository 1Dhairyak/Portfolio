import { motion } from "framer-motion";
import { strengths } from "../data/strengths";

export default function Strengths() {
  return (
    <section id="strengths" className="relative z-10 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold text-white mb-4 font-sans tracking-widest"
        >
          Work&nbsp;&nbsp;Area
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-white/40 font-mono text-sm mb-16"
        >
          // what I actually build well
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {strengths.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center text-center p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-400 cursor-default"
            >
              <span className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </span>
              <h3 className="text-white font-bold text-lg mb-3 font-sans">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-sans">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
