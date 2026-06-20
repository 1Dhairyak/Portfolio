import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaInstagram, FaDownload } from "react-icons/fa";
import profileImg from "../assets/profile.jpg";

const stats = [
  { value: "8+", label: "Projects Shipped" },
  { value: "4+", label: "Years Coding" },
  { value: "23+", label: "Certificates" },
  { value: "2", label: "Cloud Platforms" },
];

const socials = [
  { icon: <FaLinkedin size={20} />, href: "https://www.linkedin.com/in/dhairya153/", label: "LinkedIn" },
  { icon: <FaGithub size={20} />, href: "https://github.com/1Dhairyak", label: "GitHub" },
  { icon: <FaInstagram size={20} />, href: "https://www.instagram.com/dhairya_68/", label: "Instagram" },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center z-10 px-8">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex-shrink-0">
          <div className="bg-[#1c1c1c] rounded-xl overflow-hidden border border-white/10 shadow-2xl w-72">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#2a2a2a] border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-white/40 font-mono">Profile.jpg — Dhairya Kumar</span>
            </div>
            <img src={profileImg} alt="Dhairya Kumar" className="w-full object-cover" style={{ maxHeight: "320px" }} loading="eager" decoding="sync" />
            <div className="px-4 py-3 font-mono text-sm text-accent">
              <span className="text-white/40">$ </span>./Profile.jpg Loaded Successfully<span className="animate-pulse">|</span>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-center md:text-left">
          <p className="font-mono text-accent text-sm mb-3 tracking-widest uppercase">Console.Log("Hello World")</p>
          <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-white mb-3 leading-tight">I Am <span className="text-accent">Dhairya Kumar</span></h1>
          <p className="text-white/60 text-lg font-sans mb-8">Cloud and Backend Engineer / Full Stack Developer</p>
          <div className="flex gap-4 justify-center md:justify-start mb-8">
            {socials.map(({ icon, href, label }) => (
              <div key={label} className="relative group">
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ willChange: "transform" }} className="w-12 h-12 rounded-full border-2 border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-black transition-colors duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,255,157,0.5)]">
                  {icon}
                </a>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start mb-10">
            <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 bg-accent text-black font-bold px-7 py-3 rounded-full hover:bg-accent/80 transition-colors duration-200 font-mono text-sm">View Projects →</a>
            <a href="/Dhairya_Kumar_CV.pdf" download className="inline-flex items-center gap-2 border-2 border-accent text-accent font-bold px-7 py-3 rounded-full hover:bg-accent hover:text-black transition-colors duration-200 font-mono text-sm"><FaDownload size={14} />Download CV</a>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="grid grid-cols-4 gap-4 border border-white/10 rounded-xl p-4 bg-white/[0.02] backdrop-blur-sm">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-accent font-bold text-2xl font-mono">{value}</p>
                <p className="text-white/40 text-[11px] font-sans mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-accent/50 text-2xl">↓</motion.div>
    </section>
  );
}