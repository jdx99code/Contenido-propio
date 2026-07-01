import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const spring = { stiffness: 180, damping: 16, mass: 0.35 };

export default function MagneticButton({
  href = "#",
  label,
  variant = "primary",
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const classes =
    variant === "inverse"
      ? "border-background bg-background text-stone-950 hover:bg-stone-200"
      : variant === "secondary"
        ? "border-stone-300 bg-transparent text-stone-950 hover:border-accent/30 hover:bg-stone-950/5"
        : "border-primary bg-primary text-primary-foreground hover:bg-stone-800";

  const onPointerMove = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border px-5 py-3 text-sm font-semibold no-underline shadow-sm transition-colors duration-200 ${classes} ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduceMotion ? undefined : { x, y }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </motion.a>
  );
}
