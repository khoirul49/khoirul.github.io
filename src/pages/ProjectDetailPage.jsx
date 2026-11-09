import { useCallback, useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import NotFoundPage from "./NotFoundPage";
import { imagesOf } from "../lib/photos";
import { projects } from "../data/content";

function ProjectImage({ src, alt, index }) {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative mb-5 max-w-7xl mx-auto w-full">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-neutral-300 rounded" />}
      <img
        src={src}
        alt={alt}
        className={`h-auto w-full object-contain transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={index === 0 ? "eager" : "lazy"}
        onLoad={handleLoad}
      />
    </div>
  );
}

function ScrollDownButton() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop < document.documentElement.scrollHeight - document.documentElement.clientHeight) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      setIsAtBottom(true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsAtBottom(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-0 right-0 flex justify-center items-center mb-10">
      <Motion.div
        className="h-10 w-10 bg-neutral-900 rounded-full flex justify-center items-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleScroll}
      >
        <FontAwesomeIcon icon={isAtBottom ? faChevronUp : faChevronDown} className="text-white text-2xl" />
      </Motion.div>
    </div>
  );
}

const label = "uppercase font-normal text-lg tracking-[8px] text-neutral-400";

export default function ProjectDetailPage({ slug }) {
  const data = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) return <NotFoundPage />;
  const images = imagesOf(data.slug);

  return (
    <>
      <div className="relative min-h-screen w-full gap-4 p-10 flex justify-center items-center flex-col mb-10">
        <button
          onClick={() => window.history.back()}
          className="fixed top-2 -left-2 md:left-10 flex justify-center items-center rounded-full p-4 transition duration-300 ease-in-out z-50"
          aria-label="Go back"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
        </button>
        <ScrollDownButton />
        <div className="min-h-screen flex justify-center items-center">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 mt-10 md:mt-0">
            <div className="min-h-screen sm:min-h-0 flex justify-center items-start flex-col mb-5 space-y-10 mx-auto">
              <div>
                <h2 className={label}>Project</h2>
                <h1 className="text-4xl font-medium text-neutral-900">{data.title}</h1>
              </div>
              {data.tech?.length > 0 && (
                <div>
                  <h2 className={label}>Technology</h2>
                  <p className="text-2xl font-normal text-neutral-900">{data.tech.join(", ")}</p>
                </div>
              )}
              {data.year && (
                <div>
                  <h2 className={label}>Year</h2>
                  <p className="text-2xl font-normal text-neutral-900">{data.year}</p>
                </div>
              )}
              {data.preview && (
                <div>
                  <h2 className={label}>Preview</h2>
                  <p className="text-2xl font-normal text-neutral-900">
                    <a href={data.preview} target="_blank" rel="noopener noreferrer">
                      Preview <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-3" />
                    </a>
                  </p>
                </div>
              )}
              {data.code && (
                <div>
                  <h2 className={label}>Source Code</h2>
                  <p className="text-2xl font-normal text-neutral-900">
                    <a href={data.code} target="_blank" rel="noopener noreferrer">
                      Github <FontAwesomeIcon icon={faGithub} className="ml-3" />
                    </a>
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-start items-start flex-col mb-5">
              <h2 className={label}>Description</h2>
              {(data.desc ?? []).map((d) => (
                <p key={d.slice(0, 30)} className="text-xl text-justify tracking-wide font-normal text-gray-500 mb-5">
                  {d}
                </p>
              ))}
            </div>
          </div>
        </div>
        {images.length > 0 && (
          <div className="mx-auto grid grid-cols-1 p-5 md:p-20 w-full">
            <div className="w-full h-auto text-center flex flex-col justify-center">
              {images.map((src, index) => (
                <ProjectImage key={src} src={src} alt={`${data.title} ${index + 1}`} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
