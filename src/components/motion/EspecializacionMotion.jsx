import { motion, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

function PillarIcon({ icon }) {
  switch (icon) {
    case "retention":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M4 16.5h3l2.7-4.5 2.4 3.6 2.8-5.1 2.4 4.2H20" />
          <path d="M4 19.5h16" />
        </svg>
      );
    case "click":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M6 5v14" />
          <path d="M6 5l12 6-5.3 2.1L20 19l-4.8 1-4.1-5.5L9 19 6 5Z" />
        </svg>
      );
    case "search":
    default:
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l4 4" />
        </svg>
      );
  }
}

function Pillar({ item, index }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionReveal
      as="div"
      className="specialization-pillar"
      delay={0.38 + index * 0.08}
      {...(shouldReduceMotion
        ? {}
        : {
            whileHover: { y: -2, scale: 1.01, transition: softSpring },
            whileTap: { scale: 0.995 },
          })}
    >
      <span className="specialization-pillar-icon" aria-hidden="true">
        <PillarIcon icon={item.icon} />
      </span>
      <span className="specialization-pillar-label">{item.label}</span>
    </MotionReveal>
  );
}

export default function EspecializacionMotion({ especializacion }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="specialization-section" data-section="especializacion" aria-labelledby="specialization-title">
      <div className="container specialization-inner">
        <MotionReveal as="p" className="eyebrow specialization-eyebrow" delay={0.02}>
          {especializacion.eyebrow}
        </MotionReveal>

        <MotionReveal as="div" className="specialization-brand" delay={0.12}>
          <span className="specialization-youtube" aria-hidden="true">
            <span className="specialization-youtube-body" />
            <motion.span
              className="specialization-youtube-play"
              initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.24 }}
            />
          </span>
          <span className="specialization-brand-name">{especializacion.brand.label}</span>
        </MotionReveal>

        <MotionReveal as="p" id="specialization-title" className="specialization-body" delay={0.22}>
          {especializacion.body}
        </MotionReveal>

        <div className="specialization-pillars" aria-label="Pilares de especialización">
          {especializacion.pillars.map((pillar, index) => (
            <Pillar item={pillar} index={index} key={pillar.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
