import { motion as Motion } from "framer-motion";
import Link from "./Link";
import Photo from "./Photo";
import { projectImages } from "../lib/photos";

export default function ProjectCard({ project, activeCategory, compact = false }) {
  if (!project.category.includes(Number(activeCategory))) return null;
  const thumb = projectImages[project.slug];
  const first = project.desc?.[0] ?? "";
  return (
    <Link to={`/projects/${project.slug}`}>
      <Motion.div
        className={`z-10 relative flex justify-center items-start flex-col w-full h-auto bg-gray-400 group/tes aspect-video ${
          compact ? "px-3 py-2 mb-0" : "mb-5 md:px-10 py-20 px-5 md:py-2"
        }`}
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" }}
      >
        <Photo
          src={thumb}
          alt={project.title}
          fill
          className="bg-slate-950 opacity-10 group-hover/tes:opacity-100 transition-all ease duration-500 object-cover"
        />
        {project.year && (
          <div className="absolute top-0 left-0 bg-gray-600 px-4 py-2">
            <h4 className="text-white">{project.year}</h4>
          </div>
        )}
        <div className="transition-all ease duration-500 opacity-100 content text-center group-hover/tes:opacity-0 z-10">
          <h1 className={`${compact ? "text-lg md:text-xl mb-1" : "text-3xl mb-3"} font-bold`}>{project.title}</h1>
          <p className={compact ? "text-xs md:text-sm" : ""}>{first.length > 125 ? `${first.slice(0, 125)}...` : first}</p>
          <div className={`${compact ? "hidden" : "flex"} justify-center items-center flex-row mt-5 flex-wrap`}>
            {(project.tech ?? []).map((t) => (
              <span key={t} className="m-1 px-4 py-2 bg-gray-600 text-white">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Motion.div>
    </Link>
  );
}
