export function Page({ title, description, children }) {
  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">{description}</p>}
      </header>
      <div className="space-y-10">{children}</div>
    </article>
  )
}

export function Section({ title, children }) {
  return (
    <section className="space-y-4">
      {title && <h2 className="font-headline text-xl font-bold text-on-surface">{title}</h2>}
      {children}
    </section>
  )
}
