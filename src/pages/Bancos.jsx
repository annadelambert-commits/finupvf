import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, Trash2 } from 'lucide-react'
import InvestmentSuggestModal from '../components/ui/InvestmentSuggestModal'

const BANKS_LIST = [
  { id: 'nubank',    name: 'Nubank',          emoji: '💜', color: '#8B5CF6' },
  { id: 'itau',      name: 'Itaú',            emoji: '🟠', color: '#FF8C00' },
  { id: 'bradesco',  name: 'Bradesco',        emoji: '❤️', color: '#EF4444' },
  { id: 'bb',        name: 'Banco do Brasil', emoji: '🟡', color: '#F59E0B' },
  { id: 'santander', name: 'Santander',       emoji: '🔴', color: '#EF4444' },
  { id: 'inter',     name: 'Inter',           emoji: '🧡', color: '#FF6B35' },
  { id: 'c6',        name: 'C6 Bank',         emoji: '⚫', color: '#6B7280' },
  { id: 'picpay',    name: 'PicPay',          emoji: '💚', color: '#22C55E' },
]

export default function Bancos() {
  const nav = useNavigate()
  const { u, set } = useUser()
  const [manualName, setManualName]     = useState('')
  const [manualBalance, setManualBalance] = useState('')
  const [customName, setCustomName]     = useState('')
  const [pendingBank, setPendingBank]   = useState(null)
  const [pendingBalance, setPendingBalance] = useState('')
  const [investSuggest, setInvestSuggest] = useState(null) // {amount, source}

  const accounts = u.bankAccounts || []

  // Add manually typed entry
  function addManual() {
    if (!manualName.trim() || !manualBalance) return
    const existing = accounts.filter(b => b.name !== manualName.trim())
    set({ bankAccounts: [...existing, { name: manualName.trim(), balance: parseFloat(manualBalance) || 0, color: '#22C55E', emoji: '🏦' }] })
    setManualName(''); setManualBalance('')
  }

  // When user clicks "Conectar" on a listed bank — ask for balance
  function requestConnect(bank) {
    setPendingBank(bank)
    setPendingBalance('')
  }

  // Confirm connection with user-provided balance
  function confirmConnect() {
    if (!pendingBank || pendingBalance === '') return
    const bal = parseFloat(pendingBalance) || 0
    const existing = accounts.filter(b => b.name !== pendingBank.name)
    set({ bankAccounts: [...existing, { ...pendingBank, balance: bal }] })
    setPendingBank(null)
    setPendingBalance('')
    // Trigger investment suggestion for non-zero balances
    if (bal > 0) {
      setInvestSuggest({ amount: bal, source: pendingBank.name })
    }
  }

  function removeAccount(name) {
    set({ bankAccounts: accounts.filter(b => b.name !== name) })
  }

  function updateBalance(name, val) {
    set({ bankAccounts: accounts.map(b => b.name === name ? { ...b, balance: parseFloat(val) || 0 } : b) })
  }

  const totalBalance = accounts.reduce((a, b) => a + (b.balance || 0), 0)

  return (
    <div style={{ padding: '52px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('/dashboard')} style={{ color: 'var(--text2)' }}><ChevronLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>🏦 Conectar bancos</h2>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>Informe seus saldos manualmente para manter o painel atualizado.</p>
        </div>
      </div>

      {/* Total */}
      {accounts.length > 0 && (
        <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Saldo total cadastrado</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--green)' }}>R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {accounts.map((acc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{acc.emoji || '🏦'}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{acc.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px' }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>R$</span>
                  <input
                    type="number"
                    value={acc.balance || ''}
                    onChange={e => updateBalance(acc.name, e.target.value)}
                    style={{ width: 80, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)' }}
                  />
                </div>
                <button onClick={() => removeAccount(acc.name)} style={{ color: 'var(--text3)', padding: 4 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual entry */}
      <div className="card">
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>🏦 Inserção manual de saldo</p>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>Informe contas, carteiras ou dinheiro guardado fora de bancos.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input-field" style={{ flex: 2 }}
            placeholder="Banco ou carteira"
            value={manualName} onChange={e => setManualName(e.target.value)}
            list="bank-list"
          />
          <datalist id="bank-list">
            {BANKS_LIST.map(b => <option key={b.id} value={b.name} />)}
            <option value="Dinheiro em espécie" />
            <option value="Carteira digital" />
            <option value="Investimentos" />
          </datalist>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 10px', flex: 1 }}>
            <span style={{ color: 'var(--text3)', fontSize: 13, marginRight: 4 }}>R$</span>
            <input className="input-field" style={{ border: 'none', background: 'transparent', padding: '11px 0', width: '100%' }} type="number" placeholder="0,00" value={manualBalance} onChange={e => setManualBalance(e.target.value)} />
          </div>
          <button onClick={addManual} style={{ width: 44, height: 44, background: 'var(--green)', borderRadius: 'var(--radius-sm)', color: '#000', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>+</button>
        </div>
      </div>

      {/* Security note */}
      <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--green)' }}>🛡️ Conexão segura (em breve)</p>
        <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>A integração automática via Open Finance (Pluggy) estará disponível na próxima versão. Por enquanto, insira os valores manualmente acima.</p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text3)' }}>Clique em "Conectar" e informe o saldo atual</p>

      {/* Bank list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BANKS_LIST.map(bank => {
          const isConn = accounts.some(b => b.name === bank.name)
          return (
            <div key={bank.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderColor: isConn ? 'rgba(34,197,94,0.3)' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{bank.emoji}</span>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{bank.name}</span>
                  {isConn && <p style={{ fontSize: 11, color: 'var(--green)' }}>R$ {(accounts.find(b => b.name === bank.name)?.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>}
                </div>
              </div>
              <button onClick={() => requestConnect(bank)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: isConn ? 'rgba(34,197,94,0.15)' : 'var(--green)', color: isConn ? 'var(--green)' : '#000' }}>
                {isConn ? '↺ Editar' : '↔ Conectar'}
              </button>
            </div>
          )
        })}

        {/* Custom bank */}
        <div className="card" style={{ padding: '14px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>🏦</span>
          <input className="input-field" placeholder="Outro banco — digite o nome" value={customName} onChange={e => setCustomName(e.target.value)} style={{ flex: 1, fontSize: 13 }} />
          <button onClick={() => { if (customName.trim()) { requestConnect({ id: 'custom', name: customName.trim(), emoji: '🏦', color: '#22C55E' }); setCustomName('') } }} style={{ padding: '7px 14px', background: 'var(--green)', color: '#000', borderRadius: 8, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            ↔ Conectar
          </button>
        </div>
      </div>

      {/* Balance input modal */}
      {pendingBank && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 340, padding: 28 }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{pendingBank.emoji} {pendingBank.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>Informe o saldo atual nessa conta para que o painel seja atualizado corretamente.</p>
            <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block' }}>Saldo atual (R$)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 14px', marginBottom: 20 }}>
              <span style={{ color: 'var(--text3)', marginRight: 6 }}>R$</span>
              <input
                autoFocus
                className="input-field" type="number" placeholder="0,00"
                style={{ border: 'none', background: 'transparent', padding: '12px 0', flex: 1 }}
                value={pendingBalance} onChange={e => setPendingBalance(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmConnect()}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" onClick={() => setPendingBank(null)}>Cancelar</button>
              <button className="btn-primary" disabled={pendingBalance === ''} onClick={confirmConnect}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
      {investSuggest && (
        <InvestmentSuggestModal
          amount={investSuggest.amount}
          source={investSuggest.source}
          onClose={() => setInvestSuggest(null)}
        />
      )}
    </div>
  )
}
