import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { skills } from "../../data/content";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ActivityIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}
function CodepenIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" x2="12" y1="22" y2="15.5" />
      <polyline points="22 8.5 12 15.5 2 8.5" />
      <polyline points="2 15.5 12 8.5 22 15.5" />
      <line x1="12" x2="12" y1="2" y2="8.5" />
    </svg>
  );
}
function WebhookIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </svg>
  );
}
function MobileIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" x2="12" y1="18" y2="18" />
    </svg>
  );
}

const icons = { web: CodepenIcon, api: WebhookIcon, ai: ActivityIcon, mobile: MobileIcon };

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } };

function SkillCard({ skill, isSelected, onClick }) {
  const Icon = icons[skill.icon] ?? CodepenIcon;
  return (
    <Motion.div
      onClick={onClick}
      className={`relative cursor-pointer group p-6 rounded-2xl border transition-all duration-300 ${
        isSelected
          ? "bg-white/20 border-black border-2 shadow-lg"
          : "bg-white/10 border-gray-300/20 hover:bg-white/20 hover:border-gray-300/30"
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isSelected && (
        <div className="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-50 bg-gradient-to-r from-gray-400/20 to-gray-600/20 blur-xl" />
      )}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div
          className={`p-4 rounded-xl transition-all duration-300 ${
            isSelected ? "bg-white/30" : "bg-white/10 group-hover:bg-white/20"
          }`}
        >
          <Icon className="w-8 h-8 text-black" />
        </div>
        <div>
          <h3 className="font-semibold text-black text-lg mb-2">{skill.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
        </div>
      </div>
    </Motion.div>
  );
}

function SkillDetails({ selectedSkill }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-12 space-y-8"
    >
      <Motion.div
        className="bg-white/40 border border-gray-300/30 rounded-2xl p-8 shadow-sm"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-black mb-6 text-center">Technology Stack</h3>
        <Motion.div
          key={selectedSkill.title}
          className="flex flex-wrap justify-center gap-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {selectedSkill.languages.map((skill) => (
            <Motion.span
              key={skill.name}
              variants={tagVariants}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-default flex items-center gap-2 ${
                skill.highlight
                  ? "bg-black text-white shadow-md border-black scale-105 z-10 hover:shadow-lg"
                  : "bg-gradient-to-r from-gray-200/60 to-white/40 border border-gray-400/40 text-black hover:bg-white/60"
              }`}
            >
              {skill.highlight && <span className="text-yellow-400 text-[10px] animate-pulse">✦</span>}
              {skill.name}
            </Motion.span>
          ))}
        </Motion.div>
      </Motion.div>

      {selectedSkill.tools?.length > 0 && (
        <Motion.div
          className="bg-white/20 border border-gray-300/20 rounded-2xl p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-medium text-gray-500 mb-6 text-center uppercase tracking-wider">
            Infrastructure & Tools
          </h3>
          <Motion.div
            key={selectedSkill.title + "-tools"}
            className="flex flex-wrap justify-center gap-3"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {selectedSkill.tools.map((tool) => (
              <Motion.span
                key={tool}
                variants={tagVariants}
                className="px-4 py-1.5 bg-gray-300/30 border border-gray-400/20 rounded-lg text-gray-600 text-xs font-medium"
              >
                {tool}
              </Motion.span>
            ))}
          </Motion.div>
        </Motion.div>
      )}
    </Motion.div>
  );
}

export default function Skills() {
  const [selected, setSelected] = useState(skills[0]?.key);
  if (skills.length === 0) return null;
  const current = skills.find((s) => s.key === selected) ?? skills[0];

  return (
    <div className="relative">
      <div className="mx-auto container px-6 py-20">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore my technical skills across different domains. Click on any category to see the specific
            technologies and tools I work with.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {skills.map((skill, index) => (
            <Motion.div
              key={skill.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkillCard skill={skill} isSelected={current.key === skill.key} onClick={() => setSelected(skill.key)} />
            </Motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <SkillDetails selectedSkill={current} />
        </AnimatePresence>
      </div>
    </div>
  );
}
