import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const socials = [
  {
    icon: <FaEnvelope size={26} />,
    href: "mailto:dhairyakumar490@gmail.com",
    label: "Email",
    color: "#EA4335",
    border: "#EA4335",
    description: "Drop me a mail",
  },
  {
    icon: <FaInstagram size={26} />,
    href: "https://www.instagram.com/dhairya_68/",
    label: "Instagram",
    color: "#E1306C",
    border: "#E1306C",
    description: "@dhairya_68",
  },
  {
    icon: <FaLinkedin size={26} />,
    href: "https://www.linkedin.com/in/dhairya153/",
    label: "LinkedIn",
    color: "#0A66C2",
    border: "#0A66C2",
    description: "/in/dhairya153",
  },
  {
    icon: <FaGithub size={26} />,
    href: "https://github.com/1Dhairyak",
    label: "GitHub",
    color: "#ffffff",
    border: "#ffffff",
    description: "/1Dhairyak",
  },
];

const platforms = ["Gmail", "LinkedIn", "GitHub", "Instagram", "Telegram"];

export default function Contact() {
  const [platformIdx, setPlatformIdx] = useState(0);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const cyclePlatform = () => setPlatformIdx((i) => (i + 1) % platforms.length);

  return (
    <section id="contact" className="relative z-10 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold text-white mb-4 font-sans tracking-wide"
        >
          Contact
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-center text-white/40 font-mono text-sm mb-16"
        >
          // let's build something together
        </motion.p>

        <div className="flex flex-col items-center gap-14">
          {/* Cycling platform text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-2xl font-sans text-white mb-3">
              Contact me by:{" "}
              <span
                className="text-accent font-mono cursor-pointer select-none relative inline-block"
                onClick={cyclePlatform}
                title="Click to cycle"
              >
                {platforms[platformIdx]}
                <span className="animate-pulse">|</span>
              </span>
            </p>
            <p className="text-white/30 font-mono text-xs">// click to cycle platforms</p>
          </motion.div>

          {/* Social icons with animated hover popup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-8 flex-wrap justify-center"
          >
            {socials.map(({ icon, href, label, color, border, description }) => (
              <div
                key={label}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredSocial(label)}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    border: `2px solid ${border}44`,
                    color: color,
                    background: color + "11",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = `2px solid ${border}`;
                    e.currentTarget.style.background = color + "22";
                    e.currentTarget.style.transform = "scale(1.18) translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 8px 30px ${color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = `2px solid ${border}44`;
                    e.currentTarget.style.background = color + "11";
                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {icon}
                </a>

                {/* Hover popup label */}
                <AnimatePresence>
                  {hoveredSocial === label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      transition={{ duration: 0.18 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none z-30"
                    >
                      <span
                        className="block text-xs font-bold font-mono whitespace-nowrap px-3 py-1.5 rounded-lg border"
                        style={{
                          color: color,
                          borderColor: color + "66",
                          background: color + "18",
                        }}
                      >
                        {label}
                      </span>
                      <p className="text-white/30 text-[10px] font-mono mt-1 whitespace-nowrap">
                        {description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>

          {/* Terminal-style availability note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-[#111] border border-white/10 rounded-xl px-6 py-4 font-mono text-sm text-center max-w-md"
          >
            <span className="text-white/30">$ </span>
            <span className="text-accent">status</span>
            <span className="text-white/30"> --check</span>
            <br />
            <span className="text-green-400 text-xs mt-1 block">✓ Open to opportunities · Responding within 24h</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
