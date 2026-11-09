import { useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import FixedButton from "../components/FixedButton";
import Hr from "../components/Hr";
import Photo from "../components/Photo";
import Footer from "../components/Footer";
import { pickPhoto } from "../lib/photos";
import { copy, profile } from "../data/content";
import WhoAmI from "./about/WhoAmI";
import Skills from "./about/Skills";
import Experience from "./about/Experience";
import Education from "./about/Education";
import Quote from "./about/Quote";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const hero = pickPhoto("me2", "profile");

  return (
    <>
      <main className="overflow-hidden">
        <FixedButton to="#about">
          <FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
        </FixedButton>
        <div className="relative h-screen gap-4 p-10 flex justify-center items-center flex-col mb-10 overflow-hidden">
          <div className="z-0 mb-48 md:mb-0 md:absolute top-1/4 md:right-[10%] md:-translate-y-16">
            <Motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.6 }}
              transition={{ ease: "circOut", duration: 1 }}
              className="relative bg-slate-300 rounded-sm h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0"
            >
              <Photo src={hero} alt={profile.name} fill className="object-cover" />
            </Motion.div>
          </div>
          <div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-10 pt-4 backdrop-filter backdrop-blur-sm md:backdrop-blur-none bg-gray-100 md:bg-transparent md:pt-0">
            <h1 className="md:bg-white bg-transparent lg:bg-transparent text-black text-5xl md:text-8xl font-bold">
              About Me
            </h1>
            <Hr />
            <p className="title text-xl mt-4 tracking-wider text-gray-900 leading-[1.7rem] mb-5">
              <span className="bg-transparent md:bg-gray-100 xl:bg-transparent">{copy.aboutTagline}</span>
            </p>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
              className="mb-3"
            >
              <Button variation="primary">Scroll Down</Button>
            </Motion.div>
          </div>
        </div>

        <WhoAmI />
        <Skills />
        <Experience />
        <Education />
        <Quote />
      </main>
      <Footer />
    </>
  );
}
