import { useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { softSpring } from "./motionConfig";

function FacelessCard({ card, index }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionReveal
      as="article"
      className="faceless-card"
      delay={0.14 + index * 0.08}
      {...(shouldReduceMotion
        ? {}
        : {
            whileHover: { y: -4, scale: 1.006, transition: softSpring },
            whileTap: { scale: 0.995 },
          })}
    >
      <span className="faceless-card-kicker">{card.kicker}</span>
      <h3>{card.title}</h3>
      <p>{card.body}</p>
    </MotionReveal>
  );
}

export default function FacelessMotion({ faceless }) {
  return (
    <section id="faceless" className="faceless-section" data-section="faceless" aria-labelledby="faceless-title">
      <div className="container faceless-inner">
        <header className="faceless-header">
          <MotionReveal className="faceless-kicker" delay={0}>
            <span className="eyebrow">{faceless.eyebrow}</span>
            <span className="rule-draw faceless-rule" aria-hidden="true" />
          </MotionReveal>

          <MotionReveal as="h2" id="faceless-title" className="faceless-title" delay={0.08}>
            {faceless.title}
          </MotionReveal>

          <MotionReveal as="p" className="faceless-lead" delay={0.12}>
            {faceless.lead}
          </MotionReveal>
        </header>

        <div className="faceless-grid">
          {faceless.cards.map((card, index) => (
            <FacelessCard card={card} index={index} key={card.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
