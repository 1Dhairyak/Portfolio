import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-8 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-3 items-center gap-4">
        <div>
          <p className="text-white/50 text-sm font-sans">Created By Dhairya</p>
          <p className="text-white/30 text-xs font-mono mt-0.5">© 2026. All Rights Reserved.</p>
        </div>
        <a
          href="tel:+917061915688"
          className="text-center text-accent font-bold font-mono text-xl tracking-wide hover:text-white transition-colors duration-200"
        >
          +91 7061915688
        </a>
        <div className="flex gap-4 md:justify-self-end">
          {[
            { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/dhairya153/" },
            { icon: <FaGithub />, href: "https://github.com/1Dhairyak" },
            { icon: <FaInstagram />, href: "https://www.instagram.com/dhairya_68/" },
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
