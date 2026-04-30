import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Bell, User, Plus, Link, PieChart, Building2, TrendingUp, BookOpen, AlertCircle, MessageSquare } from 'lucide-react'
import AdModal, { TransactionModal } from '../components/ui/AdModal'
import SmartGoals from '../components/ui/SmartGoals'

export default function Dashboard() {
  const nav = useNavigate()
  const { u, getTotalBalance, getTotalIncome, getTotalExpenses, getAlertCount } = useUser()
  const [showAd, setShowAd] = useState(false)
  const [showTx, setShowTx] = useState(false)

  const balance   = getTotalBalance()
  const income    = getTotalIncome()
  const expenses  = getTotalExpenses()
  const alertCount = getAlertCount()

  const goalLabels = {
    imovel: 'Entrada do imóvel', viagem: 'Viagem planejada',
    carro: 'Compra do carro', emergencia: 'Reserva de emergência',
    educacao: 'Curso/educação', independencia: 'Independência financeira',
  }
  const tagLabels = {
    livesWith:  { parents:'Mora com os pais', alone:'Mora sozinho(a)', roomies:'Divide apartamento', partner:'Mora com cônjuge' },
    jobType:    { clt:'CLT / Empregado', autonomo:'Autônomo / PJ', empreendedor:'Empreendedor', estudante:'Estudante' },
    debtLevel:  { none:'Sem dívidas', small:'Dívidas pequenas', medium:'Dívidas médias', large:'Dívidas grandes' },
    riskProfile:{ conservador:'Perfil conservador', moderado:'Perfil moderado', arrojado:'Perfil arrojado', agressivo:'Perfil agressivo' },
  }
  const profileTags = [
    tagLabels.livesWith[u.livesWith],
    tagLabels.jobType[u.jobType],
    tagLabels.debtLevel[u.debtLevel],
    tagLabels.riskProfile[u.riskProfile],
  ].filter(Boolean)

  const recent = (u.transactions || []).slice(0, 5)
  const goals  = u.goals || []

  const modules = [
    { icon: PieChart,      label: 'Gastos',       path: '/gastos',        color: '#3B82F6' },
    { icon: Building2,     label: 'Imóveis',      path: '/imoveis',       color: '#F59E0B' },
    { icon: TrendingUp,    label: 'Investimentos',path: '/investimentos',  color: '#22C55E' },
    { icon: BookOpen,      label: 'LearnUP',      path: '/learnup',       color: '#3B82F6' },
    { icon: AlertCircle,   label: 'Alertas',      path: '/alertas',       color: '#EF4444' },
    { icon: MessageSquare, label: 'IA Chat',      path: '/chat',          color: '#22C55E' },
  ]

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>Olá, {u.name || 'usuário'} 👋</p>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Meu Painel</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAd(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>
            <span style={{ fontSize: 10 }}>🤖</span> {u.plan === 'premium' ? '∞' : u.aiTokens}
          </button>

          {/* Bell with badge */}
          <button onClick={() => nav('/alertas')} style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} color={alertCount > 0 ? 'var(--red)' : 'var(--text2)'} />
            {alertCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {alertCount}
              </span>
            )}
          </button>

          <button onClick={() => nav('/perfil')} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} color="var(--text2)" />
          </button>
        </div>
      </div>

      {/* Balance card */}
      <div className="card">
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>Saldo disponível</p>
        <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)', letterSpacing: -1, marginBottom: 12 }}>
          R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>↑</div>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text2)' }}>Entradas</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>↓</div>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text2)' }}>Saídas</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setShowTx(true)} className="btn-primary" style={{ flex: 1 }}>
          <Plus size={16} /> Nova transação
        </button>
        <button onClick={() => nav('/bancos')} className="btn-outline" style={{ flex: 1 }}>
          <Link size={14} /> Conectar bancos
        </button>
      </div>

      {/* Modules grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {modules.map(({ icon: Icon, label, path, color }) => (
          <button key={path} onClick={() => nav(path)} style={{ padding: '14px 8px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text2)', fontSize: 12, fontWeight: 500, position: 'relative', transition: 'border-color 0.15s' }}>
            <Icon size={22} color={color} strokeWidth={1.8} />
            {label}
            {label === 'Alertas' && alertCount > 0 && (
              <span style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{alertCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Planejamentos */}
      {profileTags.length > 0 && (
        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>🎯 Planejamentos</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {profileTags.map(tag => (
              <span key={tag} className={`tag ${tag.includes('conservador') || tag.includes('moderado') || tag.includes('arrojado') || tag.includes('agressivo') ? 'tag-yellow' : ''}`}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {goals.slice(0, 2).map((g, i) => (
              <div key={g}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{goalLabels[g] || g}</span>
                    <span className="tag tag-green" style={{ fontSize: 10 }}>{i === 0 ? 'Investimento' : 'Meta'}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{i === 0 ? '25%' : '30%'}</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: i === 0 ? '25%' : '30%', background: 'var(--green)', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Goals */}
      <SmartGoals />

      {/* Recent transactions */}
      {recent.length > 0 && (
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Últimas transações</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map(tx => (
              <div key={tx.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
                <span style={{ fontSize: 20 }}>{tx.icon || '💳'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{tx.desc}</p>
                  <p style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'capitalize' }}>{tx.category}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: tx.amount > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAd  && <AdModal onClose={() => setShowAd(false)} />}
      {showTx  && <TransactionModal onClose={() => setShowTx(false)} />}
    </div>
  )
}
