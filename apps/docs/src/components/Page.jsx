export function Page({ children, description = undefined, eyebrow = undefined, title }) {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="mb-10 max-w-3xl">
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-base leading-relaxed text-on-surface-variant sm:text-lg">{description}</p> : null}
      </header>
      <div className="space-y-10">{children}</div>
    </article>
  )
}

export function Section({ children, description = undefined, title }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-headline text-xl font-bold text-on-surface">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
