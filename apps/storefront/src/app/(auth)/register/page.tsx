'use client'

import { useState } from 'react'
import { Button, Input } from '@bizflow/ui'

const benefits = [
  { icon: '🎁', title: '₹200 welcome coupon on first order' },
  { icon: '❤️', title: 'Save products to wishlist anytime' },
  { icon: '📦', title: 'Track all your orders in one place' },
  { icon: '🔔', title: 'Early access to sales & new arrivals' },
]

export default function SignUpPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const strength = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)]

  return (
    <div className="auth-shell">
      <aside className="left-panel">
        <div>
          <div className="logo-row">
            <div className="logo-badge">S</div>
            <div className="logo-title">ShopElite</div>
          </div>

          <h1 className="hero-title">
            Join <span className="accent">50,000+</span> happy shoppers
          </h1>
          <p className="hero-copy">Create your free account and unlock exclusive deals, faster checkout, and personalised recommendations.</p>

          <div className="feature-list">
            {benefits.map((item) => (
              <div key={item.title} className="feature-item">
                <div className="feature-icon">{item.icon}</div>
                <div className="feature-copy">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="right-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">S</div>
            <div>
              <div className="auth-logo-title">ShopElite</div>
              <div className="auth-logo-subtitle">Admin signup</div>
            </div>
          </div>

          <h2 className="auth-heading">Create your manager account</h2>
          <p className="auth-copy">Get secure access to your shop dashboard, manage inventory, and track orders with one account.</p>

          <div className="field-group split-fields">
            <Input startIcon="👤" placeholder="First name" aria-label="First name" />
            <Input startIcon="👤" placeholder="Last name" aria-label="Last name" />
          </div>

          <div className="field-group">
            <Input
              type="email"
              placeholder="you@example.com"
              startIcon="✉️"
              aria-label="Email address"
            />
            <Input
              type="tel"
              placeholder="+91 9876543210"
              startIcon="📞"
              aria-label="Phone number"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              startIcon="🔒"
              endIcon={showPassword ? '🙈' : '👁️'}
              onEndIconClick={() => setShowPassword((value) => !value)}
              aria-label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="password-strength">
            {strength.map((active, index) => (
              <span key={index} className={active ? 'active' : ''} />
            ))}
          </div>
          <p className="form-note">Medium strength — add symbols to strengthen</p>

          <div className="field-group">
            <Input
              type="text"
              placeholder="I'm shopping for"
              startIcon="🛍️"
              aria-label="Shopping for"
            />
            <select className="select-input" aria-label="Shopping for">
              <option>Personal use</option>
              <option>Business</option>
              <option>Gift for someone</option>
            </select>
          </div>

          <label className="checkbox-row checkbox-block">
            <input type="checkbox" />
            I agree to the <a className="link-primary" href="#">Terms of Service</a> and <a className="link-primary" href="#">Privacy Policy</a>. I&apos;m happy to receive offers by email.
          </label>

          <Button fullWidth className="auth-submit">Create free account</Button>

          <div className="divider">or sign up with</div>

          <div className="social-row">
            <Button variant="secondary" fullWidth className="social-button">
              <span>G</span>
              Google
            </Button>
            <Button variant="secondary" fullWidth className="social-button">
              <span>f</span>
              Facebook
            </Button>
            <Button variant="secondary" fullWidth className="social-button">
              <span></span>
              Apple
            </Button>
          </div>

          <p className="auth-footer">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </main>
    </div>
  )
}
