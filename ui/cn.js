import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes so the LAST conflicting utility wins.
// Lets consumers override a component's defaults via `className` safely.
export const cn = (...inputs) => twMerge(clsx(inputs))
