'use client'

import { useState } from 'react'
import { Button, Input } from '@bizflow/ui'

const features = [
  { icon: '🚚', text: 'Free shipping on orders above ₹999' },
  { icon: '🛡️', text: 'Secure payments & easy returns' },
  { icon: '⭐', text: '4.9/5 rating from verified buyers' },
]

export default function SignInPage() {
  const [tab, setTab] = useState<'customer' | 'admin'>('customer')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="auth-shell">
      <aside className="left-panel">
        <div>
          <div className="logo-row">
            <div className="logo-badge">S</div>
            <div className="logo-title">ShopElite</div>
          </div>

          <h1 className="hero-title">
            Shop <span className="accent">premium</span> products you&apos;ll love
          </h1>
          <p className="hero-copy">
            50,000+ happy customers trust us for quality, speed, and great prices.
          </p>

          <div className="feature-list">
            {features.map((item) => (
              <div key={item.text} className="feature-item">
                <div className="feature-icon">{item.icon}</div>
                <div className="feature-copy">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-chip">
            <div className="value">50K+</div>
            <div className="label">Customers</div>
          </div>
          <div className="stat-chip">
            <div className="value">10K+</div>
            <div className="label">Products</div>
          </div>
          <div className="stat-chip">
            <div className="value">4.9★</div>
            <div className="label">Rating</div>
          </div>
        </div>
      </aside>

      <main className="right-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">S</div>
            <div>
              <div className="auth-logo-title">ShopElite</div>
              <div className="auth-logo-subtitle">Customer login</div>
            </div>
          </div>

          <h2 className="auth-heading">Sign in to your ShopElite account</h2>
          <p className="auth-copy">Access your orders, wishlist, and fast checkout from one secure account.</p>

          <div className="switcher">
            <button className={tab === 'customer' ? 'active' : ''} onClick={() => setTab('customer')}>
              Customer
            </button>
            <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>
              Admin
            </button>
          </div>

          <div className="field-group auth-form">
            <Input
              type="email"
              placeholder="you@example.com"
              startIcon="✉️"
              aria-label="Email address"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              startIcon="🔒"
              endIcon={showPassword ? '🙈' : '👁️'}
              onEndIconClick={() => setShowPassword((value) => !value)}
              aria-label="Password"
            />
          </div>

          <div className="row-between">
            <label className="checkbox-row">
              <input type="checkbox" /> Remember me
            </label>
            <a className="link-primary" href="#">
              Forgot password?
            </a>
          </div>

          <Button fullWidth className="auth-submit">Sign in</Button>

          <div className="divider">or continue with</div>

          <div className="social-row">
            <Button variant="secondary" fullWidth className="social-button">
              <span>G</span>
              Google
            </Button>
            <Button variant="secondary" fullWidth className="social-button">
              <span>f</span>
              Facebook
            </Button>
          </div>

          <p className="auth-footer">
            Don&apos;t have an account? <a href="/register">Create one free</a>
          </p>
        </div>
      </main>
    </div>
  )
}
