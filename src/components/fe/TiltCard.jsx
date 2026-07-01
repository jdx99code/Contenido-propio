import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const spring = { stiffness: 160, damping: 18, mass: 0.45 };

export default function TiltCard({ eyebrow, title, body, metric, meta, className = "" }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);
  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);
  const glowX = useTransform(smoothX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(smoothY, [0, 1], ["15%", "85%"]);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(230,33,23,0.09), transparent 42%)`;

  const onPointerMove = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const onPointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-[var(--radius)] border border-border bg-background p-7 shadow-[var(--shadow-card)] ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={spring}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: reduceMotion
            ? "radial-gradient(circle at 50% 50%, rgba(230,33,23,0.05), transparent 42%)"
            : glowBackground,
        }}
      />
      <div className="relative grid gap-5" style={reduceMotion ? undefined : { transform: "translateZ(34px)" }}>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>}
        {title && <h3 className="font-heading text-3xl font-semibold leading-tight text-stone-950">{title}</h3>}
        {body && <p className="text-base leading-7 text-stone-600">{body}</p>}
        {(metric || meta) && (
          <div className="flex items-end justify-between gap-4 border-t border-border pt-5">
            {metric && <strong className="font-heading text-4xl font-semibold text-success">{metric}</strong>}
            {meta && <span className="max-w-36 text-right text-sm leading-5 text-stone-500">{meta}</span>}
          </div>
        )}
      </div>
    </motion.article>
  );
}
