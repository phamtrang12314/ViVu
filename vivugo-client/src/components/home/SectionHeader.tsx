import type { ReactNode } from 'react'

type Props = {
  badge?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function SectionHeader({ badge, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="max-w-2xl">
        {badge}
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-lg text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
