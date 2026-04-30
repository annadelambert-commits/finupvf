import { useNavigate, useLocation } from 'react-router-dom'
import { Home, PieChart, TrendingUp, MessageSquare, User } from 'lucide-react'

const tabs = [
  { icon: Home,          label: 'Início',      path: '/dashboard' },
  { icon: PieChart,      label: 'Gastos',      path: '/gastos' },
  { icon: TrendingUp,    label: 'Investir',    path: '/investimentos' },
  { icon: MessageSquare, label: 'IA',          path: '/chat' },
  { icon: User,          label: 'Perfil',      path: '/perfil' },
]

export default function BottomNav() {
  const nav = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid #1E1E1E',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 4px)',
    }}>
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = pathname === path
        return (
          <button key={path} onClick={() => nav(path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '10px 4px',
            color: active ? 'var(--green)' : 'var(--text3)',
            fontSize: 10, fontWeight: active ? 600 : 400,
            transition: 'color 0.15s',
          }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
