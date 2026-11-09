import { useState } from "react";
import { motion as Motion } from "framer-motion";
import Link from "./Link";
import { profile } from "../data/content";

const navVariant = {
  open: {
    clipPath: "circle(2000px at calc(100% - 40px) 40px)",
    transition: { type: "tween", duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    clipPath: "circle(0px at calc(100% - 40px) 40px)",
    transition: { delay: 0.3, type: "tween", duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

const itemVariants = {
  open: (custom) => ({
    opacity: 1,
    x: 0,
    transition: { delay: custom, type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
  closed: {
    opacity: 0,
    x: -80,
    transition: { type: "tween", duration: 0.2 },
  },
};

const items = [
  { to: "#home", label: "Home", delay: 0.1 },
  { to: "/about", label: "About", delay: 0.2 },
  { to: "/projects", label: "Projects", delay: 0.3 },
  { to: "#contact", label: "Contact", delay: 0.4 },
];

function NavItems({ isNavOpen, setIsNavOpen }) {
  const state = isNavOpen ? "open" : "closed";
  return (
    <Motion.div
      className="fixed z-[45] w-full h-screen flex items-center justify-center overflow-hidden"
      variants={navVariant}
      animate={state}
      initial={false}
      inert={!isNavOpen}
    >
      <div className="relative opacity-95 flex flex-col items-center space-x-8 min-h-[100vh] bg-gray-700 min-w-[100vw]">
        <div className="flex flex-col items-center space-y-8 my-auto mx-0 z-50">
          <Motion.h1 variants={itemVariants} animate={state} className="text-6xl font-bold text-white">
            Menu
          </Motion.h1>
          {items.map((it) => (
            <Link key={it.label} to={it.to}>
              <div className="text-2xl font-bold text-white" onClick={() => setIsNavOpen(false)}>
                <Motion.h2 className="text-white" variants={itemVariants} animate={state} custom={it.delay}>
                  {it.label}
                </Motion.h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Motion.div>
  );
}

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <nav
        className={`navbar px-5 md:px-24 w-screen fixed transition-colors ease duration-500 ${
          isNavOpen ? "backdrop-filter backdrop-blur-md bg-gray-700" : "backdrop-filter backdrop-blur-md"
        } inset-0 flex flex-row justify-between items-center h-16 z-50`}
      >
        <div>
          <h1 className={`text-2xl ml-2 md:ml-0 transition-colors ease duration-500 ${isNavOpen ? "text-white" : ""}`}>
            {profile.brand}
          </h1>
        </div>
        <div className="flex flex-row items-center">
          <button
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isNavOpen}
            className="burger button flex flex-col justify-center items-center space-y-1.5"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <div
              className={`w-10 h-1 bg-black rounded-full transition-all ease duration-300 ${
                isNavOpen ? "rotate-45 bg-white translate-y-[2px]" : ""
              }`}
            />
            <div
              className={`w-10 h-1 bg-black rounded-full transition-all ease duration-300 ${
                isNavOpen ? "-rotate-45 -translate-y-2 bg-white" : ""
              }`}
            />
          </button>
        </div>
      </nav>
      <NavItems isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
    </>
  );
}
