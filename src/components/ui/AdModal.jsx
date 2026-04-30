import { useState, useEffect } from 'react'
import { X, Play, Mic } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import InvestmentSuggestModal from './InvestmentSuggestModal'

// ── AD MODAL ────────────────────────────────────────────────────
export default function AdModal({ onClose }) {
  const { u, watchAd } = useUser()
  const [watching, setWatching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const remaining = 5 - (u.adsWatchedToday || 0)

  function startAd() {
    setWatching(true)
    let p = 0
    const iv = setInterval(() => {
      p += 100 / 12
      setProgress(Math.min(p, 100))
      if (p >= 100) {
        clearInterval(iv)
        watchAd()
        setDone(true)
      }
    }, 1000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 340, position: 'relative', padding: 28, textAlign: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, color: 'var(--text3)' }}><X size={18} /></button>

        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>🎬</div>

        {done ? (
          <>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>+1 token desbloqueado!</h3>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>Token adicionado ao seu saldo diário.</p>
            <button className="btn-primary" onClick={onClose}>Continuar</button>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Assista um vídeo</h3>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Veja um anúncio de ~12s e ganhe +1 token de IA.</p>

            {watching ? (
              <div style={{ marginBottom: 16 }}>
                <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'var(--green)', borderRadius: 2, transition: 'width 0.8s linear' }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>Assistindo... {Math.round(progress)}%</p>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < (5 - remaining) ? 'var(--green)' : 'var(--border2)' }} />
                ))}
                <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 6 }}>{remaining}/5 restantes hoje</span>
              </div>
            )}

            {remaining > 0 ? (
              <button className="btn-primary" onClick={startAd} disabled={watching}>
                <Play size={16} fill="#000" /> Assistir agora
              </button>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--red)' }}>Limite diário atingido. Volte amanhã ou faça upgrade.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── TRANSACTION MODAL ────────────────────────────────────────────
const CAT_ICONS = { moradia:'🏠', alimentacao:'🍔', transporte:'🚗', lazer:'🎮', assinaturas:'📱', saude:'💊', educacao:'🎓', outros:'⚡', ferias:'✈️', custom:'🏷️' }

export function TransactionModal({ onClose, editTx }) {
  const { u, addTransaction, set } = useUser()
  const [type, setType] = useState(editTx?.amount > 0 ? 'entrada' : 'despesa')
  const [desc, setDesc] = useState(editTx?.desc || '')
  const [amount, setAmount] = useState(editTx ? String(Math.abs(editTx.amount)) : '')
  const [cat, setCat] = useState(editTx?.category || '')
  const [newCatName, setNewCatName] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [recording, setRecording] = useState(false)
  const [showInvestSuggest, setShowInvestSuggest] = useState(false)
  const [savedAmount, setSavedAmount] = useState(0)

  const cats = [...(u.categories || []), ...(u.customCategories || [])]

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voz não suportada neste navegador. Use Chrome.'); return }
    const r = new SR(); r.lang = 'pt-BR'; r.interimResults = false
    r.onresult = e => { setDesc(e.results[0][0].transcript); setRecording(false) }
    r.onerror = () => setRecording(false)
    r.onend = () => setRecording(false)
    r.start(); setRecording(true)
  }

  function addCustomCat() {
    if (!newCatName.trim()) return
    const id = newCatName.toLowerCase().replace(/\s+/g, '_')
    set({ customCategories: [...(u.customCategories || []), id] })
    setCat(id)
    setShowNewCat(false)
    setNewCatName('')
  }

  function save() {
    if (!desc || !amount || !cat) return
    const tx = {
      id: editTx?.id || Date.now(),
      desc, category: cat,
      amount: type === 'despesa' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
      date: new Date().toISOString().split('T')[0],
      icon: CAT_ICONS[cat] || '💳',
    }
    if (editTx) {
      set({ transactions: (u.transactions || []).map(t => t.id === editTx.id ? tx : t) })
    } else {
      addTransaction(tx)
    }
    onClose()
  }

  return (
    <>
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px 20px 0 0', padding: 24, paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editTx ? 'Editar transação' : 'Nova transação'}</h3>
          <button onClick={onClose}><X size={20} color="var(--text2)" /></button>
        </div>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: 'var(--bg3)', padding: 4, borderRadius: 10 }}>
          {['despesa','entrada'].map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              flex: 1, padding: '9px', borderRadius: 8, fontWeight: 600, fontSize: 14,
              background: type === t ? (t === 'despesa' ? 'var(--red)' : 'var(--green)') : 'transparent',
              color: type === t ? '#fff' : 'var(--text2)',
              transition: 'all 0.15s',
            }}>
              {t === 'despesa' ? '− Despesa' : '+ Entrada'}
            </button>
          ))}
        </div>

        {/* Voice */}
        <button onClick={handleVoice} style={{
          width: '100%', padding: '11px', marginBottom: 10,
          background: recording ? 'rgba(239,68,68,0.1)' : 'var(--bg3)',
          border: `1px solid ${recording ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)', color: recording ? 'var(--red)' : 'var(--text2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14,
        }}>
          <Mic size={16} /> {recording ? 'Gravando...' : 'Inserir por voz'}
        </button>

        {/* Description */}
        <input className="input-field" style={{ marginBottom: 10 }} placeholder='Descrição (ex: Uber, Salário)' value={desc} onChange={e => setDesc(e.target.value)} />

        {/* Amount */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 14px', marginBottom: 16 }}>
          <span style={{ color: 'var(--text3)' }}>R$</span>
          <input className="input-field" style={{ border: 'none', background: 'transparent', padding: '11px 4px' }} type="number" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        {/* Categories */}
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>Categoria</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: cat === c ? 'var(--green)' : 'var(--bg3)',
              color: cat === c ? '#000' : 'var(--text2)',
              border: `1px solid ${cat === c ? 'var(--green)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {CAT_ICONS[c] || '🏷️'} {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
          {showNewCat ? (
            <div style={{ display: 'flex', gap: 6, width: '100%' }}>
              <input className="input-field" placeholder="Nome da categoria" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ flex: 1 }} />
              <button onClick={addCustomCat} style={{ padding: '8px 14px', background: 'var(--green)', color: '#000', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13 }}>OK</button>
            </div>
          ) : (
            <button onClick={() => setShowNewCat(true)} style={{ padding: '6px 12px', borderRadius: 20, fontSize: 13, background: 'var(--bg3)', border: '1px dashed var(--border)', color: 'var(--green)' }}>
              + Nova categoria
            </button>
          )}
        </div>

        <button className="btn-primary" disabled={!desc || !amount || !cat} onClick={save}>
          Adicionar transação
        </button>
      </div>
    </div>
    {showInvestSuggest && (
      <InvestmentSuggestModal
        amount={savedAmount}
        source={desc || 'entrada'}
        onClose={onClose}
      />
    )}
    </>
  )
}
