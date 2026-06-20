import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const links = ["Home", "About", "Certificates", "Strengths", "Projects", "Contact"];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <span
        className="font-mono text-accent text-xl font-bold tracking-wider cursor-pointer select-none"
        onClick={() => scrollTo("home")}
      >
        DHAIRYA
      </span>

      <ul className="flex gap-8">
        {links.map((link) => (
          <li key={link}>
            <button
              onClick={() => scrollTo(link)}
              className={`font-sans text-sm tracking-wide transition-colors duration-200 relative group ${
                active === link ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                  active === link ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
