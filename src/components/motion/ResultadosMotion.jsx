import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import MotionReveal from "./MotionReveal";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

const ruleVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

function formatNumber(value, options) {
  const fixed = value.toFixed(options.decimals);
  const [integerPart, decimalPart] = fixed.split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, options.thousands);
  const decimal = options.decimals > 0 ? `${options.decimal}${decimalPart}` : "";
  return `${options.prefix}${grouped}${decimal}${options.suffix}`;
}

function CountUp({ metric, active }) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(metric.value);

  useEffect(() => {
    if (!active || shouldReduceMotion) {
      setValue(metric.value);
      return;
    }

    let frame = 0;
    const target = Number(metric.count.target);
    const options = {
      decimals: Number(metric.count.decimals),
      prefix: metric.count.prefix,
      suffix: metric.count.suffix,
      decimal: metric.count.decimalSeparator,
      thousands: metric.count.thousandsSeparator,
    };
    const duration = 1150;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(formatNumber(target * eased, options));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setValue(metric.value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, metric, shouldReduceMotion]);

  return <>{value}</>;
}

function ResultCard({ metric, index }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <MotionReveal
      as="article"
      ref={ref}
      className="result-card elevation-floating"
      delay={index * 0.08}
      style={{ "--stagger": `${index * 90}ms` }}
      {...(shouldReduceMotion
        ? {}
        : {
            whileHover: { y: -4, scale: 1.008, transition: softSpring },
            whileTap: { scale: 0.992 },
          })}
    >
      <div className="result-number-row">
        <strong className="result-number">
          <CountUp metric={metric} active={inView} />
        </strong>
        <span className="result-delta">{metric.delta}</span>
      </div>
      <p>{metric.label}</p>
    </MotionReveal>
  );
}

export default function ResultadosMotion({ resultados }) {
  const ruleRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const ruleInView = useInView(ruleRef, { once: true, margin: "0px 0px -10% 0px" });
  const shouldAnimate = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="results-section surface-alt" data-section="resultados" aria-labelledby="results-eyebrow">
      <div className="container results-inner">
        <header className="results-header">
          <MotionReveal
            as="p"
            id="results-eyebrow"
            className="eyebrow results-eyebrow"
          >
            {resultados.eyebrow}
          </MotionReveal>
          <motion.span
            ref={ruleRef}
            className="rule-draw results-rule"
            aria-hidden="true"
            variants={ruleVariants}
            initial={false}
            animate={!shouldAnimate || ruleInView ? "visible" : "hidden"}
            transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.08 }}
          />
        </header>

        {/*
          Slot preparado para una captura REAL de YouTube Studio.
          Cuando exista la imagen, insertar aqui un marco limpio con className="studio-frame elevation-overlay".
          No usar replicas falsas de la interfaz.
        */}

        <div className="results-grid" data-results-grid>
          {resultados.metrics.map((metric, index) => (
            <ResultCard metric={metric} index={index} key={metric.label} />
          ))}
        </div>

        <MotionReveal as="p" className="results-note" delay={0.18}>
          {resultados.note}
        </MotionReveal>
      </div>
    </section>
  );
}
