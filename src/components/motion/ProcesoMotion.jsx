import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { softSpring } from "./motionConfig";

function ProcessStep({ step, index, active, reducedMotion }) {
  return (
    <MotionReveal
      as="article"
      className={`process-step ${active ? "is-active" : ""}`}
      delay={index * 0.08}
      {...(reducedMotion
        ? {}
        : {
            whileHover: { y: -3, scale: 1.006, transition: softSpring },
            whileTap: { scale: 0.995 },
          })}
    >
      <div className="process-step-number" aria-hidden="true">
        {step.number}
      </div>
      <div className="process-step-copy">
        <h3>{step.title}</h3>
        <p>{step.description}</p>
      </div>
      <span className="process-step-accent" aria-hidden="true" />
    </MotionReveal>
  );
}

export default function ProcesoMotion({ proceso }) {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const steps = proceso.steps ?? [];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const reducedActiveIndex = steps.length - 1;
  const currentActiveIndex = shouldReduceMotion ? reducedActiveIndex : activeIndex;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (shouldReduceMotion || !steps.length) return;
    const nextIndex = Math.min(steps.length - 1, Math.max(0, Math.floor(latest * steps.length)));
    setActiveIndex((previous) => (previous === nextIndex ? previous : nextIndex));
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setActiveIndex(reducedActiveIndex);
    }
  }, [reducedActiveIndex, shouldReduceMotion]);

  return (
    <section
      id="proceso"
      ref={sectionRef}
      className={`process-section ${shouldReduceMotion ? "is-reduced" : ""}`}
      data-section="proceso"
      aria-labelledby="process-title"
    >
      <div className="container process-shell">
        <motion.aside
          className="process-sticky"
          style={shouldReduceMotion ? undefined : { top: "var(--process-sticky-top)" }}
        >
          <div className="process-sticky-inner">
            <div className="process-kicker">
              <MotionReveal as="p" className="eyebrow process-eyebrow" delay={0.02}>
                {proceso.eyebrow}
              </MotionReveal>
              <MotionReveal
                as="span"
                className="rule-draw process-rule"
                delay={0.08}
              />
            </div>

            <MotionReveal as="h2" id="process-title" className="process-title" delay={0.12}>
              {proceso.title}
            </MotionReveal>

            <MotionReveal as="p" className="process-lead" delay={0.18}>
              {proceso.lead}
            </MotionReveal>

            <MotionReveal as="div" className="process-indicator" delay={0.24}>
              <div className="process-rail" aria-hidden="true">
                <motion.span
                  className="process-rail-fill"
                  style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: progress }}
                />
              </div>

              <ol className="process-steps-list">
                {steps.map((step, index) => (
                  <li
                    className={`process-step-link ${currentActiveIndex === index ? "is-active" : ""}`}
                    key={step.number}
                  >
                    <span className="process-step-link-number">{step.number}</span>
                    <span className="process-step-link-title">{step.title}</span>
                  </li>
                ))}
              </ol>
            </MotionReveal>
          </div>
        </motion.aside>

        <div className="process-scroll">
          {steps.map((step, index) => (
            <ProcessStep
              key={step.number}
              step={step}
              index={index}
              active={currentActiveIndex === index}
              reducedMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
