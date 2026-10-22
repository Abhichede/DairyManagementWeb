import { useState } from 'react'
import './App.css'

type View = 'Dashboard' | 'Milk Collection' | 'Customers' | 'Payments' | 'Employees' | 'Reports' | 'Settings'

const nav: { label: View; icon: string }[] = [
  { label: 'Dashboard', icon: '⌂' },
  { label: 'Milk Collection', icon: '◉' },
  { label: 'Customers', icon: '♙' },
  { label: 'Payments', icon: '₹' },
  { label: 'Employees', icon: '♧' },
  { label: 'Reports', icon: '▤' },
  { label: 'Settings', icon: '⚙' },
]

const customers = [
  ['#1048', 'Rajesh Kumar', '98765 43210', 'Cow', '18.4 L'],
  ['#1047', 'Meena Devi', '98220 11442', 'Buffalo', '12.8 L'],
  ['#1046', 'Suresh Patil', '98111 32456', 'Cow', '21.2 L'],
  ['#1045', 'Anita Sharma', '98901 77821', 'Cow', '9.6 L'],
]

function App() {
  const [active, setActive] = useState<View>('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">◒</div><div><strong>Dairy<span>Flow</span></strong><small>Management System</small></div></div>
        <div className="farm-card"><div className="farm-avatar">SK</div><div><b>Shree Krishna Dairy</b><small>Administrator</small></div><span>⌄</span></div>
        <p className="nav-label">MAIN MENU</p>
        <nav>{nav.map(item => <button key={item.label} className={active === item.label ? 'nav-item active' : 'nav-item'} onClick={() => setActive(item.label)}><i>{item.icon}</i>{item.label}{item.label === 'Payments' && <em>3</em>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">?</div><div><b>Need help?</b><small>Contact support</small></div><span>→</span></div><button className="logout">↪ <span>Sign out</span></button></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button><div className="breadcrumb">Home <span>/</span> <b>{active}</b></div><div className="top-actions"><button className="icon-btn">⌕</button><button className="icon-btn notification">♢<em></em></button><div className="user"><div className="avatar">SK</div><div><b>Sanjay Kumar</b><small>Admin</small></div><span>⌄</span></div></div></header>
        <section className="page"><div className="page-heading"><div><p className="eyebrow">WEDNESDAY, 22 OCTOBER 2026</p><h1>{active === 'Dashboard' ? 'Good morning, Sanjay' : active}</h1><p className="muted">Here’s what’s happening at your dairy today.</p></div><button className="primary" onClick={() => setActive('Milk Collection')}>＋ Record milk collection</button></div>
          {active === 'Dashboard' ? <Dashboard /> : <ModuleView active={active} />}
        </section>
      </main>
    </div>
  )
}

function Dashboard() {
  return <>
    <div className="stats-grid"><Stat title="Today’s collection" value="248.6" unit="L" change="12.8%" tone="green" icon="◉" /><Stat title="Today’s revenue" value="₹18,425" change="8.4%" tone="blue" icon="₹" /><Stat title="Active customers" value="128" change="4 new" tone="purple" icon="♙" /><Stat title="Pending payments" value="₹42,680" change="Needs attention" tone="orange" icon="◷" /></div>
    <div className="content-grid"><section className="panel collection-panel"><div className="panel-head"><div><h2>Collection overview</h2><p className="muted">Milk collected over the last 7 days</p></div><select><option>Last 7 days</option><option>This month</option></select></div><div className="chart"><div className="y-axis"><span>300L</span><span>200L</span><span>100L</span><span>0L</span></div><div className="chart-body"><div className="grid-lines"><i></i><i></i><i></i><i></i></div><div className="bars">{[['16','220','180'],['17','252','206'],['18','230','190'],['19','280','240'],['20','246','215'],['21','262','231'],['22','248','218']].map(([d,a,b]) => <div className="bar-group" key={d}><div className="bar-wrap"><i style={{height: `${Number(a)/3}px`}}></i><b style={{height: `${Number(b)/3}px`}}></b></div><span>{d} Oct</span></div>)}</div><div className="legend"><span><i></i>Morning</span><span><i></i>Evening</span></div></div></div></section><section className="panel"><div className="panel-head"><div><h2>Quick actions</h2><p className="muted">Common tasks</p></div></div><div className="quick-actions"><Action icon="＋" title="Add customer" text="Register a new customer" /><Action icon="₹" title="Record payment" text="Add a customer payment" /><Action icon="▤" title="View reports" text="Daily & monthly reports" /><Action icon="⚙" title="Rate chart" text="Manage milk rates" /></div></section></div>
    <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><h2>Recent customers</h2><p className="muted">Latest collection entries</p></div><button className="text-btn">View all →</button></div><table><thead><tr><th>Customer</th><th>Type</th><th>Today’s collection</th><th>Status</th></tr></thead><tbody>{customers.map(c => <tr key={c[0]}><td><div className="customer"><div className="customer-avatar">{c[1].split(' ').map(x => x[0]).join('')}</div><div><b>{c[1]}</b><small>{c[0]} · {c[2]}</small></div></div></td><td>{c[3]}</td><td><b>{c[4]}</b></td><td><span className="status paid">Collected</span></td></tr>)}</tbody></table></section><section className="panel alerts"><div className="panel-head"><div><h2>Alerts & reminders</h2><p className="muted">Things that need your attention</p></div></div><div className="alert"><span className="alert-icon orange">!</span><div><b>3 pending payments</b><p>Customers have overdue payments</p></div><span className="arrow">→</span></div><div className="alert"><span className="alert-icon blue">◷</span><div><b>Rate chart review</b><p>Last updated 28 days ago</p></div><span className="arrow">→</span></div><div className="alert"><span className="alert-icon purple">▤</span><div><b>Monthly report ready</b><p>September report is available</p></div><span className="arrow">→</span></div></section></div>
  </>
}

function Stat({ title, value, unit, change, tone, icon }: { title: string; value: string; unit?: string; change: string; tone: string; icon: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-copy"><p>{title}</p><h2>{value}<small>{unit}</small></h2><span className={tone === 'orange' ? 'change warning' : 'change'}>↗ {change} <small>{tone === 'orange' ? '' : 'vs last month'}</small></span></div></div> }
function Action({ icon, title, text }: { icon: string; title: string; text: string }) { return <button className="action"><span>{icon}</span><div><b>{title}</b><small>{text}</small></div><i>→</i></button> }
function ModuleView({ active }: { active: View }) { return <div className="module-placeholder panel"><div className="module-icon">{nav.find(x => x.label === active)?.icon}</div><h2>{active} workspace</h2><p className="muted">This screen is ready for the {active.toLowerCase()} workflow. The navigation, visual language, and interaction model match the original Dairy Management application.</p><div className="module-actions"><button className="primary">＋ Add new</button><button className="secondary">Export report</button></div></div> }

export default App
