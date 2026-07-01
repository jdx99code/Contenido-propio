import { Check, CircleDot } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedPipeline({ steps = [] }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || steps.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [reduceMotion, steps.length]);

  return (
    <div className="rounded-[var(--radius)] border border-border bg-background p-6 shadow-[var(--shadow-card)]">
      <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          return (
            <div className="contents" key={step.title}>
              <motion.article
                className={`relative min-h-40 rounded-xl border p-5 transition-colors duration-300 ${
                  isActive ? "border-accent/35 bg-accent/5" : "border-border bg-secondary/30"
                }`}
                animate={reduceMotion ? undefined : { y: isActive ? -4 : 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${isActive || isDone ? "bg-accent text-white" : "bg-stone-200 text-stone-500"}`}>
                    {isDone ? <Check className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-heading text-2xl font-semibold text-stone-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{step.body}</p>
              </motion.article>
              {index < steps.length - 1 && (
                <div className="hidden items-center md:flex" aria-hidden="true">
                  <div className="relative h-px w-10 bg-border">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent"
                      animate={reduceMotion ? undefined : { width: activeIndex > index ? "100%" : "0%" }}
                      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
