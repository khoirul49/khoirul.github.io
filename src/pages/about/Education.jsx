import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faTrophy, faAward, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Photo from "../../components/Photo";
import { pickPhoto } from "../../lib/photos";
import { education, achievements } from "../../data/content";

const kinds = {
  gold: { icon: faMedal, color: "from-yellow-400 to-orange-500" },
  silver: { icon: faMedal, color: "from-slate-400 to-slate-500" },
  bronze: { icon: faMedal, color: "from-amber-600 to-yellow-600" },
  special: { icon: faTrophy, color: "from-yellow-400 to-orange-500" },
  finalist: { icon: faAward, color: "from-blue-500 to-purple-600" },
};

const all = [...achievements]
  .map((a) => ({ ...a, ...(kinds[a.type] ?? kinds.finalist) }))
  .sort((a, b) => Number(b.year) - Number(a.year));

export default function Education() {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!education && all.length === 0) return null;

  const visible = isExpanded ? all : all.slice(0, 6);
  const hasMore = all.length > 6;
  const strip = ["me5", "me4", "me6"].map((n) => pickPhoto(n)).filter(Boolean);
  const both = education && all.length > 0;

  return (
    <div className="mx-auto container gap-10 p-10 grid grid-cols-1 my-10">
      <Motion.div
        className="flex justify-center items-start flex-col mb-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <section className="grid gap-8 md:gap-12 w-full">
          <Motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Education</h1>
            <p className="max-w-[800px] mx-auto">Get to know more about my educational background.</p>
          </Motion.div>

          <div className={`grid grid-cols-1 ${both ? "md:grid-cols-2" : ""} gap-8`}>
            {education && (
              <Motion.div
                className="px-5"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="font-medium text-lg mb-4">{education.period}</div>
                <div>
                  <h2 className="font-semibold text-xl">{education.school}</h2>
                  <h3 className="text-md font-normal mb-3">{education.degree}</h3>
                  {strip.length > 0 && (
                    <div className="gap-4 mb-4 flex items-stretch md:h-[300px] xl:h-[400px]">
                      {strip.map((src, i) => (
                        <div key={i} className="flex-[1] transition-all duration-300 ease-in-out hover:flex-[3] group">
                          <Photo
                            src={src}
                            alt={education.school}
                            className="rounded-lg w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-in-out"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {education.text && (
                    <p className="text-gray-600 text-justify title text-lg">{education.text}</p>
                  )}
                  {education.badges?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 text-sm">
                      {education.badges.map((b) => (
                        <div key={b} className="bg-gray-300 text-black px-2 py-1 rounded-2xl">
                          {b}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Motion.div>
            )}

            {all.length > 0 && (
              <Motion.div
                className="flex flex-col justify-start px-5 md:px-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="font-semibold text-xl mt-7">Achievements</h2>
                <p className="text-md font-normal mb-3 md:mb-6">Some of my achievements during my study.</p>
                <div className="relative">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {visible.map((a, index) => (
                        <Motion.div
                          key={`${a.year}-${index}`}
                          className="group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          {index === 0 || visible[index - 1]?.year !== a.year ? (
                            <div className="flex items-center gap-3 mb-3 mt-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">{a.year}</span>
                              </div>
                              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                            </div>
                          ) : null}
                          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-lg hover:bg-white/30 transition-all duration-300 hover:shadow-xl grayscale hover:grayscale-0">
                            <div className="flex items-center gap-4">
                              <div
                                className={`aspect-square w-10 rounded-full bg-gradient-to-r ${a.color} flex items-center justify-center transition-all duration-300`}
                              >
                                <FontAwesomeIcon icon={a.icon} className="text-white h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">{a.title}</h3>
                                <p className="text-sm">{a.subtitle}</p>
                                <div className="text-xs text-gray-500 mt-1">{a.date}</div>
                              </div>
                            </div>
                          </div>
                        </Motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {hasMore && (
                    <Motion.div
                      className="flex justify-center mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/40 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
                      >
                        <span>{isExpanded ? "Show Less" : `Show ${all.length - 6} More`}</span>
                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="h-3 w-3" />
                      </button>
                    </Motion.div>
                  )}
                </div>
              </Motion.div>
            )}
          </div>
        </section>
      </Motion.div>
    </div>
  );
}
