import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { signatureSpring, softSpring, reducedTransition } from "./motionConfig";

export default function HeroMotion({ hero }) {
  const shouldReduceMotion = useReducedMotion();
  const visualRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start end", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const badgeUpY = useTransform(scrollYProgress, [0, 1], [6, -10]);
  const badgeDownY = useTransform(scrollYProgress, [0, 1], [-4, 8]);

  const spring = shouldReduceMotion ? reducedTransition : signatureSpring;
  const hoverProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -2, scale: 1.012 },
        whileTap: { scale: 0.985 },
        transition: softSpring,
      };

  return (
    <section className="hero-section" data-section="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <p className="eyebrow hero-eyebrow">{hero.eyebrow}</p>
            <motion.span
              className="rule-draw hero-motion-rule"
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.08 }}
            />
          </motion.div>

          <h1 id="hero-title" className="hero-title">
            {[hero.title.primary, hero.title.secondary].map((line, index) => (
              <span className="hero-title-line" key={line}>
                <motion.span
                  className={index === 1 ? "hero-title-warm" : undefined}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { y: "110%", opacity: 0, clipPath: "inset(0 0 100% 0)", filter: "blur(10px)" }
                  }
                  animate={{ y: "0%", opacity: 1, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" }}
                  transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.14 + index * 0.08 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="lead hero-lead"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.34 }}
          >
            {hero.lead}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={shouldReduceMotion ? false : "hidden"}
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.44 } },
            }}
          >
            {[hero.primaryCta, hero.secondaryCta].map((cta, index) => (
              <motion.a
                className={`button ${index === 0 ? "button-primary" : "button-secondary"}`}
                href={cta.href}
                key={cta.label}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: spring },
                }}
                {...hoverProps}
              >
                {cta.label}
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="social-proof"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.56 }}
          >
            <div className="avatar-stack" aria-hidden="true">
              {hero.socialProof.avatars.map((avatar, index) => (
                <span className="avatar" style={{ "--avatar-index": index }} key={avatar}>
                  {avatar}
                </span>
              ))}
            </div>
            <p>{hero.socialProof.text}</p>
          </motion.div>
        </div>

        <div className="hero-visual" ref={visualRef}>
          <motion.aside
            className="floating-badge badge-growth"
            style={{ y: shouldReduceMotion ? 0 : badgeUpY }}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.82 }}
          >
            <span className="badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M4 16.5l5.2-5.2 3.3 3.3L20 7.1" />
                <path d="M15 7h5v5" />
              </svg>
            </span>
            <span>{hero.dashboard.badges.growth}</span>
          </motion.aside>

          <motion.article
            className="channel-card card"
            aria-label={hero.dashboard.channel.name}
            style={{ y: shouldReduceMotion ? 0 : cardY }}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 36, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.62 }}
            {...(shouldReduceMotion
              ? {}
              : {
                  whileHover: { y: -4, scale: 1.006 },
                  transition: softSpring,
                })}
          >
            <header className="channel-header">
              <div className="channel-identity">
                <span className="play-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M9 7.5v9l7-4.5-7-4.5Z" />
                  </svg>
                </span>
                <div>
                  <h2>{hero.dashboard.channel.name}</h2>
                  <p>{hero.dashboard.channel.meta}</p>
                </div>
              </div>
              <span className="status-pill">{hero.dashboard.channel.status}</span>
            </header>

            <div className="video-list">
              {hero.dashboard.videos.map((video, index) => (
                <article className="video-item" key={video.title}>
                  <div className="video-thumb" style={{ "--thumb-index": index }} aria-hidden="true">
                    <span />
                  </div>
                  <div className="video-copy">
                    <h3>{video.title}</h3>
                    <p>{video.meta}</p>
                  </div>
                  <span className="check-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img">
                      <path d="M5 12.5l4.2 4.2L19 7" />
                    </svg>
                  </span>
                </article>
              ))}
            </div>

            <footer className="dashboard-stats">
              {hero.dashboard.stats.map((stat) => (
                <div key={stat.value}>
                  <strong>{stat.value}</strong>
                  {stat.label && <span>{stat.label}</span>}
                </div>
              ))}
            </footer>
          </motion.article>

          <motion.aside
            className="floating-badge badge-time"
            style={{ y: shouldReduceMotion ? 0 : badgeDownY }}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay: 0.92 }}
          >
            <span className="badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M12 6v6l3.5 2" />
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
              </svg>
            </span>
            <span>{hero.dashboard.badges.time}</span>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
