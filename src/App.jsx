import FloatingBg from "./components/FloatingBg";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Certificates from "./components/Certificates";
import Strengths from "./components/Strengths";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollTopBtn from "./components/ScrollTopBtn";
import Divider from "./components/Divider";

export default function App() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">
      <FloatingBg />
      <Navbar />
      <Hero />
      <Divider />
      <AboutMe />
      <Divider />
      <Certificates />
      <Divider />
      <Strengths />
      <Divider />
      <Projects />
      <Divider />
      <Contact />
      <Footer />
      <ScrollTopBtn />
    </div>
  );
}
