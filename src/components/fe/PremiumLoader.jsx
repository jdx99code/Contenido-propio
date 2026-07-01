import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumLoader({ active = true, label, duration = 900 }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!active) return undefined;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [active, duration]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-stone-950 text-background"
          initial={reduceMotion ? false : { opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="grid min-w-64 gap-5 text-center">
            <img src="/logo.svg" alt="" className="mx-auto h-12 w-12 invert" />
            {label && <p className="text-sm font-semibold tracking-[0.18em] text-stone-300 uppercase">{label}</p>}
            <div className="h-px overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-accent"
                animate={reduceMotion ? { x: "0%" } : { x: ["-100%", "120%"] }}
                transition={reduceMotion ? undefined : { duration: 1.15, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
