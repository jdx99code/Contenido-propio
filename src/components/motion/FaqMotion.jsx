import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

/*
  ESTRATEGIA DE BLINDAJE DEL ACORDEÓN
  ─────────────────────────────────────
  • Base semántica: <details>/<summary> — funciona sin JS, legible por SEO,
    navegable por teclado sin ningún script.
  • Encima, React toma el control para animar la altura con Framer Motion.
  • `ready`: se activa en el primer requestAnimationFrame tras el montaje,
    evitando que la animación "cierre" visible al hidratarse.
  • `hasInteracted`: habilita el spring SOLO después de la primera acción
    del usuario — el snap inicial siempre es instantáneo (duration: 0).

  ANIMACIONES DE ESTILO:
  • Número editorial (01–08) en Fraunces — columna fija izquierda.
  • Barra de acento roja (2 px) que se dibuja desde arriba al abrir (scaleY 0→1).
  • Capa de fondo cálida que aparece con fade al abrir el ítem.
*/

function FaqItem({ item, index, shouldAnimate, isInView }) {
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Animación de contenido: spring solo tras interacción y si motion OK */
  const canAnimate = ready && !shouldReduceMotion;
  const contentTransition =
    !canAnimate || !hasInteracted ? { duration: 0 } : signatureSpring;
  const iconTransition = canAnimate ? softSpring : { duration: 0 };

  const toggle = (e) => {
    if (ready) {
      e.preventDefault(); /* desactiva el toggle nativo cuando React manda */
      if (!hasInteracted) setHasInteracted(true);
      setIsOpen((prev) => !prev);
    }
    /* sin ready: el <details> nativo funciona por su cuenta */
  };

  /* Reveal de la fila en cascada */
  const rowDelay = 0.08 + index * 0.055;
  const rowAnimState = !shouldAnimate || isInView ? "visible" : "hidden";

  /* Número editorial: "01", "02" … "08" */
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      className={`faq-item${isOpen ? " is-open" : ""}`}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      initial={false}
      animate={rowAnimState}
      transition={
        !shouldAnimate ? reducedTransition : { ...signatureSpring, delay: rowDelay }
      }
      {...(canAnimate
        ? { whileHover: { x: 3, transition: softSpring } }
        : {})}
    >
      {/* ── Capa de fondo: fade suave al abrir ───────────────── */}
      <motion.span
        className="faq-item-bg"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={contentTransition}
      />

      {/* ── Barra de acento: se dibuja de arriba a abajo ─────── */}
      <motion.span
        className="faq-accent-bar"
        aria-hidden="true"
        initial={false}
        animate={{
          scaleY: isOpen ? 1 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        style={{ transformOrigin: "top center" }}
        transition={contentTransition}
      />

      {/*
        <details open={...}>
        — SSR / antes de ready: sin atributo `open` → cerrado por defecto.
        — Tras ready: controlado por estado React.
        React convierte open={false} en ausencia de atributo (boolean HTML).
      */}
      <details open={ready ? isOpen : undefined}>
        <summary
          className="faq-summary"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={`faq-body-${index}`}
        >
          {/* Número editorial — columna fija izquierda */}
          <span className="faq-num" aria-hidden="true">
            {numStr}
          </span>

          <span className="faq-question-text">{item.question}</span>

          {/* Indicador +/× — rojo acento SOLO cuando está abierto */}
          <motion.span
            className="faq-icon"
            aria-hidden="true"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={iconTransition}
          >
            +
          </motion.span>
        </summary>

        {/*
          Cuerpo del acordeón:
          — SSR / antes de ready (animate={false}): div sin estilos inline →
            contenido visible en flujo normal → SEO ✓ + no-JS ✓.
          — Tras ready: height 0↔auto + opacity con spring o snap instantáneo.
        */}
        <motion.div
          id={`faq-body-${index}`}
          className="faq-body"
          role="region"
          aria-labelledby={undefined}
          initial={false}
          animate={
            ready
              ? {
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }
              : false
          }
          transition={contentTransition}
          style={ready ? { overflow: "hidden" } : undefined}
        >
          <p className="faq-answer-text">{item.answer}</p>
        </motion.div>
      </details>
    </motion.li>
  );
}

/* ---- Componente principal ---- */
export default function FaqMotion({ data }) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const shouldAnimate = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="faq-section"
      data-section="faq"
      aria-label={data.eyebrow}
      ref={ref}
    >
      <div className="container faq-inner">
        {/* Cabecera */}
        <div className="faq-header">
          <MotionReveal className="faq-kicker" delay={0}>
            <span className="eyebrow">{data.eyebrow}</span>
            <span className="rule-draw" aria-hidden="true" />
          </MotionReveal>

          <MotionReveal as="h2" className="faq-title" delay={0.1}>
            {data.title}
          </MotionReveal>
        </div>

        {/* Acordeón */}
        <ul className="faq-list" role="list">
          {data.items.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              index={i}
              shouldAnimate={shouldAnimate}
              isInView={isInView}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
