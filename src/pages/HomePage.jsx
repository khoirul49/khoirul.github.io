import { motion as Motion, AnimatePresence } from "framer-motion";
import { FullPageProvider, FullPageWrapper, Section, useFullPage } from "@alvalens/react-fullpage-snap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import Button from "../components/Button";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Photo from "../components/Photo";
import Sidebar from "../components/Sidebar";
import { pickPhoto } from "../lib/photos";
import { profile, copy, socials } from "../data/content";

function ScrollIndicator() {
  const { activeIndex } = useFullPage();
  const dismissed = activeIndex !== 0;

  return (
    <AnimatePresence>
      {activeIndex === 0 && !dismissed && (
        <Motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <span className="text-[10px] uppercase tracking-[4px] text-gray-500 font-medium">Scroll</span>
          <Motion.div
            className="w-[1.5px] h-14 bg-gray-500 origin-top"
            animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

// Slide kedua–keempat memakai tata letak yang sama: teks di kiri, foto di kanan.
function SplitSection({ photo, alt, title, children, tight = false }) {
  return (
    <Section>
      <div
        className={`relative md:h-screen w-screen gap-4 ${
          tight ? "p-10" : ""
        } flex justify-center items-center flex-col overflow-hidden`}
      >
        <div className="z-0 mb-48 md:mb-0 md:absolute md:top-1/2 md:right-[10%] md:-translate-y-1/2">
          <Motion.div
            className="relative bg-slate-300 rounded-sm h-100 md:h-[60vh] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0"
            initial={{ x: 300, opacity: 0, z: -100 }}
            whileInView={{ x: 0, opacity: 1, z: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
          >
            <Photo src={photo} alt={alt} fill className="object-cover" />
          </Motion.div>
        </div>
        <div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-10 py-5">
          <Motion.h1
            className="bg-white lg:bg-transparent px-3 text-black text-5xl md:text-8xl font-bold"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            {title}
          </Motion.h1>
          <Hr />
          {children}
        </div>
      </div>
    </Section>
  );
}

const tagline = "title text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem]";
const slide = (delay) => ({
  initial: { x: -100, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  transition: { delay, type: "spring" },
});
const icon = (name) =>
  ({ GitHub: faGithub, Instagram: faInstagram, LinkedIn: faLinkedin })[name];

function HomeContent() {
  const front = pickPhoto("front", "profile");
  const aboutPhoto = pickPhoto("about", "me2", "profile");
  const projectsPhoto = pickPhoto("projects", "profile");
  const contactPhoto = pickPhoto("setup", "profile");

  const mail = profile.email
    ? `mailto:${profile.email}?subject=Hello&body=Hello ${encodeURIComponent(profile.brand)},`
    : null;
  const links = [
    ...(mail ? [{ label: "Send email", href: mail, icon: faEnvelope, external: false }] : []),
    ...socials
      .filter((s) => icon(s.label))
      .map((s) => ({ label: `${s.label} profile`, href: s.href, icon: icon(s.label), external: true })),
  ];

  return (
    <FullPageWrapper>
      <Section>
        <div className="mx-auto w-[82%] max-w-screen-2xl grid grid-cols-1 md:grid-cols-3 gap-4 p-10 overflow-hidden">
          <Motion.div
            className="col-span-2 flex flex-col justify-center items-center md:items-start text-center md:text-start"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <div className="block md:hidden col-span-1 mx-auto my-10">
              <div className="bg-slate-500 rounded-full h-60 w-60 grayscale hover:grayscale-0 transition-all ease duration-300">
                <Photo src={front} alt={profile.name} className="rounded-full w-full h-full object-cover" />
              </div>
            </div>
            <Motion.h3
              className="uppercase text-xl mb-3 font-normal text tracking-[.5rem] text-gray-500"
              {...slide(0.2)}
            >
              {profile.name}
            </Motion.h3>
            <Motion.h1
              className="text-black text-4xl md:text-6xl lg:text-6xl 2xl:text-8xl font-bold my-2 md:my-5"
              {...slide(0.3)}
            >
              {profile.role}
            </Motion.h1>
            <Motion.p
              className="title text-md 2xl:text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem]"
              {...slide(0.4)}
            >
              {profile.intro}
            </Motion.p>
            <Motion.div
              className="buttons flex flex-row justify-center items-center space-x-4 mt-10"
              {...slide(0.5)}
            >
              <Button variation="primary">
                <a href={profile.cv} target="_blank" rel="noopener noreferrer" download>
                  Download CV
                </a>
              </Button>
              <Button variation="secondary">
                <a href="#contact">Contact Me</a>
              </Button>
            </Motion.div>
          </Motion.div>
          <Motion.div
            className="hidden md:flex col-span-1 mx-auto justify-center items-center"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <div className="rounded-full h-auto w-auto max-w-[26vw] lg:px-12 grayscale hover:grayscale-0 transition-all ease duration-300">
              <Photo src={front} alt={profile.name} className="rounded-full w-full h-full object-cover" />
            </div>
          </Motion.div>
        </div>
      </Section>

      <SplitSection photo={aboutPhoto} alt={profile.name} title="About Me">
        <Motion.p className={`${tagline} mb-5`} {...slide(0.2)}>
          {copy.aboutTagline}
        </Motion.p>
        <Motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Button variation="primary">
            <Link to="/about">Learn More</Link>
          </Button>
        </Motion.div>
      </SplitSection>

      <SplitSection photo={projectsPhoto} alt="Projects" title="My Projects" tight>
        <Motion.p className={`${tagline} mb-5`} {...slide(0.2)}>
          <span className="bg-transparent md:bg-gray-100 xl:bg-transparent">{copy.projectsTagline}</span>
        </Motion.p>
        <Motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Button variation="primary">
            <Link to="/projects">Learn More</Link>
          </Button>
        </Motion.div>
      </SplitSection>

      <SplitSection photo={contactPhoto} alt={profile.name} title="Get In Touch" tight>
        <Motion.p className={`${tagline} md:mb-5`} {...slide(0.2)}>
          <span className="bg-transparent md:bg-gray-100 xl:bg-transparent">{copy.contactTagline}</span>
        </Motion.p>
        {profile.email && (
          <Motion.p className={`${tagline} mb-5`} {...slide(0.3)}>
            <a href={mail}>{profile.email}</a>
          </Motion.p>
        )}
        <div className="flex justify-center items-center space-x-4">
          {links.map((l, i) => (
            <Motion.a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={l.label}
              className="flex justify-center items-center bg-gray-700 w-14 h-14 rounded-full text-gray-100 hover:bg-gray-400 transition-all ease-in-out duration-300"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ y: { delay: 0.1 * (i + 1) }, opacity: { delay: 0.1 * (i + 2) } }}
            >
              <FontAwesomeIcon icon={l.icon} className="text-3xl" />
            </Motion.a>
          ))}
        </div>
      </SplitSection>

      <ScrollIndicator />
    </FullPageWrapper>
  );
}

export default function HomePage() {
  return (
    <FullPageProvider anchors={["home", "about", "projects", "contact"]} scrollingSpeed={1000} menu="#sidebar" lockAnchors={false}>
      <Sidebar />
      <HomeContent />
    </FullPageProvider>
  );
}
