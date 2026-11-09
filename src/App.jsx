import { useEffect } from "react";
import { useRoute } from "./lib/router";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ArchivePage from "./pages/ArchivePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import { profile, projects } from "./data/content";

export default function App() {
  const path = useRoute();
  const [, key = "", sub] = path.split("/");
  const slug = sub ? decodeURIComponent(sub) : undefined;

  useEffect(() => {
    const project = projects.find((p) => p.slug === slug);
    let title = `${profile.brand} | Portfolio`;
    if (key === "about") title = `About | ${profile.brand}`;
    else if (key === "projects") {
      const name = !slug ? "Projects" : slug === "archive" ? "Archive" : (project?.title ?? "Not Found");
      title = `${name} | ${profile.brand}`;
    }
    document.title = title;
  }, [key, slug]);

  let page;
  if (key === "") page = <HomePage />;
  else if (key === "about" && !sub) page = <AboutPage />;
  else if (key === "projects" && !sub) page = <ProjectsPage />;
  else if (key === "projects" && slug === "archive") page = <ArchivePage />;
  else if (key === "projects") page = <ProjectDetailPage slug={slug} />;
  else page = <NotFoundPage />;

  return (
    <>
      <Navbar />
      {page}
      <ChatBot />
    </>
  );
}
