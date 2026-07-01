export default function Footer({ logoAlt = "", columns = [], legal = [], copyright }) {
  return (
    <footer className="border-t border-border bg-stone-950 py-14 text-background">
      <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="grid content-start gap-5">
          <a href="/" className="flex items-center gap-3 no-underline">
            <img src="/logo.svg" alt="" className="h-10 w-10 invert" />
            <span className="font-heading text-2xl font-semibold">{logoAlt}</span>
          </a>
          {copyright && <p className="max-w-sm text-sm leading-6 text-stone-400">{copyright}</p>}
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-300">{column.title}</h3>
              <ul className="grid gap-3">
                {column.links?.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-stone-400 no-underline transition hover:text-accent">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {legal.length > 0 && (
        <div className="container-page mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-6">
          {legal.map((link) => (
            <a href={link.href} key={link.href} className="text-xs text-stone-500 no-underline transition hover:text-accent">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
