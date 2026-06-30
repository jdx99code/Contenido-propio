import { motion, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

function ServiceIcon({ icon }) {
  switch (icon) {
    case "edit":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M4 20h4l10.5-10.5a1.8 1.8 0 0 0 0-2.6l-1.4-1.4a1.8 1.8 0 0 0-2.6 0L4 16v4Z" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      );
    case "thumbnail":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8.5 14.5l2.5-3 2 2.4 1.5-1.8 1.5 2.4" />
          <circle cx="9" cy="10" r="1.1" />
        </svg>
      );
    case "seo":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l4.5 4.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <path d="M8 4v4M16 4v4M4 10h16" />
          <path d="M8 13h2M12 13h2M16 13h2" />
        </svg>
      );
    case "management":
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M7 9h10M7 12h4M7 15h7" />
          <circle cx="18" cy="15" r="1.1" />
        </svg>
      );
    case "niche":
    default:
      return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
      );
  }
}

function ServiceCard({ item, index }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionReveal
      as="article"
      className="service-card elevation-raised"
      delay={index * 0.07}
      {...(shouldReduceMotion
        ? {}
        : {
            whileHover: { y: -3, scale: 1.01, transition: softSpring },
            whileTap: { scale: 0.995 },
          })}
    >
      <span className="service-icon" aria-hidden="true">
        <ServiceIcon icon={item.icon} />
      </span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </MotionReveal>
  );
}

export default function ServiciosMotion({ servicios }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="servicios" className="services-section" data-section="servicios" aria-labelledby="services-title">
      <div className="container services-inner">
        <header className="services-header">
          <div className="services-kicker">
            <p className="eyebrow services-eyebrow">{servicios.eyebrow}</p>
            <span className="rule-draw services-rule" aria-hidden="true" />
          </div>

          <div className="services-heading">
            <MotionReveal as="h2" id="services-title" className="services-title">
              {servicios.title}
            </MotionReveal>
            <MotionReveal as="p" className="services-lead" delay={0.08}>
              {servicios.lead}
            </MotionReveal>
          </div>

          <MotionReveal
            as="a"
            className="button button-secondary services-cta"
            href={servicios.cta.href}
            delay={0.14}
            {...(shouldReduceMotion
              ? {}
              : {
                  whileHover: { y: -2, scale: 1.01, transition: signatureSpring },
                  whileTap: { scale: 0.99 },
                })}
          >
            {servicios.cta.label}
          </MotionReveal>
        </header>

        <div className="services-grid">
          {servicios.items.map((item, index) => (
            <ServiceCard item={item} index={index} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
