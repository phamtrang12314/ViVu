import { Link, type LinkProps } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// Định nghĩa các kiểu style (Nâng cấp Premium)
const variants = {
  solid:
    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] border border-transparent',
  outline:
    'bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 shadow-sm',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50'
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

