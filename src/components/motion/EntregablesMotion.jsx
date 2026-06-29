import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

/*
  Spring ligeramente más vivo para el micro-pop de cada check.
  Más stiffness y menos damping que signatureSpring = rebote suave
  que transmite "marcado / hecho".
*/
const checkPopSpring = {
  type: "spring",
  stiffness: 220,
  damping: 14,
  mass: 0.8,
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const checkVariants = {
  hidden: { scale: 0, rotate: -15 },
  visible: { scale: 1, rotate: 0 },
};

/* ---- Ítem individual con check animado ---- */
function CheckItem({ label, delay, shouldAnimate, isInView }) {
  const animState = !shouldAnimate || isInView ? "visible" : "hidden";

  return (
    <motion.li
      className="del-item"
      variants={itemVariants}
      initial={false}
      animate={animState}
      transition={!shouldAnimate ? reducedTransition : { ...signatureSpring, delay }}
    >
      <motion.span
        className="del-check"
        aria-hidden="true"
        variants={checkVariants}
        initial={false}
        animate={animState}
        transition={
          !shouldAnimate ? reducedTransition : { ...checkPopSpring, delay: delay + 0.04 }
        }
      >
        <svg
          viewBox="0 0 14 14"
          width="12"
          height="12"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <polyline
            points="2,7.5 5.5,11 12,3"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
      <span className="del-label">{label}</span>
    </motion.li>
  );
}

/* ---- Grupo (subtítulo + lista de ítems) ---- */
function ChecklistGroup({ group, groupDelay, shouldAnimate, isInView }) {
  return (
    <div className="del-group">
      <p className="del-group-label">{group.label}</p>
      <ul className="del-group-items" role="list">
        {group.items.map((item, i) => (
          <CheckItem
            key={item}
            label={item}
            delay={groupDelay + i * 0.07}
            shouldAnimate={shouldAnimate}
            isInView={isInView}
          />
        ))}
      </ul>
    </div>
  );
}

/* ---- Componente principal ---- */
export default function EntregablesMotion({ data }) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const rightRef = useRef(null);

  /*
    useInView sobre la columna derecha (el checklist).
    Una vez disparado, los checks se animan en secuencia escalonada.
  */
  const isInView = useInView(rightRef, { once: true, margin: "0px 0px -10% 0px" });

  /*
    BLINDAJE SSR: shouldAnimate solo es true después de montar en cliente.
    Antes del montaje, todos los elementos son visibles ("visible").
  */
  const shouldAnimate = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
    Delays base por grupo. El primer grupo empieza en 0.08s para dar
    tiempo al viewport trigger; cada grupo siguiente suma ~0.2s.
  */
  const groupDelays = [0.08, 0.28, 0.48];

  return (
    <section
      className="del-section"
      data-section="entregables"
      aria-label={data.eyebrow}
    >
      <div className="container del-grid">
        {/* Columna izquierda — mensaje */}
        <div className="del-message">
          <MotionReveal className="del-kicker" delay={0}>
            <span className="eyebrow">{data.eyebrow}</span>
            <span className="rule-draw" aria-hidden="true" />
          </MotionReveal>

          <MotionReveal as="h2" className="del-title" delay={0.12}>
            {data.title}
          </MotionReveal>

          <MotionReveal as="p" className="del-lead" delay={0.2}>
            {data.lead}
          </MotionReveal>

          <MotionReveal className="del-cta-wrap" delay={0.28}>
            <motion.a
              href={data.cta.href}
              className="button button-primary del-cta"
              {...(!shouldReduceMotion && {
                whileHover: { y: -2, scale: 1.015, transition: softSpring },
                whileTap: { scale: 0.97 },
              })}
            >
              {data.cta.label}
            </motion.a>
          </MotionReveal>
        </div>

        {/* Columna derecha — checklist agrupado */}
        <div className="del-checklist" ref={rightRef}>
          {data.groups.map((group, gi) => (
            <ChecklistGroup
              key={group.label}
              group={group}
              groupDelay={groupDelays[gi]}
              shouldAnimate={shouldAnimate}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
