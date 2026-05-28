import type { ReactNode, HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  children: ReactNode
}

const badgeColors: Record<NonNullable<BadgeProps['tone']>, string> = {
  primary: '#e94560',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
  danger: '#e94560'
}

export function Badge({ tone = 'primary', style, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 700,
        color: '#ffffff',
        background: badgeColors[tone],
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  )
}
