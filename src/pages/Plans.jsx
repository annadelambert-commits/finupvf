import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, Check, Zap, Star, Crown } from 'lucide-react'

export function Plans() {
  const nav = useNavigate()
  const { u, set, initSmartGoals } = useUser()
  const [selected, setSelected] = useState('premium')

  const plans = [
    {
      id: 'free', name: 'Free', price: 'R$ 0', period: 'para sempre',
      sub: 'Comece sem compromisso', icon: Zap, iconColor: '#22C55E',
      features: ['Tokens de IA limitados por dia','Controle básico de gastos','Categorização manual','Indique amigos e ganhe mais tokens diários','Indicações ilimitadas'],
    },
    {
      id: 'basic', name: 'Basic', price: 'R$ 15', period: '/mês',
      sub: 'Ideal para começar a investir', icon: Star, iconColor: '#3B82F6',
      features: ['Tokens de IA ampliados','Controle completo de gastos','Categorização automática por IA','Relatórios mensais','Suporte por chat','Indique amigos e ganhe mais tokens'],
    },
    {
      id: 'premium', name: 'Premium', price: 'R$ 30', period: '/mês',
      sub: 'Experiência completa sem limites', icon: Crown, iconColor: '#22C55E',
      popular: true,
      features: ['Tokens de IA ilimitados','Tudo do plano Basic','Análise de mercado imobiliário em tempo real','Recomendações personalizadas de investimento','Consultoria financeira com IA avançada','Relatórios semanais detalhados','Suporte prioritário'],
    },
  ]

  function choose() {
    const tokens = selected === 'free' ? 10 : selected === 'basic' ? 50 : 9999
    set({ plan: selected, aiTokens: tokens })
    // Generate smart goals from profile now that we have all info
    setTimeout(() => initSmartGoals(), 100)
    nav('/plano-personalizado')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => nav('/onboarding/5')} style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
          <ChevronLeft size={18} /> Voltar
        </button>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Escolha seu plano</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>Comece grátis ou desbloqueie todo o potencial do FinUp.</p>
        </div>

        {plans.map(plan => {
          const Icon = plan.icon
          const isSel = selected === plan.id
          return (
            <button key={plan.id} onClick={() => setSelected(plan.id)} style={{
              width: '100%', textAlign: 'left', padding: 20,
              background: isSel ? 'rgba(34,197,94,0.05)' : 'var(--card)',
              border: `1.5px solid ${isSel ? 'var(--green)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', position: 'relative',
              transition: 'all 0.2s', color: 'var(--text)',
            }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--green)', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 8px 8px' }}>Mais popular</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={plan.iconColor} />
                  </div>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{plan.name} </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}> {plan.period}</span>
                    <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{plan.sub}</p>
                  </div>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSel ? 'var(--green)' : 'var(--border2)'}`, background: isSel ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                  {isSel && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000' }} />}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="var(--green)" strokeWidth={2.5} />
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}

        <button className="btn-primary" onClick={choose} style={{ marginTop: 8 }}>
          {selected === 'free' ? 'Começar grátis' : `Assinar ${plans.find(p => p.id === selected)?.name} — ${plans.find(p => p.id === selected)?.price}/${selected === 'basic' ? 'mês' : 'mês'}`}
        </button>
      </div>
    </div>
  )
}

export function PlanSummary() {
  const nav = useNavigate()
  const { u, getBudgets } = useUser()
  const budgets = getBudgets()
  const income = parseFloat(u.incomeSalary) || 0

  const cats = [
    { id: 'moradia',     label: 'Moradia',     color: '#22C55E' },
    { id: 'alimentacao', label: 'Alimentação', color: '#3B82F6' },
    { id: 'transporte',  label: 'Transporte',  color: '#F59E0B' },
    { id: 'lazer',       label: 'Lazer',       color: '#EF4444' },
    { id: 'investimentos',label:'Investimentos',color: '#22C55E' },
    { id: 'reserva',     label: 'Reserva',     color: '#8B5CF6' },
  ]

  const distribution = {
    moradia: 0.30, alimentacao: 0.14, transporte: 0.10,
    lazer: 0.08, investimentos: 0.10, reserva: 0.12,
  }

  const riskLabel = { conservador: 'Conservador', moderado: 'Moderado', arrojado: 'Arrojado', agressivo: 'Agressivo' }
  const incomeLabel = { ate2k: 'Até R$ 2.000', '2k-5k': 'R$ 2.000 - R$ 5.000', '5k-10k': 'R$ 5.000 - R$ 10.000', acima10k: 'Acima de R$ 10.000' }

  function aiTip() {
    const inc = incomeLabel[u.incomeRange] || 'sua renda'
    const risk = riskLabel[u.riskProfile] || 'seu perfil'
    const gs = (u.goals || []).map(g => ({ imovel: 'Comprar um imóvel', viagem: 'Viajar', emergencia: 'Reserva de emergência', carro: 'Comprar um carro', educacao: 'Educação', independencia: 'Independência financeira' }[g])).filter(Boolean).join(', ')
    return `Com ${inc} e perfil ${risk}, você pode combinar reserva robusta, aportes automáticos e diversificação conforme seus objetivos${gs ? ': ' + gs : ''}.`
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 24 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✨</div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Seu plano personalizado</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Baseado no seu perfil, a IA criou este plano de gastos ideal para você.</p>
      </div>

      {/* Distribution */}
      <div className="card" style={{ width: '100%' }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📊</span> Distribuição ideal
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cats.map(cat => {
            const pct = Math.round((distribution[cat.id] || 0) * 100)
            return (
              <div key={cat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{cat.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 3 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI tip */}
      <div className="card" style={{ width: '100%', borderColor: 'rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)' }}>
          <span>✨</span> Dica da IA
        </p>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{aiTip()}</p>
      </div>

      <button className="btn-primary" style={{ width: '100%' }} onClick={() => nav('/dashboard')}>
        Acessar meu painel
      </button>
    </div>
  )
}
