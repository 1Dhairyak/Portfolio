import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-8 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white/50 text-sm font-sans">Created By Dhairya Kumar</p>
          <p className="text-white/30 text-xs font-mono mt-0.5">© 2026. All Rights Reserved.</p>
        </div>
        <div className="flex gap-4">
          {[
            { icon: <FaLinkedin />, href: "https://linkedin.com/in/1dhairyak" },
            { icon: <FaGithub />, href: "https://github.com/1Dhairyak" },
            { icon: <FaInstagram />, href: "https://instagram.com/dhairya_k" },
          ].map(({ icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-accent transition-colors duration-200 text-lg"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
