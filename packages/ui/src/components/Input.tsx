import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  onEndIconClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function Input({
  label,
  helperText,
  startIcon,
  endIcon,
  onEndIconClick,
  style,
  className,
  ...props
}: InputProps) {
  return (
    <label style={{ display: 'grid', gap: 6, width: '100%' }} className={className}>
      {label ? (
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
      ) : null}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {startIcon ? (
          <span style={{ position: 'absolute', left: 14, color: '#9ca3af', display: 'inline-flex' }}>{startIcon}</span>
        ) : null}
        <input
          style={{
            width: '100%',
            borderRadius: 12,
            border: '1px solid #d1d5db',
            padding: startIcon ? '14px 14px 14px 44px' : '14px',
            paddingRight: endIcon ? '44px' : undefined,
            fontSize: 14,
            color: '#0f172a',
            outline: 'none',
            transition: 'all 200ms ease',
            ...style
          }}
          {...props}
        />
        {endIcon ? (
          <button
            type="button"
            onClick={onEndIconClick}
            style={{
              position: 'absolute',
              right: 10,
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {endIcon}
          </button>
        ) : null}
      </div>
      {helperText ? (
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{helperText}</span>
      ) : null}
    </label>
  )
}
