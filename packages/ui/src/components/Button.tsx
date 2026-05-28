import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  icon?: ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#e94560',
    color: '#ffffff',
    border: '1px solid transparent'
  },
  secondary: {
    background: '#f8fafc',
    color: '#0f172a',
    border: '1px solid #d1d5db'
  },
  ghost: {
    background: 'transparent',
    color: '#0f172a',
    border: '1px solid transparent'
  },
  danger: {
    background: '#e94560',
    color: '#ffffff',
    border: '1px solid transparent'
  }
}

export function Button({
  variant = 'primary',
  fullWidth,
  icon,
  children,
  style,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '12px 18px',
        borderRadius: 999,
        fontWeight: 500,
        letterSpacing: '0.01em',
        transition: 'all 200ms ease',
        cursor: 'pointer',
        width: fullWidth ? '100%' : undefined,
        ...variantStyles[variant],
        ...style
      }}
      {...props}
    >
      {icon ? <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span> : null}
      {children}
    </button>
  )
}
