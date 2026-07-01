import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NavBar({
  logoAlt = "",
  links = [],
  cta,
  menuLabel = "Menu",
  closeLabel = "Close",
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-background/86 shadow-sm backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-20 items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-3 no-underline" aria-label={logoAlt}>
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="font-heading text-2xl font-semibold text-stone-950">{logoAlt}</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-stone-600 no-underline transition-colors hover:text-accent">
              {link.label}
            </a>
          ))}
        </div>

        {cta && (
          <a href={cta.href || "/aplicar"} className="hidden rounded-[var(--radius)] border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground no-underline transition hover:bg-stone-800 md:inline-flex">
            {cta.label}
          </a>
        )}

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-[var(--radius)] border border-border bg-background md:hidden"
          aria-label={open ? closeLabel : menuLabel}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t border-border bg-background/96 backdrop-blur-xl md:hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-page grid gap-2 py-4">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-base font-medium text-stone-700 no-underline hover:bg-secondary hover:text-accent" onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              {cta && (
                <a href={cta.href || "/aplicar"} className="mt-2 rounded-[var(--radius)] border border-primary bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground no-underline" onClick={() => setOpen(false)}>
                  {cta.label}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
