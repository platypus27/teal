import { useEffect } from 'react'
import { Link } from 'lucide-react'
import { CopyPageButton } from './CopyPageButton.jsx'

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
}

export function Page({
  children,
  description = undefined,
  docTitle = undefined,
  eyebrow = undefined,
  markdown = undefined,
  title,
}) {
  useEffect(() => {
    document.title = `${docTitle ?? title} - Teal`
  }, [docTitle, title])

  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            {eyebrow ? (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
            ) : null}
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">{title}</h1>
          </div>
          {markdown ? (
            <div className="shrink-0 pt-1.5">
              <CopyPageButton markdown={markdown} />
            </div>
          ) : null}
        </div>
        {description ? (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-on-surface-variant sm:text-lg">{description}</p>
        ) : null}
      </header>
      <div className="space-y-10">{children}</div>
    </article>
  )
}

export function Section({ children, description = undefined, id = undefined, title }) {
  const anchorId = id ?? slugify(title)
  return (
    <section id={anchorId} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="font-headline text-xl font-bold text-on-surface">
          <a href={`#${anchorId}`} className="group inline-flex items-center gap-2 hover:underline">
            {title}
            <Link
              aria-hidden="true"
              className="size-4 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </a>
        </h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
