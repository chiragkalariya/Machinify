import type { ReactNode, HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, style, className, ...props }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#ffffff',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 24px 50px rgba(15, 23, 42, 0.04)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
