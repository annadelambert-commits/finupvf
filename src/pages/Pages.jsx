import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, ChevronDown, ChevronUp, Edit2, Trash2, AlertTriangle, CheckCircle, Send, Plus } from 'lucide-react'
import { TransactionModal } from '../components/ui/AdModal'

// ── GASTOS ──────────────────────────────────────────────────────
export function Gastos() {
  const nav = useNavigate()
  const { u, getBudgets, getSpendingByCategory, set, deleteTransaction, getAlertCount } = useUser()
  const [showBalance, setShowBalance] = useState(false)
  const [showTx, setShowTx] = useState(false)
  const [editTx, setEditTx] = useState(null)

  const income = parseFloat(u.incomeSalary) || 0
  const budgets = getBudgets()
  const spending = getSpendingByCategory()
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0)
  const totalSpent = Object.values(spending).reduce((a, b) => a + b, 0)

  const cats = [
    { id: 'moradia', label: 'Moradia', icon: '🏠' },
    { id: 'alimentacao', label: 'Alimentação', icon: '🍔' },
    { id: 'transporte', label: 'Transporte', icon: '🚗' },
    { id: 'lazer', label: 'Lazer', icon: '🎮' },
    { id: 'assinaturas', label: 'Assinaturas', icon: '📱' },
    { id: 'saude', label: 'Saúde', icon: '💊' },
    { id: 'educacao', label: 'Educação', icon: '🎓' },
    { id: 'outros', label: 'Outros', icon: '⚡' },
    ...(u.customCategories || []).map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1), icon: '🏷️' })),
  ]

  const transactions = (u.transactions || []).filter(t => t.amount < 0)
  function deleteTx(id) { deleteTransaction(id) }
  const pctSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Controle de gastos</h2>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => setShowTx(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: 'var(--green)', color: '#000', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Nova
        </button>
      </div>

      <div className="card">
        <button onClick={() => setShowBalance(v => !v)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text)' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>Saldo disponível</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>R$ {(income - totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'var(--text2)' }}>Orçamento</p>
            <p style={{ fontSize: 13, fontWeight: 600 }}>R$ {totalBudget.toLocaleString('pt-BR')}</p>
            {showBalance ? <ChevronUp size={14} color="var(--text2)" /> : <ChevronDown size={14} color="var(--text2)" />}
          </div>
        </button>
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>Total gasto <span style={{ color: 'var(--text)', fontWeight: 600 }}>R$ {totalSpent.toFixed(2)}</span></p>
          <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(pctSpent, 100)}%`, background: pctSpent > 90 ? 'var(--red)' : pctSpent > 70 ? 'var(--yellow)' : 'var(--green)', borderRadius: 3 }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>Restam R$ {(totalBudget - totalSpent).toLocaleString('pt-BR')}</p>
        </div>
        {showBalance && (u.bankAccounts || []).length > 0 && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            {(u.bankAccounts || []).map((acc, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{acc.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>R$ {(acc.balance || 0).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cats.map(cat => {
          const spent = spending[cat.id] || 0
          const budget = budgets[cat.id] || 0
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
          return (
            <div key={cat.id} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.label}</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                  R$ {spent.toFixed(0)} <span style={{ color: 'var(--text3)' }}>/ {budget.toLocaleString('pt-BR')}</span>
                </span>
              </div>
              {budget > 0 && (
                <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--yellow)' : 'var(--green)', borderRadius: 2 }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {transactions.length > 0 && (
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Transações</p>
          {transactions.map(tx => (
            <div key={tx.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '12px 14px' }}>
              <span style={{ fontSize: 20 }}>{tx.icon || '💳'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{tx.desc}</p>
                <p style={{ fontSize: 11, color: 'var(--text2)' }}>{tx.category}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>R$ {Math.abs(tx.amount).toFixed(2)}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditTx(tx)} style={{ color: 'var(--text3)' }}><Edit2 size={14} /></button>
                <button onClick={() => deleteTx(tx.id)} style={{ color: 'var(--red)' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showTx || editTx) && <TransactionModal onClose={() => { setShowTx(false); setEditTx(null) }} editTx={editTx} />}
    </div>
  )
}

// ── INVESTIMENTOS ────────────────────────────────────────────────
export function Investimentos() {
  const nav = useNavigate()
  const { u, getInvestmentSuggestions, getAvailableToInvest } = useUser()
  const suggestions = getInvestmentSuggestions()
  const avail = getAvailableToInvest()

  const riskTags = { conservador: 'Conservador', moderado: 'Moderado', arrojado: 'Arrojado', agressivo: 'Agressivo' }
  const expTags = { nunca: 'Iniciante', basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' }
  const deadlineTags = { '6m': '6 meses', '1-2a': '1-2 anos', '3-5a': '3-5 anos', '5+a': '5+ anos' }
  const incTags = { ate2k: 'Até R$ 2.000', '2k-5k': 'Até R$ 5.000', '5k-10k': 'Até R$ 10.000', acima10k: 'Acima de R$ 10.000' }
  const tags = [riskTags[u.riskProfile], expTags[u.investmentExp], deadlineTags[u.goalDeadline], incTags[u.incomeRange]].filter(Boolean)

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>📊 Investimentos</h2>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>Carteira sugerida pela IA com base no seu perfil.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}
      </div>

      <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Disponível para investir/mês</p>
        <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--green)', letterSpacing: -1 }}>
          R$ {avail.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>↗ Renda - gastos atuais</p>
        <div style={{ display: 'flex', gap: 3, marginTop: 10, height: 8, borderRadius: 4, overflow: 'hidden' }}>
          {suggestions.map(s => <div key={s.name} style={{ flex: s.pct, background: s.color }} />)}
        </div>
      </div>

      <p style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--green)' }}>✨</span> Sugestões para seu perfil
      </p>
      {suggestions.map(s => (
        <div key={s.name} className="card" style={{ borderLeft: `3px solid ${s.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{s.type}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>{s.pct}%</p>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>~R$ {s.monthly}/mês</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 6 }}>
            <span>💡</span> {s.tip}
          </p>
        </div>
      ))}

      <div className="card" style={{ borderColor: 'var(--border)', padding: 12 }}>
        <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>
          ⓘ Esta carteira é sugerida pela IA do FinUp considerando seu perfil de risco ({riskTags[u.riskProfile]}), experiência ({expTags[u.investmentExp]}), prazo ({deadlineTags[u.goalDeadline]}) e renda ({incTags[u.incomeRange]}). Não constitui recomendação formal de investimento — sempre consulte um profissional certificado.
        </p>
      </div>
    </div>
  )
}

// ── FIIs ─────────────────────────────────────────────────────────
export function Imoveis() {
  const nav = useNavigate()
  const fiis = [
    { ticker: 'MXRF11', name: 'Maxi Renda', sector: 'Papel', price: 10.42, pvp: 1.02, dyMonthly: 0.92, change: +1.3, score: 9.4 },
    { ticker: 'HGLG11', name: 'CSHG Logística', sector: 'Logística', price: 162.30, pvp: 0.98, dyMonthly: 0.78, change: +0.8, score: 9.1 },
    { ticker: 'KNRI11', name: 'Kinea Renda', sector: 'Híbrido', price: 138.50, pvp: 0.95, dyMonthly: 0.67, change: -0.4, score: 8.7 },
    { ticker: 'XPML11', name: 'XP Malls', sector: 'Shopping', price: 98.20, pvp: 1.05, dyMonthly: 0.71, change: +2.1, score: 8.9 },
  ]

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>🏢 Ativos Imobiliários</h2>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>Fundos imobiliários recomendados pela IA com base no mercado atual.</p>
        </div>
      </div>

      <div className="card">
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 10 }}>Indicadores do Mercado</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['IFIX', '3.218'], ['Selic', '13.25%'], ['DY Médio FIIs', '0.76%']].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontSize: 11, color: 'var(--text3)' }}>{k}</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {fiis.map(fii => (
        <div key={fii.ticker} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="tag" style={{ fontSize: 10, background: 'rgba(59,130,246,0.15)', color: '#60A5FA', borderColor: 'rgba(59,130,246,0.3)' }}>{fii.sector}</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{fii.ticker}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{fii.name}</p>
              <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>R$ {fii.price.toFixed(2)}</p>
              <p style={{ fontSize: 11, color: 'var(--text3)' }}>P/VP: {fii.pvp}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--yellow)' }}>⭐ {fii.score}</p>
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>DY Mensal</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>{fii.dyMonthly}%</p>
              </div>
              <div style={{ marginTop: 4 }}>
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>Variação</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: fii.change > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {fii.change > 0 ? '+' : ''}{fii.change}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── ALERTAS ──────────────────────────────────────────────────────
export function Alertas() {
  const nav = useNavigate()
  const { u, getBudgets, getSpendingByCategory } = useUser()
  const [markedRead, setMarkedRead] = useState([])

  const budgets = getBudgets()
  const spending = getSpendingByCategory()
  const cats = ['moradia','alimentacao','transporte','lazer','assinaturas','saude','educacao','outros', ...(u.customCategories || [])]

  const alerts = cats
    .map(c => { const b = budgets[c] || 0; const s = spending[c] || 0; const pct = b > 0 ? Math.round((s / b) * 100) : 0; return { cat: c, budget: b, spent: s, pct } })
    .filter(a => a.pct >= 80)
    .sort((a, b) => b.pct - a.pct)

  const catLabel = { moradia:'Moradia',alimentacao:'Alimentação',transporte:'Transporte',lazer:'Lazer',assinaturas:'Assinaturas',saude:'Saúde',educacao:'Educação',outros:'Outros' }

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Alertas</h2>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>{alerts.length > 0 ? `Você tem ${alerts.length} alerta${alerts.length > 1 ? 's' : ''} não lido${alerts.length > 1 ? 's' : ''}` : 'Tudo certo por aqui!'}</p>
        </div>
      </div>

      <div className="card">
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>STATUS DAS CATEGORIAS</p>
        {cats.map(c => {
          const b = budgets[c] || 0; const s = spending[c] || 0
          const pct = b > 0 ? Math.round((s / b) * 100) : 0
          const dot = pct > 100 ? 'var(--red)' : pct > 80 ? 'var(--yellow)' : 'var(--green)'
          return (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6, marginBottom: 6, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13 }}>{catLabel[c] || c.charAt(0).toUpperCase() + c.slice(1)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: pct > 100 ? 'var(--red)' : pct > 80 ? 'var(--yellow)' : 'var(--text2)' }}>{pct}%</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
              </div>
            </div>
          )
        })}
      </div>

      {alerts.map(a => {
        const isRead = markedRead.includes(a.cat)
        const isOver = a.pct > 100
        return (
          <div key={a.cat} className="card" style={{ borderColor: isOver ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)', opacity: isRead ? 0.5 : 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: isOver ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={16} color={isOver ? 'var(--red)' : 'var(--yellow)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`tag ${isOver ? 'tag-red' : 'tag-yellow'}`}>{isOver ? 'Ultrapassado' : 'Atenção'}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                  {isOver
                    ? `Seus gastos com ${catLabel[a.cat] || a.cat} ultrapassaram o limite. Você gastou R$ ${a.spent.toFixed(0)} de R$ ${a.budget.toFixed(0)}.`
                    : `Seus gastos com ${catLabel[a.cat] || a.cat} estão em ${a.pct}% do limite. Você já gastou R$ ${a.spent.toFixed(0)} de R$ ${a.budget.toFixed(0)}.`
                  }
                </p>
              </div>
            </div>
            <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${Math.min(a.pct, 100)}%`, background: isOver ? 'var(--red)' : 'var(--yellow)', borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date().toLocaleDateString('pt-BR')}</span>
              {!isRead && (
                <button onClick={() => setMarkedRead(p => [...p, a.cat])} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)' }}>
                  <CheckCircle size={14} /> Marcar como lido
                </button>
              )}
            </div>
          </div>
        )
      })}

      <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 6, display: 'flex', gap: 6 }}>
          <span>💡</span> Dica da IA
        </p>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
          Tente revisar seus gastos variáveis no final de cada semana. Pequenos ajustes diários fazem grande diferença no mês!
        </p>
      </div>
    </div>
  )
}

// ── CHAT IA ──────────────────────────────────────────────────────
const QUICK = ['Meu saldo', 'Meus gastos', 'Posso investir?', 'Minhas metas', 'Minhas dívidas']

// FIX 5: Respostas contextualizadas com dados reais do perfil
function getMockReply(msg, u, spending, budgets) {
  const m = msg.toLowerCase().trim()
  const income = parseFloat(u.incomeSalary) || 0
  const name = u.name || 'você'
  const risk = { conservador:'Conservador', moderado:'Moderado', arrojado:'Arrojado', agressivo:'Agressivo' }[u.riskProfile] || 'não definido'
  const totalSpent = Object.values(spending).reduce((a, b) => a + b, 0)
  const balance = Math.max(0, income - totalSpent)
  const goalLabels = { imovel:'comprar um imóvel', viagem:'viajar', emergencia:'reserva de emergência', carro:'comprar um carro', educacao:'educação', independencia:'independência financeira' }
  const goalsText = (u.goals || []).map(g => goalLabels[g]).filter(Boolean).join(', ')
  const debtLabel = { none:'sem dívidas', small:'dívidas pequenas', medium:'dívidas médias', large:'dívidas grandes' }[u.debtLevel] || ''
  const livesLabel = { parents:'mora com os pais', alone:'mora sozinho(a)', roomies:'divide apartamento', partner:'mora com cônjuge' }[u.livesWith] || ''

  // Saudações
  if (m.match(/^(oi|olá|ola|bom dia|boa tarde|boa noite|hey|hello|hi|e aí|eai|tudo bem|tudo bom)/)) {
    const hora = new Date().getHours()
    const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
    return `${saudacao}, ${name}! 😊 Sou a IA do FinUp. Como posso te ajudar hoje? Posso responder sobre seus gastos, investimentos, metas ou qualquer dúvida financeira!`
  }

  // Como vai
  if (m.match(/(como vai|como você está|tudo certo|como está)/)) {
    return `Estou ótima, obrigada por perguntar! 😄 Seu saldo atual está em R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Posso te ajudar com algo?`
  }

  // Obrigado
  if (m.match(/(obrigad|valeu|thanks)/)) {
    return `De nada, ${name}! 😊 Estou aqui sempre que precisar. Boa sorte com suas finanças!`
  }

  // Sobre o app
  if (m.match(/(app|aplicativo|finup|como usar|ajuda|o que|funciona)/)) {
    return `O FinUp é seu assistente financeiro pessoal, ${name}! 📱\n\n• 💸 Gastos — registre e controle suas despesas por categoria\n• 📈 Investir — carteira personalizada ao seu perfil ${risk}\n• 🎯 Metas — acompanhe seus objetivos financeiros\n• 🔔 Alertas — avisos quando passar do limite\n• 🎮 LearnUP — aprenda finanças e ganhe tokens\n\nO que você quer explorar?`
  }

  // Saldo
  if (m.match(/(saldo|quanto tenho|quanto sobrou|sobra|disponível)/)) {
    return `Seu saldo disponível é **R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**, ${name}.\n\n• Renda mensal: R$ ${income.toLocaleString('pt-BR')}\n• Total gasto: R$ ${totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nQuer ver onde está gastando mais?`
  }

  // Gastos detalhados
  if (m.match(/(gasto|despesa|gastei|gastando|categoria|onde gasto)/)) {
    const catLabels = { moradia:'Moradia', alimentacao:'Alimentação', transporte:'Transporte', lazer:'Lazer', assinaturas:'Assinaturas', saude:'Saúde', educacao:'Educação', outros:'Outros' }
    const detalhes = Object.entries(spending).filter(([,v]) => v > 0)
      .map(([k,v]) => `• ${catLabels[k] || k}: R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n')
    if (!detalhes) return `Você ainda não registrou nenhum gasto, ${name}. Adicione suas despesas na aba Gastos e eu consigo analisar seu perfil financeiro!`
    return `Seus gastos registrados, ${name}:\n\n${detalhes}\n\n**Total: R$ ${totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** de um orçamento de R$ ${Object.values(budgets).reduce((a,b)=>a+b,0).toLocaleString('pt-BR')}.`
  }

  // Investimentos
  if (m.match(/(invest|aplicar|render|carteira|ação|fii|tesouro|cdb|onde guardar)/)) {
    let carteira = ''
    if (u.riskProfile === 'conservador') {
      carteira = `• 60% Tesouro Selic — ~R$ ${Math.round(balance*0.6).toLocaleString('pt-BR')}/mês\n• 30% CDB 110% CDI — ~R$ ${Math.round(balance*0.3).toLocaleString('pt-BR')}/mês\n• 10% Fundo DI — ~R$ ${Math.round(balance*0.1).toLocaleString('pt-BR')}/mês`
    } else if (u.riskProfile === 'moderado') {
      carteira = `• 40% Tesouro IPCA+ — ~R$ ${Math.round(balance*0.4).toLocaleString('pt-BR')}/mês\n• 30% FIIs — ~R$ ${Math.round(balance*0.3).toLocaleString('pt-BR')}/mês\n• 30% ETF BOVA11 — ~R$ ${Math.round(balance*0.3).toLocaleString('pt-BR')}/mês`
    } else if (u.riskProfile) {
      carteira = `• 40% BOVA11 — ~R$ ${Math.round(balance*0.4).toLocaleString('pt-BR')}/mês\n• 30% IVVB11 — ~R$ ${Math.round(balance*0.3).toLocaleString('pt-BR')}/mês\n• 20% FIIs — ~R$ ${Math.round(balance*0.2).toLocaleString('pt-BR')}/mês\n• 10% Cripto — ~R$ ${Math.round(balance*0.1).toLocaleString('pt-BR')}/mês`
    } else {
      return `Para sugerir investimentos preciso conhecer seu perfil de risco, ${name}. Vá em Perfil e preencha o perfil de investidor!`
    }
    return `Com perfil **${risk}** e R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponíveis/mês, ${name}:\n\n${carteira}\n\nVeja detalhes na aba Investimentos! 📊`
  }

  // Metas
  if (m.match(/(meta|objetivo|sonho|plano|planejamento|quanto preciso)/)) {
    if (!goalsText) return `Você ainda não definiu objetivos, ${name}. Vá em Perfil para atualizar seus objetivos!`
    const smartGoals = (u.smartGoals || [])
    const info = smartGoals.map(g => `• ${g.icon} ${g.label}: ${g.target > 0 ? Math.round((g.saved||0)/g.target*100)+'%' : 'ativo'}`).join('\n')
    return `Seus objetivos: **${goalsText}**\n\n${info || 'Acesse a aba Dashboard para ver o progresso.'}\n\nGuardando R$ ${Math.round(income*0.2).toLocaleString('pt-BR')}/mês, você chega lá! 🎯`
  }

  // Dívidas
  if (m.match(/(dívida|divida|devo|empréstimo|financiamento|cartão|parcel)/)) {
    if (u.debtLevel === 'none') return `Ótima notícia, ${name}! Você está **sem dívidas** 🎉. Foque agora em construir sua reserva de emergência e começar a investir.`
    const advice = {
      small: 'Quite o cartão de crédito primeiro — os juros costumam passar de 200% ao ano.',
      medium: 'Estratégia bola de neve: quite a menor dívida primeiro para ganhar momentum.',
      large: 'Dívidas grandes merecem atenção imediata. Considere renegociar com os credores.'
    }
    return `Seu nível de dívidas é **${debtLabel}**, ${name}. ${advice[u.debtLevel] || ''}\n\nQuitar dívidas é o melhor investimento que você pode fazer agora!`
  }

  // Reserva de emergência
  if (m.match(/(reserva|emergência|emergencia|segurança)/)) {
    const target = income * 6
    const saved = (u.smartGoals || []).find(g => g.id === 'emergencia')?.saved || 0
    const months = income > 0 ? Math.ceil((target - saved) / (income * 0.10)) : 0
    return `Sua reserva ideal é de **R$ ${target.toLocaleString('pt-BR')}** (6 meses de renda), ${name}.\n\nAtual: R$ ${saved.toLocaleString('pt-BR')} | Faltam: R$ ${(target-saved).toLocaleString('pt-BR')}\n\nGuardando 10% da renda por mês, você completa em ~${months} meses. 🛡️`
  }

  // Resposta genérica contextualizada
  return `Entendido, ${name}! Com renda de R$ ${income.toLocaleString('pt-BR')}, perfil ${risk}${livesLabel ? ' e ' + livesLabel : ''}, posso te ajudar com:\n\n• Análise dos seus gastos\n• Sugestões de investimento\n• Acompanhamento de metas\n• Planejamento financeiro\n\nO que você quer saber? 😊`
}

export function Chat() {
  const nav = useNavigate()
  const { u, set, getBudgets, getSpendingByCategory } = useUser()
  const budgets = getBudgets()
  const spending = getSpendingByCategory()

  const [msgs, setMsgs] = useState([{
    role: 'ai',
    text: `Olá, ${u.name || 'bem-vindo(a)'}! 👋 Sou a IA do FinUp.\n\nEstou configurada com seu perfil: renda R$ ${parseFloat(u.incomeSalary||0).toLocaleString('pt-BR')}, perfil ${{ conservador:'Conservador', moderado:'Moderado', arrojado:'Arrojado', agressivo:'Agressivo' }[u.riskProfile] || 'não definido'}${ u.livesWith ? ', ' + ({ parents:'mora com os pais', alone:'mora sozinho(a)', roomies:'divide apartamento', partner:'mora com cônjuge' }[u.livesWith] || '') : ''}.\n\nComo posso te ajudar hoje?`
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  function send(text) {
    const msg = (text || input).trim()
    if (!msg) return

    // FIX 3: consume 1 token per message
    if (u.plan !== 'premium' && (u.aiTokens || 0) <= 0) {
      setMsgs(p => [...p,
        { role: 'user', text: msg },
        { role: 'ai', text: '⚠️ Você ficou sem tokens! Complete desafios no LearnUP para ganhar mais, ou assista um anúncio no painel. Você também pode fazer upgrade do plano.' }
      ])
      setInput('')
      return
    }

    setInput('')
    setMsgs(p => [...p, { role: 'user', text: msg }])
    setLoading(true)

    if (u.plan !== 'premium') {
      set({ aiTokens: Math.max(0, (u.aiTokens || 0) - 1) })
    }

    setTimeout(() => {
      setMsgs(p => [...p, { role: 'ai', text: getMockReply(msg, u, spending, budgets) }])
      setLoading(false)
    }, 700)
  }

  const tokenColor = (u.aiTokens || 0) <= 2 ? 'var(--red)' : 'var(--green)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <div style={{ padding: '52px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>FinUp IA</p>
            <p style={{ fontSize: 11, color: 'var(--green)' }}>Perfil { { conservador:'Conservador', moderado:'Moderado', arrojado:'Arrojado', agressivo:'Agressivo' }[u.riskProfile] || 'não definido' }</p>
          </div>
        </div>
        <span style={{ padding: '5px 10px', background: (u.aiTokens||0) <= 2 ? 'rgba(239,68,68,0.1)' : 'var(--green-bg)', border: `1px solid ${tokenColor}33`, borderRadius: 20, fontSize: 12, color: tokenColor, fontWeight: 600 }}>
          🤖 {u.plan === 'premium' ? '∞' : (u.aiTokens || 0)} tokens
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {m.role === 'ai' && <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✨</div>}
            <div style={{
              maxWidth: '78%', padding: '12px 14px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? 'var(--green)' : 'var(--card)',
              border: m.role === 'ai' ? '1px solid var(--border)' : 'none',
              color: m.role === 'user' ? '#000' : 'var(--text)',
              fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-line',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
            <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)', animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)} style={{ padding: '6px 14px', borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap', flexShrink: 0 }}>{q}</button>
        ))}
      </div>

      <div style={{ padding: '8px 16px 16px', display: 'flex', gap: 8, borderTop: '1px solid var(--border)' }}>
        <input
          className="input-field"
          placeholder={(u.aiTokens||0) <= 0 && u.plan !== 'premium' ? 'Sem tokens — ganhe mais no LearnUP' : 'Pergunte algo...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{ flex: 1 }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (!input.trim()||loading) ? 0.4 : 1 }}>
          <Send size={18} color="#000" />
        </button>
      </div>
    </div>
  )
}

// ── LEARNUP ──────────────────────────────────────────────────────
// FIX: Banco ampliado de 10 perguntas, sorteadas 5 por sessão
const ALL_QUESTIONS = [
  { q: 'O que são FIIs (Fundos de Investimento Imobiliário)?', opts: ['Empréstimos para construtoras','Fundos que investem em ativos imobiliários e distribuem rendimentos mensais','Financiamento de imóvel próprio','Seguro residencial'], correct: 1, tip: 'FIIs são fundos negociados na bolsa que investem em ativos imobiliários e distribuem pelo menos 95% dos lucros como dividendos mensais.' },
  { q: 'O que é a reserva de emergência?', opts: ['Poupança para aposentadoria','Dinheiro para viagens','Fundo de 3-12 meses de gastos para imprevistos','Investimento de longo prazo'], correct: 2, tip: 'A reserva deve cobrir de 3 a 12 meses de gastos. Mantenha em investimentos com alta liquidez como Tesouro Selic ou CDB diário.' },
  { q: 'O que significa CDI?', opts: ['Cadastro de Devedores Inadimplentes','Taxa de referência interbancária usada em investimentos de renda fixa','Certificado de depósito imobiliário','Cartão de investimento direto'], correct: 1, tip: 'CDI é a taxa de referência para renda fixa. Um CDB a 110% do CDI rende 10% acima dessa taxa.' },
  { q: 'Qual atitude ajuda quem tem renda variável?', opts: ['Gastar sempre pelo maior mês','Criar uma reserva maior e planejar pela média conservadora','Evitar qualquer controle','Usar todo excedente em lazer'], correct: 1, tip: 'Quem tem renda variável precisa de mais margem de segurança, usando meses bons para cobrir meses fracos.' },
  { q: 'Qual a regra básica do orçamento 50/30/20?', opts: ['50% investir, 30% lazer, 20% necessidades','50% necessidades, 30% desejos, 20% poupança','50% lazer, 30% poupança, 20% contas','50% contas, 30% investir, 20% desejos'], correct: 1, tip: 'A regra 50/30/20: 50% necessidades, 30% desejos e 20% poupança e investimentos.' },
  { q: 'O que é diversificação em investimentos?', opts: ['Investir tudo em um único ativo','Distribuir o capital em diferentes ativos para reduzir riscos','Trocar de banco com frequência','Resgatar investimentos todo mês'], correct: 1, tip: 'Diversificar significa não colocar todos os ovos na mesma cesta, reduzindo o risco total da carteira.' },
  { q: 'O que é a taxa Selic?', opts: ['Taxa de juros do cartão de crédito','Taxa básica de juros da economia brasileira','Multa por atraso de pagamento','Taxa de administração de fundos'], correct: 1, tip: 'A Selic é a taxa básica de juros do Brasil, definida pelo Banco Central. Ela influencia todas as outras taxas da economia.' },
  { q: 'Qual a principal vantagem do Tesouro Direto?', opts: ['Alto risco e alto retorno','Segurança garantida pelo governo com liquidez diária','Isenção total de imposto de renda','Rentabilidade sempre superior à bolsa'], correct: 1, tip: 'O Tesouro Direto é garantido pelo governo federal, o investimento mais seguro do Brasil, com opções de liquidez diária.' },
  { q: 'O que significa "liquidez" em investimentos?', opts: ['Taxa de retorno do investimento','Facilidade de resgatar o dinheiro','Nível de risco do ativo','Valor mínimo para investir'], correct: 1, tip: 'Liquidez é a facilidade de converter um investimento em dinheiro. Tesouro Selic tem liquidez diária; CDB de prazo fixo só no vencimento.' },
  { q: 'O que são juros compostos?', opts: ['Juros que diminuem com o tempo','Juros que crescem sobre juros anteriores, acelerando o crescimento','Juros sempre iguais ao longo do tempo','Juros que só se aplicam a dívidas'], correct: 1, tip: 'Juros compostos fazem o dinheiro crescer exponencialmente — os juros de hoje geram juros amanhã. Comece cedo!' },
]

export function LearnUp() {
  const nav = useNavigate()
  const { u, set } = useUser()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  // Sorteia 5 perguntas aleatórias a cada sessão
  const [sessionQ] = useState(() => [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5))

  const q = sessionQ[current]

  function answer(idx) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correct) setScore(s => s + 1)
  }

  function next() {
    if (current < sessionQ.length - 1) {
      setCurrent(c => c + 1); setSelected(null); setAnswered(false)
    } else {
      // FIX 1: exatamente 1 token por acerto — sem dobrar
      // FIX 2: streak começa em 0, primeira vez vira 1
      const tokensEarned = score
      const newStreak = (u.streak || 0) + 1
      set({ aiTokens: (u.aiTokens || 0) + tokensEarned, streak: newStreak, learnupDoneToday: true })
      setDone(true)
    }
  }

  if (done) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🏆</div>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Desafio concluído!</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)' }}>Você acertou {score} de {sessionQ.length} perguntas</p>
      <div className="card" style={{ width: '100%', textAlign: 'center', borderColor: 'rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>🎁 +{score} token{score !== 1 ? 's' : ''} de IA</p>
        <p style={{ fontSize: 12, color: 'var(--text2)' }}>1 token por acerto, adicionados ao seu saldo!</p>
      </div>
      {/* FIX 2: mostra streak correto — já atualizado */}
      <p style={{ fontSize: 14 }}>🔥 Sequência: {(u.streak || 0) + 1} dia{(u.streak || 0) + 1 !== 1 ? 's' : ''} consecutivo{(u.streak || 0) + 1 !== 1 ? 's' : ''}</p>
      <button className="btn-primary" style={{ width: '100%' }} onClick={() => nav('/dashboard')}>Voltar ao painel</button>
    </div>
  )

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700 }}>🎯 LearnUP</p>
            <p style={{ fontSize: 11, color: 'var(--text2)' }}>Desafio diário de educação financeira</p>
          </div>
        </div>
        {/* FIX 2: mostra streak atual correto */}
        <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, fontSize: 12, color: 'var(--yellow)', fontWeight: 600 }}>
          🔥 {u.streak || 0} dia{(u.streak || 0) !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {sessionQ.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? 'var(--green)' : i === current ? 'rgba(34,197,94,0.4)' : 'var(--bg3)' }} />)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text2)' }}>Pergunta {current + 1} de {sessionQ.length}</span>
        <span style={{ fontSize: 12, color: 'var(--text2)' }}>⭐ {score} acertos</span>
      </div>

      <div className="card">
        <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>{q.q}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = answered && i === q.correct
          const isWrong = answered && i === selected && i !== q.correct
          return (
            <button key={i} onClick={() => answer(i)} style={{
              width: '100%', padding: '14px 16px', textAlign: 'left', borderRadius: 'var(--radius)',
              background: isCorrect ? 'rgba(34,197,94,0.1)' : isWrong ? 'rgba(239,68,68,0.08)' : 'var(--card)',
              border: `1.5px solid ${isCorrect ? 'rgba(34,197,94,0.5)' : isWrong ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
              color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: 14 }}>{opt}</span>
              </span>
              {isCorrect && <span style={{ color: 'var(--green)' }}>✓</span>}
              {isWrong   && <span style={{ color: 'var(--red)'   }}>✗</span>}
            </button>
          )
        })}
      </div>

      {answered && (
        <div style={{ padding: '12px 16px', background: selected === q.correct ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${selected === q.correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 'var(--radius)' }}>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selected === q.correct ? '✅ ' : '❌ '}{q.tip}</p>
        </div>
      )}

      {answered && (
        <button className="btn-primary" onClick={next}>
          {current < sessionQ.length - 1 ? 'Próxima pergunta' : 'Ver resultado'}
        </button>
      )}
    </div>
  )
}

// ── PERFIL ───────────────────────────────────────────────────────
export function Perfil() {
  const nav = useNavigate()
  const { u, set, reset } = useUser()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(u.name)
  const [salary, setSalary] = useState(u.incomeSalary)

  const rL = { conservador:'Conservador', moderado:'Moderado', arrojado:'Arrojado', agressivo:'Agressivo' }
  const eL = { nunca:'Iniciante', basico:'Básico', intermediario:'Intermediário', avancado:'Avançado' }
  const livL = { parents:'Mora com os pais', alone:'Mora sozinho(a)', roomies:'Divide apartamento', partner:'Mora com cônjuge' }
  const ageL = { '18-22':'18-22 anos', '23-28':'23-28 anos', '29-35':'29-35 anos', '36+':'36+ anos' }
  const incL = { ate2k:'Até R$ 2.000', '2k-5k':'R$ 2.000 - R$ 5.000', '5k-10k':'R$ 5.000 - R$ 10.000', acima10k:'Acima de R$ 10.000' }

  function saveEdit() { set({ name, incomeSalary: salary }); setEditing(false) }

  // FIX 4: limite de indicações no Free
  const maxReferrals = u.plan === 'free' ? 5 : 999
  const referralCount = u.referralCount || 0
  const canRefer = referralCount < maxReferrals

  function handleRefer() {
    if (!canRefer) return
    set({
      referralCount: referralCount + 1,
      aiTokensDaily: (u.aiTokensDaily || 10) + 2,
      aiTokens: (u.aiTokens || 0) + 2,
    })
    alert(`Indicação registrada! Seu limite diário de tokens aumentou para ${(u.aiTokensDaily || 10) + 2}.`)
  }

  const fields = [
    ['Nome', u.name],
    ['Salário mensal', `R$ ${parseFloat(u.incomeSalary || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
    ['Faixa etária', ageL[u.ageRange]],
    ['Faixa de renda', incL[u.incomeRange]],
    ['Situação de moradia', livL[u.livesWith]],
    ['Perfil de risco', rL[u.riskProfile]],
    ['Experiência com investimentos', eL[u.investmentExp]],
  ]

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👤</div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{u.name}</p>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{livL[u.livesWith]} • {rL[u.riskProfile]}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div className="card" style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>🤖 Tokens IA</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{u.plan === 'premium' ? '∞' : u.aiTokens}</p>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>💳 Plano</p>
          <p style={{ fontSize: 16, fontWeight: 700 }}>{u.plan?.charAt(0).toUpperCase() + u.plan?.slice(1) || 'Free'}</p>
        </div>
      </div>

      {/* FIX 4: indicações com limite no Free */}
      <div className="card">
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>🔗 Indicar amigos</p>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
          Cada indicação aumenta seu limite diário de tokens permanentemente (+2 tokens/dia).
          {u.plan === 'free' && ` Plano Free: ${referralCount}/${maxReferrals} indicações usadas.`}
        </p>
        <button
          onClick={handleRefer}
          disabled={!canRefer}
          style={{ width: '100%', padding: '11px', background: canRefer ? 'var(--green-bg)' : 'var(--bg3)', border: `1px solid ${canRefer ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', color: canRefer ? 'var(--green)' : 'var(--text3)', fontWeight: 600, fontSize: 14 }}
        >
          {canRefer ? `Registrar indicação (${referralCount}/${maxReferrals})` : `Limite atingido — faça upgrade para indicações ilimitadas`}
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}><span style={{ color: 'var(--green)' }}>◎</span> Dados do perfil</p>
          <button onClick={() => setEditing(v => !v)} style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4, display: 'block' }}>Nome</label>
              <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4, display: 'block' }}>Salário mensal</label>
              <input className="input-field" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={saveEdit}>Salvar</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fields.map(([label, val]) => val && (
              <div key={label}>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 3 }}>{label}</p>
                <div style={{ padding: '11px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14 }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn-primary" onClick={() => nav('/planos')}>Upgrade de plano →</button>
      <button onClick={() => { if (window.confirm('Apaga todos os dados. Confirma?')) { reset(); nav('/') } }} style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center' }}>
        Sair / Recomeçar
      </button>
    </div>
  )
}

// ── BANCOS ───────────────────────────────────────────────────────
const BANKS = [
  { id: 'nubank', name: 'Nubank', color: '#8B5CF6', emoji: '💜' },
  { id: 'itau', name: 'Itaú', color: '#FF8C00', emoji: '🟠' },
  { id: 'bradesco', name: 'Bradesco', color: '#EF4444', emoji: '❤️' },
  { id: 'bb', name: 'Banco do Brasil', color: '#F59E0B', emoji: '🟡' },
  { id: 'santander', name: 'Santander', color: '#EF4444', emoji: '🔴' },
  { id: 'inter', name: 'Inter', color: '#FF6B35', emoji: '🧡' },
  { id: 'c6', name: 'C6 Bank', color: '#6B7280', emoji: '⚫' },
  { id: 'picpay', name: 'PicPay', color: '#22C55E', emoji: '💚' },
]

export function Bancos() {
  const nav = useNavigate()
  const { u, set } = useUser()
  const [manualBank, setManualBank] = useState('')
  const [manualBalance, setManualBalance] = useState('')
  const [customBankName, setCustomBankName] = useState('')
  const [connecting, setConnecting] = useState(null)
  const [connected, setConnected] = useState(null)

  function addManual() {
    if (!manualBank || !manualBalance) return
    const existing = (u.bankAccounts || []).filter(b => b.name !== manualBank)
    set({ bankAccounts: [...existing, { name: manualBank, balance: parseFloat(manualBalance), color: '#22C55E' }] })
    setManualBank(''); setManualBalance('')
  }

  function simulateConnect(bank) {
    setConnecting(bank.id)
    setTimeout(() => {
      const existing = (u.bankAccounts || []).filter(b => b.name !== bank.name)
      set({ bankAccounts: [...existing, { name: bank.name, balance: Math.round(Math.random() * 5000 + 500), color: bank.color }] })
      setConnecting(null); setConnected(bank.id)
      setTimeout(() => setConnected(null), 2000)
    }, 1500)
  }

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>🏦 Conectar bancos</h2>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>Cadastre seus saldos manualmente ou conecte bancos via Open Finance.</p>
        </div>
      </div>

      <div className="card">
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>🏦 Inserção manual de saldo</p>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>Use esta opção mesmo sem conectar nenhum banco.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input className="input-field" style={{ flex: 2 }} placeholder="Banco ou carteira" value={manualBank} onChange={e => setManualBank(e.target.value)} list="bank-list" />
          <datalist id="bank-list">
            {BANKS.map(b => <option key={b.id} value={b.name} />)}
            <option value="Dinheiro em espécie" />
            <option value="Carteira digital" />
          </datalist>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 10px', flex: 1 }}>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>R$</span>
            <input className="input-field" style={{ border: 'none', background: 'transparent', padding: '11px 6px', width: '100%' }} type="number" placeholder="0,00" value={manualBalance} onChange={e => setManualBalance(e.target.value)} />
          </div>
          <button onClick={addManual} style={{ width: 40, height: 44, background: 'var(--green)', borderRadius: 'var(--radius-sm)', color: '#000', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</button>
        </div>
        {(u.bankAccounts || []).length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(u.bankAccounts || []).map((acc, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13 }}>{acc.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>R$ {(acc.balance || 0).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--green)' }}>🛡️ Conexão segura</p>
        <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>Utilizamos Open Banking com criptografia de ponta a ponta. Seus dados bancários nunca são armazenados diretamente.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {['💳 Cartões de crédito','📱 Conta corrente','🔄 Transações automáticas','🏦 Múltiplos bancos'].map(t => (
            <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text3)' }}>Conexão opcional via Open Finance</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BANKS.map(bank => {
          const isConn = (u.bankAccounts || []).some(b => b.name === bank.name)
          return (
            <div key={bank.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderColor: isConn ? 'rgba(34,197,94,0.3)' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{bank.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{bank.name}</span>
              </div>
              <button onClick={() => simulateConnect(bank)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: isConn ? 'rgba(34,197,94,0.15)' : 'var(--green)', color: isConn ? 'var(--green)' : '#000', display: 'flex', alignItems: 'center', gap: 6 }}>
                {connecting === bank.id ? '...' : connected === bank.id ? '✓ Conectado' : isConn ? '↺ Reconectar' : '↔ Conectar'}
              </button>
            </div>
          )
        })}

        <div className="card" style={{ padding: '14px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>🏦</span>
          <input className="input-field" placeholder="Outro banco — digite o nome" value={customBankName} onChange={e => setCustomBankName(e.target.value)} style={{ flex: 1, fontSize: 13 }} />
          <button onClick={() => { if (customBankName) { simulateConnect({ id: 'custom', name: customBankName, color: '#22C55E', emoji: '🏦' }); setCustomBankName('') } }} style={{ padding: '7px 14px', background: 'var(--green)', color: '#000', borderRadius: 8, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            ↔ Conectar
          </button>
        </div>
      </div>
    </div>
  )
}
