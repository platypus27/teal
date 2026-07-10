import type { ComponentType, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, HTMLAttributes, ChangeEvent } from 'react'

type AsProps = { as?: ComponentType<any> | keyof JSX.IntrinsicElements }

export function Button(props: {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
} & AsProps & ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element

export function IconButton(props: {
  children?: ReactNode
  className?: string
  title?: string
} & ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element

export function Card(props: {
  children?: ReactNode
  className?: string
  hover?: boolean
} & AsProps & HTMLAttributes<HTMLElement>): JSX.Element

export function CardHeader(props: { children?: ReactNode; className?: string }): JSX.Element
export function CardTitle(props: { children?: ReactNode; className?: string }): JSX.Element
export function CardSubtitle(props: { children?: ReactNode; className?: string }): JSX.Element

export function Badge(props: {
  children?: ReactNode
  tone?: 'high' | 'critical' | 'medium' | 'low' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  className?: string
}): JSX.Element

export function Input(props: { className?: string } & InputHTMLAttributes<HTMLInputElement>): JSX.Element
export function Select(props: { children?: ReactNode; className?: string } & SelectHTMLAttributes<HTMLSelectElement>): JSX.Element
export function TextArea(props: { className?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>): JSX.Element

export function Toggle(props: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
  icon?: string
  disabled?: boolean
  compact?: boolean
  title?: string
  className?: string
}): JSX.Element

export function Checkbox(props: {
  checked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  label?: string
  className?: string
} & InputHTMLAttributes<HTMLInputElement>): JSX.Element

export function PageHeader(props: {
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  className?: string
}): JSX.Element

export function EmptyState(props: {
  icon?: string
  title?: string
  message?: string
  className?: string
}): JSX.Element

export function LoadingState(props: { className?: string }): JSX.Element

export function Dialog(props: {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  className?: string
}): JSX.Element
export function DialogTitle(props: { children?: ReactNode; className?: string }): JSX.Element
export function DialogDescription(props: { children?: ReactNode; className?: string }): JSX.Element
export function DialogFooter(props: { children?: ReactNode; className?: string }): JSX.Element

export function Tooltip(props: {
  content: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  children?: ReactNode
  className?: string
}): JSX.Element

export function toast(
  message: ReactNode,
  opts?: { tone?: 'success' | 'error' | 'warning' | 'info' | 'neutral'; duration?: number },
): number
export function dismissToast(id: number): void
export function Toaster(): JSX.Element
