import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { X, TrendingUp, PiggyBank } from 'lucide-react'

// Shown after user adds a bank balance OR an income transaction
// Asks: invested or checking? → suggests investments → asks: reserve or available budget?
export default function InvestmentSuggestModal({ amount, source, onClose }) {
  const { u, getInvestmentSuggestions, set } = useUser()
  const [step, setStep] = useState('invested') // invested → suggest → allocate → done
  const [isInvested, setIsInvested] = useState(null)

  const suggestions = getInvestmentSuggestions()
  const riskLabel = { conservador:'Conservador', moderado:'Moderado', arrojado:'Arrojado', agressivo:'Agressivo' }[u.riskProfile] || 'seu perfil'

  function handleInvested(val) {
    setIsInvested(val)
    if (val) {
      // Already invested — just ask allocation
      setStep('allocate')
    } else {
      // Not invested — show suggestions first
      setStep('suggest')
    }
  }

  function handleAllocate(asReserve) {
    if (asReserve) {
      // Add to emergency reserve smart goal
      const goals = (u.smartGoals || []).map(g =>
        g.id === 'emergencia' ? { ...g, saved: (g.saved || 0) + amount } : g
      )
      set({ smartGoals: goals })
    } else {
      // Add to available salary (increases monthly budget)
      const current = parseFloat(u.incomeSalary) || 0
      const monthly = Math.round(amount / 12)
      set({ incomeSalary: String(current + monthly) })
    }
    setStep('done')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 360, padding: 28, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, color: 'var(--text3)' }}><X size={18} /></button>

        {/* STEP 1 — Invested or checking? */}
        {step === 'invested' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🏦</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em {source}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                Esse valor está investido ou na conta corrente?
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => handleInvested(true)} style={{ padding: '14px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius)', color: 'var(--green)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <TrendingUp size={16} /> Já está investido
              </button>
              <button onClick={() => handleInvested(false)} style={{ padding: '14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <PiggyBank size={16} color="var(--text2)" /> Na conta corrente (não investido)
              </button>
            </div>
          </>
        )}

        {/* STEP 2 — Investment suggestions */}
        {step === 'suggest' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>💡 Sugestão de investimento</p>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                Com perfil <strong style={{ color: 'var(--green)' }}>{riskLabel}</strong>, você pode aplicar esse valor assim:
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {suggestions.map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text2)' }}>{s.type}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.pct}%</p>
                    <p style={{ fontSize: 11, color: 'var(--text2)' }}>R$ {Math.round(amount * s.pct / 100).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setStep('allocate')}>
              Entendido, como registrar? →
            </button>
          </>
        )}

        {/* STEP 3 — Reserve or available budget? */}
        {step === 'allocate' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🤔</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Como deseja registrar?</h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                Esse valor de <strong>R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> deve entrar como:
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => handleAllocate(true)} style={{ padding: '16px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius)', color: 'var(--text)', textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', marginBottom: 3 }}>🛡️ Reserva de emergência</p>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>Contabiliza na sua meta de reserva, separado do orçamento mensal</p>
              </button>
              <button onClick={() => handleAllocate(false)} style={{ padding: '16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>💰 Saldo disponível</p>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>Aumenta seu orçamento mensal (distribuído em 12 meses)</p>
              </button>
            </div>
          </>
        )}

        {/* STEP 4 — Done */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Registrado!</h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.6 }}>
              Seus dados foram atualizados no painel e nas metas.
            </p>
            <button className="btn-primary" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}
