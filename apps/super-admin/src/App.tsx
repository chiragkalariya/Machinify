import { useState } from 'react'
import { Button, Input } from '@bizflow/ui'

const API_URL = (() => {
  if (!import.meta.env.VITE_SUPER_ADMIN_API_URL) {
    throw new Error('VITE_SUPER_ADMIN_API_URL is required for super admin API calls.')
  }
  return import.meta.env.VITE_SUPER_ADMIN_API_URL
})()

type DashboardMetric = {
  label: string
  value: string
  detail: string
}

type DashboardActivity = {
  user: string
  action: string
  time: string
}

type DashboardData = {
  metrics: DashboardMetric[]
  activity: DashboardActivity[]
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('admin@shopelite.com')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
  }

  const fetchDashboard = async () => {
    const response = await fetch(`${API_URL}/api/v1/superadmin/dashboard`)
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.message ?? 'Failed to load dashboard data.')
    }
    const data = await response.json()
    setDashboardData(data)
  }

  const handleSignIn = async () => {
    setError('')
    if (!email.trim() || !password || otp.some((digit) => !digit.trim())) {
      setError('Please complete all fields, including the OTP code.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/v1/superadmin/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp: otp.join('') }),
      })

      const body = await response.json().catch(() => null)
      if (!response.ok) {
        setError(body?.message ?? 'Invalid credentials or OTP.')
        return
      }

      await fetchDashboard()
      setAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    setAuthenticated(false)
    setDashboardData(null)
    setPassword('')
    setOtp(Array(6).fill(''))
    setError('')
  }

  return (
    <div className="super-shell">
      <aside className="super-left">
        <div className="super-badge">
          <span className="badge-dot" />
          <span>Super Admin Portal</span>
        </div>

        <div className="super-hero">
          <p className="super-kicker">Super Admin Portal</p>
          <h1 className="super-headline">Centralised control for your entire ShopElite platform</h1>
          <p className="super-copy">
            Full-spectrum management across all shops, users, roles, and system configuration.
          </p>
        </div>

        <div className="feature-list">
          <div className="feature-row">
            <div className="feature-icon">🔐</div>
            <div>
              <div className="feature-title">Role-based permissions</div>
              <div className="feature-copy">Admin / Manager / Staff with granular module control</div>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-icon">🛡️</div>
            <div>
              <div className="feature-title">Two-factor authentication</div>
              <div className="feature-copy">Mandatory 2FA for all super admin sessions</div>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-icon">📜</div>
            <div>
              <div className="feature-title">Audit trail</div>
              <div className="feature-copy">Every action logged with timestamp and IP</div>
            </div>
          </div>
        </div>

        <div className="security-pill">
          <span className="security-dot" />
          Connected to {API_URL}
        </div>
      </aside>

      <section className="super-right">
        {authenticated ? (
          <div className="dashboard-panel">
            <div className="dashboard-header">
              <div>
                <div className="form-chip">Dashboard</div>
                <h2 className="form-heading">Super Admin overview</h2>
                <p className="form-subtitle">Manage shops, activity, and security from a central command center.</p>
              </div>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>

            {!dashboardData ? (
              <div className="dashboard-loading">Loading dashboard...</div>
            ) : (
              <>
                <div className="metric-grid">
                  {dashboardData.metrics.length > 0 ? (
                    dashboardData.metrics.map((stat) => (
                      <div key={stat.label} className="metric-card">
                        <div className="metric-value">{stat.value}</div>
                        <div className="metric-label">{stat.label}</div>
                        <div className="metric-detail">{stat.detail}</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No dashboard metrics available yet.</div>
                  )}
                </div>

                <div className="activity-card">
                  <div className="card-header">
                    <div>Recent activity</div>
                    <div className="status-pill">Live</div>
                  </div>
                  <div className="activity-table">
                    {dashboardData.activity.length > 0 ? (
                      dashboardData.activity.map((item) => (
                        <div key={`${item.user}-${item.action}`} className="activity-row">
                          <div>
                            <div className="activity-user">{item.user}</div>
                            <div className="activity-action">{item.action}</div>
                          </div>
                          <div className="activity-time">{item.time}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No activity logged yet.</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="form-panel">
            <div className="form-logo">
              <div className="form-logo-icon">S</div>
              <div className="form-logo-copy">
                <div>ShopElite</div>
                <div className="small">SUPER ADMIN</div>
              </div>
            </div>

            <div className="form-header">
              <span className="form-chip">Sign in</span>
              <h2 className="form-heading">Admin sign in</h2>
              <p className="form-subtitle">Restricted access — authorised personnel only</p>
            </div>

            <div className="form-fields">
              <Input
                type="email"
                placeholder="admin@shopelite.com"
                aria-label="Admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                startIcon="✉️"
              />
              <Input
                type="password"
                placeholder="••••••••"
                aria-label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                startIcon="🔒"
              />
            </div>

            <div className="otp-card">
              <div className="otp-icon">📱</div>
              <div className="otp-copy">
                <div className="title">Two-factor authentication</div>
                <div className="hint">Enter the 6-digit code from your authenticator app</div>
              </div>
            </div>

            <div className="otp-grid">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="otp-input"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            <Button fullWidth onClick={handleSignIn} disabled={loading}>
              <span>🔐</span>
              {loading ? 'Signing in...' : 'Sign in securely'}
            </Button>

            <div className="otp-status">
              <span>⚠️</span>
              Sessions auto-expire after 30 minutes of inactivity. All login attempts are logged.
            </div>

            <p className="alternate-text">Need help? Contact your security admin.</p>
          </div>
        )}
      </section>
    </div>
  )
}
