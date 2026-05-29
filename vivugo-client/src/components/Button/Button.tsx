import { Link, type LinkProps } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// Định nghĩa các kiểu style (Nâng cấp Premium)
const variants = {
  solid:
    'bg-white/36 backdrop-blur-xl border border-white/60 text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_24px_rgba(37,99,235,0.18)] hover:bg-white/52 hover:border-white/80',
  outline:
    'bg-white/42 backdrop-blur-xl border border-white/70 text-slate-700 hover:text-blue-700 hover:bg-white/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_22px_rgba(15,23,42,0.08)]',
  ghost: 'bg-white/12 backdrop-blur-xl border border-white/25 text-blue-600 hover:bg-white/24'
}

// Định nghĩa các props cơ bản
interface BaseProps {
  children: ReactNode
  className?: string
  variant?: keyof typeof variants
}

// Props cho thẻ <button>
type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
  }

// Props cho thẻ <Link>
type LinkButtonProps = BaseProps &
  LinkProps & {
    as: 'link'
  }

// Gộp 2 loại props
type Props = ButtonProps | LinkButtonProps

export default function Button(props: Props) {
  const { variant = 'solid', className = '', children } = props

  // Hiệu ứng chung: Bo góc lớn, hiệu ứng nhún khi click (active:scale-95)
  const baseStyle =
    'font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

  const variantStyle = variants[variant]
  const combinedClassName = `${baseStyle} ${variantStyle} ${className}`

  if (props.as === 'link') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      as: _as,
      variant: _variant,
      className: _className,
      children: _children,
      ...restLinkProps
    } = props
    return (
      <Link className={combinedClassName} {...restLinkProps}>
        {children}
      </Link>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    as: _as,
    variant: _variant,
    className: _className,
    children: _children,
    ...restButtonProps
  } = props
  return (
    <button className={combinedClassName} {...restButtonProps}>
      {children}
    </button>
  )
}

