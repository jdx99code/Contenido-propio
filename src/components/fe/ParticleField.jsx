import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function createParticles(count) {
  return Array.from({ length: count }, (_, index) => {
    const x = (index * 37) % 100;
    const y = (index * 61) % 100;
    const size = 2 + (index % 4);
    const duration = 5.5 + (index % 7) * 0.45;
    const delay = (index % 9) * 0.18;
    return { id: index, x, y, size, duration, delay };
  });
}

export default function ParticleField({ count = 38, label, className = "", variant = "contained" }) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(() => createParticles(count), [count]);
  const isAmbient = variant === "ambient";

  return (
    <div
      className={
        isAmbient
          ? `pointer-events-none absolute inset-0 overflow-hidden ${className}`
          : `relative min-h-72 overflow-hidden rounded-[var(--radius)] border border-border bg-secondary/35 ${className}`
      }
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(120,113,108,0.16),transparent_38rem)]" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          aria-hidden="true"
          className="absolute rounded-full bg-stone-500/25"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -18, 0],
                  x: [0, particle.id % 2 ? 8 : -8, 0],
                  opacity: [0.18, 0.42, 0.18],
                  scale: [1, 1.35, 1],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
      {label && !isAmbient && (
        <div className="absolute inset-x-6 bottom-6 rounded-lg border border-border/70 bg-background/75 p-4 text-sm font-medium text-stone-600 backdrop-blur-md">
          {label}
        </div>
      )}
    </div>
  );
}
