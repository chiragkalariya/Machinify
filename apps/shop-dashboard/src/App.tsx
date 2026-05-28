import { useState } from 'react'
import { OfflineProvider } from './lib/offlineContext'
import { OfflineBanner } from './components/offline/OfflineBanner'
import { SyncStatusBar } from './components/offline/SyncStatusBar'
import { ConnectionBadge } from './components/offline/ConnectionBadge'
import { Button, Card, Input } from '@bizflow/ui'

const navItems = [
  { label: 'Dashboard', icon: '📊', active: true },
  { label: 'Products', icon: '📦' },
  { label: 'Categories', icon: '🗂️' },
  { label: 'Orders', icon: '🛒', badge: 12 },
]

const manageItems = [
  { label: 'Customers', icon: '👥' },
  { label: 'Inquiries', icon: '✉️', badge: 4 },
  { label: 'Analytics', icon: '📈' },
  { label: 'Settings', icon: '⚙️' },
]

const stats = [
  { label: 'Total revenue', value: '₹4.2L', percent: '+22%', color: '#e94560', bar: 84, icon: '💰' },
  { label: 'Total orders', value: '1,248', percent: '+6%', color: '#3b82f6', bar: 66, icon: '🛒' },
  { label: 'Customers', value: '3,850', percent: '+12%', color: '#22c55e', bar: 72, icon: '👥' },
  { label: 'Products', value: '412', percent: '-3%', color: '#f59e0b', bar: 40, icon: '📦' },
]

const orders = [
  { id: 'AORD-0248', name: 'Priya Sharma', items: '3 items', status: 'Delivered', amount: '₹2,340', date: 'May 26' },
  { id: 'AORD-0247', name: 'Rahul Mehta', items: '2 items', status: 'Processing', amount: '₹890', date: 'May 25' },
  { id: 'AORD-0246', name: 'Anita Singh', items: '4 items', status: 'Pending', amount: '₹4,150', date: 'May 25' },
  { id: 'AORD-0245', name: 'Vikram Verma', items: '1 item', status: 'Delivered', amount: '₹1,620', date: 'May 24' },
  { id: 'AORD-0244', name: 'Sneha Jain', items: '2 items', status: 'Cancelled', amount: '₹560', date: 'May 24' },
]

const chartData = [
  { day: 'Mon', height: 26 },
  { day: 'Tue', height: 42 },
  { day: 'Wed', height: 58 },
  { day: 'Thu', height: 72 },
  { day: 'Fri', height: 84 },
  { day: 'Sat', height: 68 },
  { day: 'Sun', height: 94 },
]

const products = [
  { name: 'Smart Watch', category: 'Electronics', price: '₹8,499', stock: 26 },
  { name: 'Premium Backpack', category: 'Accessories', price: '₹2,199', stock: 8 },
  { name: 'Wireless Earbuds', category: 'Audio', price: '₹3,499', stock: 14 },
]

const statusRows = [
  { label: 'Delivered', color: '#22c55e', ratio: 68, count: 848 },
  { label: 'Processing', color: '#3b82f6', ratio: 20, count: 242 },
  { label: 'Pending', color: '#f59e0b', ratio: 10, count: 110 },
  { label: 'Cancelled', color: '#e94560', ratio: 4, count: 45 },
]

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (!authenticated) {
    return (
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-side-top">
            <div className="auth-badge">Admin dashboard</div>
            <h1>Powerful store management for modern teams.</h1>
            <p>Manage orders, inventory, and analytics from a secure, unified shop dashboard.</p>
          </div>

          <div className="auth-feature-list">
            <div className="feature-item">
              <span>⚡</span>
              <div>
                <div className="feature-title">Fast workflows</div>
                <div>Go from order to shipping with fewer clicks.</div>
              </div>
            </div>
            <div className="feature-item">
              <span>🔒</span>
              <div>
                <div className="feature-title">Secure access</div>
                <div>Shop manager login with safe session control.</div>
              </div>
            </div>
            <div className="feature-item">
              <span>📦</span>
              <div>
                <div className="feature-title">Inventory overview</div>
                <div>Track stock and product performance instantly.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <Card className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">S</div>
              <div>
                <div className="auth-logo-title">ShopElite</div>
                <div className="auth-logo-subtitle">Manager access</div>
              </div>
            </div>

            <h2>Sign in to your shop dashboard</h2>
            <p className="auth-copy">Enter your credentials to access orders, inventory, and real-time metrics.</p>

            <div className="auth-form">
              <Input
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                startIcon="✉️"
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                startIcon="🔒"
                endIcon={showPassword ? '🙈' : '👁️'}
                onEndIconClick={() => setShowPassword((value) => !value)}
              />
            </div>

            <div className="auth-form-meta">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <Button fullWidth className="auth-submit" onClick={() => setAuthenticated(true)}>
              Sign in
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <OfflineProvider>
      <OfflineBanner />
      <div className="dashboard-shell">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">S</div>
            <div>
              <div>ShopElite</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Super admin</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div>
              <div className="nav-section">
                <div className="nav-section-label">MAIN</div>
                {navItems.map((item) => (
                  <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
                    <div className="icon">{item.icon}</div>
                    <span>{item.label}</span>
                    {item.badge ? <span className="badge-pill">{item.badge}</span> : null}
                  </div>
                ))}
              </div>
              <div className="nav-section">
                <div className="nav-section-label">MANAGE</div>
                {manageItems.map((item) => (
                  <div key={item.label} className="nav-item">
                    <div className="icon">{item.icon}</div>
                    <span>{item.label}</span>
                    {item.badge ? <span className="badge-pill">{item.badge}</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="footer-avatar">RM</div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 500 }}>Ria Mehta</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Shop Manager</div>
            </div>
          </div>
        </aside>

        <main className="main-panel">
          <div className="topbar">
            <div className="page-title">Dashboard</div>
            <div className="topbar-actions">
              <div className="date-pill">May 2025</div>
              <Button variant="primary" className="primary-button">
                <span>＋</span>
                Add product
              </Button>
              <div className="notification-pill">🔔</div>
            </div>
          </div>

          <section className="content-area">
            <div className="stats-grid">
              {stats.map((item) => (
                <div key={item.label} className="stat-card">
                  <div className="stat-card-header">
                    <div className="icon" style={{ background: `${item.color}20`, color: item.color }}>{item.icon ?? '•'}</div>
                    <span className={`percent-pill ${item.percent.startsWith('-') ? 'down' : 'up'}`}>{item.percent}</span>
                  </div>
                  <div className="stat-card-value">{item.value}</div>
                  <div className="stat-card-label">{item.label}</div>
                  <div className="mini-bar">
                    <span style={{ width: `${item.bar}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card-grid-two">
              <div className="card">
                <div className="card-header">
                  <div>Recent orders</div>
                  <a href="#">View all →</a>
                </div>
                {orders.map((order) => (
                  <div key={order.id} className="order-row">
                    <div className="order-info">
                      <div style={{ fontWeight: 600 }}>{order.id}</div>
                      <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{order.name} · {order.items}</div>
                    </div>
                    <div>
                      <span className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-meta">
                      <div>{order.amount}</div>
                      <div>{order.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-header">
                  <div>Revenue (7 days)</div>
                </div>
                <div className="revenue-chart">
                  <div className="chart-bars">
                    {chartData.map((item) => (
                      <div key={item.day} className="chart-bar">
                        <span style={{ height: `${item.height}%`, background: `linear-gradient(to top, #fecaca, #e94560)` }} />
                        <span className="chart-bar-label">{item.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="metric-row">
                    <div>This week ₹58,420</div>
                    <div style={{ color: '#16a34a' }}>+18% vs last week</div>
                  </div>
                  <div className="metric-row">
                    <div className="metric-chip">Avg. order ₹3,240</div>
                    <div className="metric-chip">Conversion 3.8%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-grid-two">
              <div className="card top-products">
                <div className="card-header">
                  <div>Top products</div>
                </div>
                {products.map((product) => (
                  <div key={product.name} className="product-row">
                    <div className="product-thumb">📦</div>
                    <div className="product-details">
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{product.category}</div>
                    </div>
                    <div className="product-price">
                      <div>{product.price}</div>
                      <div style={{ color: product.stock > 10 ? '#16a34a' : '#f59e0b' }}>{product.stock} in stock</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card order-status-card">
                <div className="card-header">
                  <div>Order status</div>
                </div>
                {statusRows.map((status) => (
                  <div key={status.label} className="status-row">
                    <div className="status-label">
                      <span className="status-dot" style={{ background: status.color }} />
                      {status.label}
                    </div>
                    <div className="status-bar">
                      <span className="status-fill" style={{ width: `${status.ratio}%`, background: status.color }} />
                    </div>
                    <div>{status.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <SyncStatusBar />
    </OfflineProvider>
  )
}
