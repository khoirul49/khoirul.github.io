import { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import { copy } from "../../data/content";

function useIntersectionObserver() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return [ref, isIntersecting];
}

function Words({ text, offset, on, className }) {
  const words = text.split(" ");
  return (
    <h3 className={className}>
      {words.map((word, index) => (
        <Motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(4px)", scale: 0.92 }}
          animate={{
            opacity: on ? 1 : 0,
            filter: on ? "blur(0px)" : "blur(4px)",
            scale: on ? 1 : 0.92,
          }}
          transition={{ delay: on ? (offset + index) * 0.1 : 0, duration: 0.5 }}
        >
          {word}{" "}
        </Motion.span>
      ))}
    </h3>
  );
}

export default function Quote() {
  const [line1, line2] = copy.quote;
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <div className="min-h-[80vh] mx-auto container p-10 grid grid-cols-1 mt-10">
      <Motion.div
        className="flex justify-center items-center flex-col mb-5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div ref={ref} className="text-center">
          <Words text={line1} offset={0} on={isIntersecting} className="text-[2rem]" />
          <Words text={line2} offset={line1.split(" ").length} on={isIntersecting} className="text-xl" />
        </div>
      </Motion.div>
    </div>
  );
}
