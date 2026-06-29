import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

function NarrativeCard({ card, type, delay }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const isSolution = type === "solution";
  const shouldAnimate = mounted && !shouldReduceMotion;
  const animationState = !shouldAnimate || isInView ? "visible" : "hidden";

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: isSolution ? 34 : 22,
      scale: isSolution ? 0.975 : 0.99,
      clipPath: "inset(0 0 100% 0)",
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: "inset(0 0 0% 0)",
      filter: "blur(0px)",
    },
  };

  return (
    <motion.article
      ref={ref}
      className={`ps-card ps-card-${type} ${isSolution ? "elevation-floating" : "elevation-raised"}`}
      variants={cardVariants}
      initial={false}
      animate={animationState}
      transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay }}
      {...(shouldReduceMotion
        ? {}
        : {
            whileHover: { y: isSolution ? -5 : -3, scale: isSolution ? 1.008 : 1.004, transition: softSpring },
            whileTap: { scale: 0.992 },
          })}
    >
      {isSolution && <span className="ps-solution-rule rule-draw" aria-hidden="true" />}
      <p className="ps-eyebrow">{card.eyebrow}</p>
      <h2>{card.title}</h2>
      <p>{card.body}</p>
    </motion.article>
  );
}

export default function ProblemaSolucionMotion({ data }) {
  return (
    <section className="ps-section" data-section="problema-solucion" aria-label={`${data.problem.eyebrow} / ${data.solution.eyebrow}`}>
      <div className="container ps-grid">
        <NarrativeCard card={data.problem} type="problem" delay={0} />
        <NarrativeCard card={data.solution} type="solution" delay={0.16} />
      </div>
    </section>
  );
}
