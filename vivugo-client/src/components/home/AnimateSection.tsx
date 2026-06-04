import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimateSection({ children, className = '', delay = 0 }: Props) {
  return (
    <section
      className={`vivugo-section-reveal ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </section>
  )
}
