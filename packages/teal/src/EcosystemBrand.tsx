import type { ReactNode } from 'react'
import { KRYV_MARK_DATA_URI, KRYV_WORDMARK_TAIL_DATA_URI } from './brand-assets'

export interface EcosystemBrandProps {
  /** Accessible name announced for the mark image; the wordmark tail is decorative. */
  alt?: string
}

/**
 * The default ecosystem brand: the Kryv "k" mark with the "ryv" wordmark tail
 * that reveals beside it when the rail expands on hover or focus (the
 * production Home rail treatment, promoted to the ecosystem standard in
 * ADR-0008). EcosystemShell renders this when no brand prop is given. The
 * artwork ships inlined, so consumers need no asset plumbing; pass the shell's
 * brand prop to replace it entirely.
 */
export function EcosystemBrand({ alt = 'Kryv' }: EcosystemBrandProps): ReactNode {
  return (
    <>
      <img className="ecosystem-brand__mark" src={KRYV_MARK_DATA_URI} alt={alt} />
      <span className="ecosystem-brand__reveal" aria-hidden="true">
        <img className="ecosystem-brand__wordmark" src={KRYV_WORDMARK_TAIL_DATA_URI} alt="" />
      </span>
    </>
  )
}
