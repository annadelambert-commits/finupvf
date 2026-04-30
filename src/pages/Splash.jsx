import { useNavigate } from 'react-router-dom'
import { Target, Circle, TrendingUp } from 'lucide-react'

export default function Splash() {
  const nav = useNavigate()
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 32 }}>
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #1A2F1A, #0F1F0F)',
          border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(34,197,94,0.2)',
          fontSize: 40,
        }}>💹</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)', letterSpacing: -1 }}>FinUp</h1>
      </div>

      {/* Tagline */}
      <p style={{ fontSize: 16, color: 'var(--text2)', textAlign: 'center', lineHeight: 1.6 }}>
        Seu assistente financeiro inteligente. Controle gastos, planeje investimentos e alcance seus objetivos com IA.
      </p>

      {/* Feature list */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: Target,     label: 'Metas personalizadas com IA' },
          { icon: Circle,     label: 'Controle total dos seus gastos' },
          { icon: TrendingUp, label: 'Investimentos inteligentes' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            <Icon size={18} color="var(--green)" strokeWidth={2} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', marginTop: 8 }}>
        <button className="btn-primary" onClick={() => nav('/login')}>Começar agora</button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 12 }}>
          Leva menos de 3 minutos ⏱
        </p>
      </div>
    </div>
  )
}
