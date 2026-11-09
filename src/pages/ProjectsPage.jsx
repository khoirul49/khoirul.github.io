import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import FixedButton from "../components/FixedButton";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Photo from "../components/Photo";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { imagesOf, pickPhoto, projectImages } from "../lib/photos";
import { categories, profile, projects as all } from "../data/content";

const SectionTitle = ({ children, spring = false }) => (
  <div className="mt-16 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
    <div className="flex justify-center items-center flex-col my-5 self-start">
      <Hr variant="long" />
      {spring ? (
        <Motion.h1
          className="text-3xl font-bold mt-3"
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          {children}
        </Motion.h1>
      ) : (
        <h1 className="text-3xl font-bold mt-3">{children}</h1>
      )}
    </div>
  </div>
);

export default function ProjectsPage() {
  const shown = all.filter((p) => p.show !== false);
  const usedCategories = Object.keys(categories).filter((k) => shown.some((p) => p.category.includes(Number(k))));
  const [activeCategory, setActiveCategory] = useState(usedCategories[0] ?? "1");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hero = pickPhoto("projects") ?? projectImages[all[0]?.slug] ?? pickPhoto("profile");
  const highlight = all.find((p) => p.featured) ?? all[0];
  const shots = highlight ? imagesOf(highlight.slug) : [];
  const shot = (i) => shots[i % Math.max(shots.length, 1)];
  const tile = "absolute aspect-video grayscale hover:grayscale-0 transition-all ease duration-300 hover:scale-150";

  return (
    <>
      <main className="overflow-hidden">
        <FixedButton to="#projects">
          <FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
        </FixedButton>

        <div className="relative h-screen w-screen gap-4 p-10 flex justify-center items-center flex-col mb-10 overflow-hidden">
          <div className="z-0 mb-48 md:mb-0 md:absolute top-1/4 md:right-[10%] md:-translate-y-16">
            <Motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.6 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="relative bg-slate-300 rounded-sm h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0"
            >
              <Photo src={hero} alt={profile.name} fill className="object-cover" />
            </Motion.div>
          </div>
          <div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-10 pt-4 backdrop-filter backdrop-blur-sm md:backdrop-blur-none bg-gray-100 md:bg-transparent md:pt-0">
            <h1 className="md:bg-white bg-transparent lg:bg-transparent text-black text-5xl md:text-8xl font-bold">
              My Projects
            </h1>
            <Hr />
            <p className="title text-xl mt-4 tracking-wider text-gray-900 leading-[1.7rem] mb-5">
              List of my projects that I have done and{" "}
              <span className="bg-transparent md:bg-gray-100 xl:bg-transparent">currently working on.</span>
            </p>
            <Motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
              className="mb-3"
            >
              <Button variation="primary">Scroll Down</Button>
            </Motion.div>
          </div>
        </div>

        {highlight && (
          <>
            <div className="mt-10 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
              <div className="flex justify-center items-center flex-col my-5 self-start">
                <Hr variant="long" />
                <h1 className="text-3xl font-bold mt-3">Highlight</h1>
              </div>
            </div>
            <div className="relative w-screen mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10">
              <div className="flex justify-center items-start flex-col mb-5">
                <div className="images relative w-full aspect-square">
                  <div className={`${tile} top-28 left-10 h-[40%] z-10`}>
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.5, x: 100 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      className="relative w-full h-full shadow-lg"
                    >
                      <Photo src={shot(0)} alt={highlight.title} fill className="object-cover" />
                    </Motion.div>
                  </div>
                  <div className={`${tile} top-10 right-28 h-[30%]`}>
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.5, x: -100 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative w-full h-full shadow-lg"
                    >
                      <Photo src={shot(2)} alt={highlight.title} fill className="object-cover" style={{ objectPosition: "0% 0%" }} />
                    </Motion.div>
                  </div>
                  <div className={`${tile} bottom-10 md:bottom-26 right-20 h-[35%]`}>
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.5, x: -100 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="relative w-full h-full shadow-lg"
                    >
                      <Photo src={shot(1)} alt={highlight.title} fill className="object-cover" />
                    </Motion.div>
                  </div>
                </div>
              </div>
              <Motion.div
                className="flex justify-center items-start flex-col mb-5 md:px-10"
                initial={{ opacity: 0, x: 200 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <h2 className="text-2xl font-bold tracking-wider mb-3">{highlight.title}</h2>
                <p className="text-gray-600 text-justify title text-lg">{(highlight.desc ?? []).join(" ")}</p>
                <div className="mt-3">
                  <Button variation="primary">
                    <Link to={`/projects/${highlight.slug}`}>More</Link>
                  </Button>
                  {highlight.preview && (
                    <Button variation="secondary">
                      <a href={highlight.preview} target="_blank" rel="noopener noreferrer">
                        Preview
                      </a>
                    </Button>
                  )}
                </div>
              </Motion.div>
            </div>
          </>
        )}

        <SectionTitle spring>Other Note Worthy Projects</SectionTitle>

        <Motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring" }}
          className="flex flex-row justify-center items-start flex-wrap gap-3 md:gap-5 my-5"
        >
          {usedCategories.map((key) => (
            <button
              key={key}
              className={`px-2 md:px-4 py-2 rounded-lg cursor-pointer transition-all ease duration-300 focus:bg-gray-300 focus:text-black focus:ring focus:ring-slate-500 ${
                activeCategory === key
                  ? "bg-gray-300 text-black hover:bg-gray-700 hover:text-white"
                  : "bg-gray-700 text-white hover:bg-gray-300 hover:text-black"
              }`}
              onClick={() => setActiveCategory(key)}
            >
              {categories[key]}
            </button>
          ))}
        </Motion.div>

        <div className="w-screen mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10 cursor-pointer">
          {shown.map((project) => (
            <ProjectCard project={project} key={project.slug} activeCategory={activeCategory} />
          ))}
        </div>

        <Motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex justify-center items-center flex-col my-5 self-start"
        >
          <Button variation="primary">
            <Link to="/projects/archive">View In Archive</Link>
          </Button>
        </Motion.div>
      </main>
      <Footer />
    </>
  );
}
