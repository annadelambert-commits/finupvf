import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

// Each user session gets a fresh key — no cross-session data
const DEVICE_KEY = 'finup2_device_v1'

export const blank = {
  name: '', plan: 'free', aiTokens: 10, adsWatchedToday: 0, streak: 0,
  ageRange: '', jobType: '', incomeRange: '', incomeSalary: '',
  spendingProfile: '', hasLoan: false, loanAmount: '',
  dependents: '0', debtLevel: 'none', includeEducation: false,
  goals: [], customGoals: [], livesWith: '', riskProfile: '', investmentExp: '',
  goalDeadline: '', dedication: '',
  transactions: [],
  categories: ['moradia','alimentacao','transporte','lazer','assinaturas','saude','educacao','outros'],
  customCategories: [],
  bankAccounts: [],
  learnupDoneToday: false,
  // Smart goals generated from profile
  smartGoals: [],
}

function load() {
  try {
    const saved = localStorage.getItem(DEVICE_KEY)
    if (saved) return { ...blank, ...JSON.parse(saved) }
  } catch {}
  return blank
}

export function UserProvider({ children }) {
  const [u, setU] = useState(load)

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(DEVICE_KEY, JSON.stringify(u)) } catch {}
  }, [u])

  function set(data) { setU(p => ({ ...p, ...data })) }

  function addTransaction(tx) {
    setU(p => ({ ...p, transactions: [tx, ...(p.transactions || [])] }))
  }

  function updateTransaction(id, updated) {
    setU(p => ({ ...p, transactions: (p.transactions || []).map(t => t.id === id ? { ...t, ...updated } : t) }))
  }

  function deleteTransaction(id) {
    setU(p => ({ ...p, transactions: (p.transactions || []).filter(t => t.id !== id) }))
  }

  function getSpendingByCategory() {
    const out = {}
    ;(u.transactions || []).forEach(tx => {
      if (tx.amount < 0) {
        const c = tx.category || 'outros'
        out[c] = (out[c] || 0) + Math.abs(tx.amount)
      }
    })
    return out
  }

  function getTotalIncome() {
    const salary = parseFloat(u.incomeSalary) || 0
    const extra = (u.transactions || []).filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0)
    return salary + extra
  }

  function getTotalExpenses() {
    return (u.transactions || []).filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0)
  }

  function getTotalBalance() {
    return Math.max(0, getTotalIncome() - getTotalExpenses())
  }

  function getAvailableToInvest() {
    return Math.max(0, getTotalBalance())
  }

  function getBudgets() {
    const inc = parseFloat(u.incomeSalary) || 0
    const living = u.livesWith === 'parents' ? 0.10 : 0.30
    const base = {
      moradia:     Math.round(inc * living),
      alimentacao: Math.round(inc * 0.14),
      transporte:  Math.round(inc * 0.10),
      lazer:       Math.round(inc * 0.08),
      assinaturas: Math.round(inc * 0.04),
      saude:       Math.round(inc * 0.05),
      educacao:    Math.round(inc * 0.08),
      outros:      Math.round(inc * 0.06),
    }
    ;(u.customCategories || []).forEach(c => { base[c] = base[c] || 0 })
    return base
  }

  function getAlertCount() {
    const budgets = getBudgets()
    const spending = getSpendingByCategory()
    let count = 0
    Object.keys(budgets).forEach(c => {
      const b = budgets[c]; const s = spending[c] || 0
      if (b > 0 && s / b >= 0.8) count++
    })
    ;(u.smartGoals || []).forEach(g => {
      if (g.target > 0 && (g.saved || 0) >= g.target) count++
    })
    return count
  }

  // Generate smart goals from user profile + goals
  function generateSmartGoals() {
    const inc = parseFloat(u.incomeSalary) || 0
    const goals = u.goals || []
    const risk = u.riskProfile || 'conservador'
    const spending = getSpendingByCategory()
    const budgets = getBudgets()
    const lazerPct = budgets.lazer > 0 ? (spending.lazer || 0) / budgets.lazer : 0

    const list = []

    // Emergency fund goal
    if (goals.includes('emergencia') || true) {
      const target = Math.round(inc * 6)
      list.push({
        id: 'emergencia',
        label: 'Reserva de emergência',
        desc: `Guardar R$ ${Math.round(inc * 0.10).toLocaleString('pt-BR')}/mês`,
        target,
        saved: 0,
        monthly: Math.round(inc * 0.10),
        icon: '🛡️',
        type: 'saving',
        editable: true,
      })
    }

    // Investment goal based on risk
    const investPct = risk === 'conservador' ? 0.10 : risk === 'moderado' ? 0.15 : 0.20
    list.push({
      id: 'investimento_mensal',
      label: 'Aporte mensal em investimentos',
      desc: `Investir R$ ${Math.round(inc * investPct).toLocaleString('pt-BR')}/mês (${Math.round(investPct * 100)}% da renda)`,
      target: Math.round(inc * investPct * 12),
      saved: 0,
      monthly: Math.round(inc * investPct),
      icon: '📈',
      type: 'invest',
      editable: true,
    })

    // Spending reduction goal if lazer is over budget
    if (lazerPct > 0.7) {
      list.push({
        id: 'reduzir_lazer',
        label: 'Reduzir gastos com lazer',
        desc: `Manter lazer abaixo de ${Math.round(budgets.lazer).toLocaleString('pt-BR')}/mês`,
        target: budgets.lazer,
        saved: spending.lazer || 0,
        monthly: 0,
        icon: '✂️',
        type: 'reduce',
        editable: true,
      })
    }

    // Goal-specific targets
    const goalTargets = {
      imovel:       { label: 'Entrada do imóvel', icon: '🏠', target: Math.round(inc * 24), monthly: Math.round(inc * 0.08) },
      carro:        { label: 'Comprar um carro',  icon: '🚗', target: Math.round(inc * 12), monthly: Math.round(inc * 0.05) },
      viagem:       { label: 'Fundo de viagem',   icon: '✈️', target: Math.round(inc * 3),  monthly: Math.round(inc * 0.05) },
      educacao:     { label: 'Fundo educação',    icon: '🎓', target: Math.round(inc * 6),  monthly: Math.round(inc * 0.06) },
      independencia:{ label: 'Independência financeira', icon: '💸', target: Math.round(inc * 120), monthly: Math.round(inc * 0.20) },
    }

    goals.forEach(g => {
      if (goalTargets[g]) {
        list.push({
          id: g,
          ...goalTargets[g],
          desc: `Guardar R$ ${goalTargets[g].monthly.toLocaleString('pt-BR')}/mês`,
          saved: 0,
          type: 'goal',
          editable: true,
        })
      }
    })

    return list.slice(0, 5) // max 5 goals shown
  }

  function updateSmartGoal(id, data) {
    setU(p => ({
      ...p,
      smartGoals: (p.smartGoals || []).map(g => g.id === id ? { ...g, ...data } : g)
    }))
  }

  function initSmartGoals() {
    const generated = generateSmartGoals()
    setU(p => ({ ...p, smartGoals: generated }))
  }

  function getInvestmentSuggestions() {
    const avail = getAvailableToInvest()
    const risk = u.riskProfile || 'conservador'
    let list = []
    if (risk === 'arrojado' || risk === 'agressivo') {
      list = [
        { name: 'BOVA11 (ETF Ibovespa)', type: 'Ações',    pct: 40, color: '#22C55E', tip: 'Exposição ampla ao mercado brasileiro.' },
        { name: 'IVVB11 (S&P500)',        type: 'Ações',    pct: 30, color: '#3B82F6', tip: 'Diversificação internacional dolarizada.' },
        { name: 'FIIs (MXRF11)',          type: 'FII',      pct: 20, color: '#F59E0B', tip: 'Renda passiva mensal de dividendos.' },
        { name: 'Cripto (BTC)',           type: 'Cripto',   pct: 10, color: '#8B5CF6', tip: 'Alta volatilidade, alto potencial.' },
      ]
    } else if (risk === 'moderado') {
      list = [
        { name: 'Tesouro IPCA+ 2029',  type: 'Renda Fixa', pct: 40, color: '#22C55E', tip: 'Proteção contra inflação no longo prazo.' },
        { name: 'FIIs diversificados', type: 'FII',        pct: 30, color: '#3B82F6', tip: 'Renda mensal com baixa volatilidade.' },
        { name: 'ETF (BOVA11)',        type: 'Ações',      pct: 30, color: '#F59E0B', tip: 'Crescimento de longo prazo.' },
      ]
    } else {
      list = [
        { name: 'Tesouro Selic 2029',        type: 'Renda Fixa', pct: 60, color: '#22C55E', tip: 'Liquidez diária e segurança garantida.' },
        { name: 'CDB 110% CDI (liq. diária)',type: 'Renda Fixa', pct: 30, color: '#3B82F6', tip: 'Rendimento superior à poupança com proteção do FGC.' },
        { name: 'Fundo DI',                  type: 'Fundo',      pct: 10, color: '#F59E0B', tip: 'Diversificação simples sem volatilidade.' },
      ]
    }
    return list.map(s => ({ ...s, monthly: Math.round(avail * s.pct / 100) }))
  }

  function watchAd() {
    if ((u.adsWatchedToday || 0) >= 5) return false
    setU(p => ({ ...p, aiTokens: p.aiTokens + 1, adsWatchedToday: (p.adsWatchedToday || 0) + 1 }))
    return true
  }

  function reset() { try { localStorage.removeItem(DEVICE_KEY) } catch {} setU(blank) }

  return (
    <Ctx.Provider value={{
      u, set,
      addTransaction, updateTransaction, deleteTransaction,
      getSpendingByCategory, getTotalBalance, getTotalIncome, getTotalExpenses,
      getAvailableToInvest, getInvestmentSuggestions, getBudgets,
      getAlertCount, watchAd, reset,
      generateSmartGoals, initSmartGoals, updateSmartGoal,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useUser() { return useContext(Ctx) }
