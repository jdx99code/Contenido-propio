import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

/*
  Spring más vivo para el micro-pop del check — mismo que Entregables.
  Más stiffness = rebote breve que transmite "marcado / sí, ese soy yo".
*/
const checkPopSpring = {
  type: "spring",
  stiffness: 220,
  damping: 14,
  mass: 0.8,
};

/* SVG check verde (fit items) */
function CheckIcon() {
  return (
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
  );
}

/* SVG X atenuado (notFit items) */
function XIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="11"
      height="11"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="3" y1="3" x2="11" y2="11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="11" y1="3" x2="3" y2="11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---- Ítem "es para ti" con check animado ---- */
function FitItem({ text, index, shouldAnimate, isInView }) {
  const delay = 0.06 + index * 0.09;
  const animState = !shouldAnimate || isInView ? "visible" : "hidden";

  return (
    <motion.li
      className="pq-fit-item"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      initial={false}
      animate={animState}
      transition={!shouldAnimate ? reducedTransition : { ...signatureSpring, delay }}
      {...(!shouldAnimate
        ? {}
        : {
            whileHover: { y: -3, transition: softSpring },
            whileTap: { scale: 0.99 },
          })}
    >
      <motion.span
        className="pq-check"
        aria-hidden="true"
        variants={{
          hidden: { scale: 0, rotate: -15 },
          visible: { scale: 1, rotate: 0 },
        }}
        initial={false}
        animate={animState}
        transition={
          !shouldAnimate
            ? reducedTransition
            : { ...checkPopSpring, delay: delay + 0.05 }
        }
      >
        <CheckIcon />
      </motion.span>
      <span className="pq-fit-text">{text}</span>
    </motion.li>
  );
}

/* ---- Ítem "no es para ti" (discreto, sin pop) ---- */
function NotFitItem({ text, index, shouldAnimate, isInView }) {
  /*
    Entra después de que termina la cascada de los fit items
    (base delay ~0.65s) de forma suave y sin protagonismo.
  */
  const delay = 0.65 + index * 0.08;
  const animState = !shouldAnimate || isInView ? "visible" : "hidden";

  return (
    <motion.li
      className="pq-notfit-item"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      initial={false}
      animate={animState}
      transition={!shouldAnimate ? reducedTransition : { ...signatureSpring, delay }}
    >
      <span className="pq-x-icon" aria-hidden="true">
        <XIcon />
      </span>
      <span className="pq-notfit-text">{text}</span>
    </motion.li>
  );
}

/* ---- Componente principal ---- */
export default function ParaQuienMotion({ data }) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  /*
    Un único useInView sobre el contenedor principal.
    Todos los ítems usan este trigger + sus propios delays para
    construir el efecto "sí… sí… ese soy yo" acumulativo.
  */
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -8% 0px",
  });

  /*
    BLINDAJE SSR: shouldAnimate solo es true después de montar.
    Antes del montaje todos los elementos son visibles.
  */
  const shouldAnimate = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="pq-section"
      data-section="para-quien"
      aria-label={data.eyebrow}
      ref={sectionRef}
    >
      <div className="container pq-inner">
        {/* ---- Cabecera ---- */}
        <div className="pq-header">
          <MotionReveal className="pq-kicker" delay={0}>
            <span className="eyebrow">{data.eyebrow}</span>
            <span className="rule-draw" aria-hidden="true" />
          </MotionReveal>

          <MotionReveal as="h2" className="pq-title" delay={0.1}>
            {data.title}
          </MotionReveal>

          <MotionReveal as="p" className="pq-lead" delay={0.18}>
            {data.lead}
          </MotionReveal>
        </div>

        {/* ---- Bloque ES PARA TI — 6 ítems en cascada ---- */}
        <ul className="pq-fit-list" role="list" aria-label="Es para ti si">
          {data.fit.map((text, i) => (
            <FitItem
              key={i}
              text={text}
              index={i}
              shouldAnimate={shouldAnimate}
              isInView={isInView}
            />
          ))}
        </ul>

        {/* ---- Bloque NO ES PARA TI — secundario ---- */}
        <div className="pq-notfit-block">
          <MotionReveal as="p" className="pq-notfit-title" delay={0.62}>
            {data.notFit.title}
          </MotionReveal>

          <ul className="pq-notfit-list" role="list" aria-label="No es para ti si">
            {data.notFit.items.map((text, i) => (
              <NotFitItem
                key={i}
                text={text}
                index={i}
                shouldAnimate={shouldAnimate}
                isInView={isInView}
              />
            ))}
          </ul>

          <MotionReveal as="p" className="pq-closing" delay={0.9}>
            {data.notFit.closing}
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
