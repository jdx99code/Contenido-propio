import { Play, TrendingUp, Video } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const bars = [34, 58, 42, 74, 46, 66, 38, 82, 54, 62, 44, 70];

export default function PremiumHeroVisual({ title, subtitle, metricLabel, metricValue, badge, stats = [] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-xl"
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-stone-500/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-8 top-8 h-40 w-40 rounded-full bg-accent/[0.045] blur-3xl" />
      <article className="relative overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-card-hover)]">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <div>
              <h3 className="font-heading text-2xl font-semibold text-stone-950">{title}</h3>
              <p className="text-sm text-stone-500">{subtitle}</p>
            </div>
          </div>
          {badge && <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-bold text-accent">{badge}</span>}
        </div>

        <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-xl border border-border bg-stone-950 p-4 text-background">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-stone-800 to-stone-950 p-4">
              <div className="grid h-full place-items-center rounded-md border border-white/10 bg-white/[0.03]">
                <motion.div
                  className="grid h-16 w-16 place-items-center rounded-full bg-accent text-white shadow-[0_18px_44px_rgba(230,33,23,0.25)]"
                  animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                  transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </motion.div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-stone-400">{metricLabel}</p>
                <p className="mt-1 font-heading text-4xl font-semibold text-success">{metricValue}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border border-border bg-secondary/45 p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Video className="h-4 w-4 text-accent" />
                <span>{stats[0]?.label}</span>
              </div>
              <div className="flex h-24 items-end gap-2">
                {bars.map((height, index) => (
                  <motion.span
                    key={height + index}
                    className={`flex-1 rounded-t-sm ${index === 7 ? "bg-success" : "bg-stone-300"}`}
                    style={{ height: `${height}%` }}
                    animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
                    transition={reduceMotion ? undefined : { duration: 2 + index * 0.08, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
            {stats.slice(1).map((stat) => (
              <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4" key={stat.label}>
                <span className="text-sm text-stone-500">{stat.label}</span>
                <strong className="text-base font-bold text-success">{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
