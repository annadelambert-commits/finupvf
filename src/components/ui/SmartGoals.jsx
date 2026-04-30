import { useState, useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import { Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

export default function SmartGoals() {
  const { u, updateSmartGoal, initSmartGoals } = useUser()
  const [expanded, setExpanded] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editVal, setEditVal] = useState({})

  // Generate goals when component mounts if none exist yet
  useEffect(() => {
    if ((u.smartGoals || []).length === 0 && u.name) {
      initSmartGoals()
    }
  }, [u.name])

  const goals = u.smartGoals || []
  if (goals.length === 0) return null

  function startEdit(g) {
    setEditingId(g.id)
    setEditVal({ label: g.label, desc: g.desc, monthly: g.monthly, target: g.target })
  }

  function saveEdit(id) {
    updateSmartGoal(id, {
      label: editVal.label,
      desc: editVal.desc,
      monthly: parseFloat(editVal.monthly) || 0,
      target: parseFloat(editVal.target) || 0,
    })
    setEditingId(null)
  }

  function addProgress(id, amount) {
    const g = goals.find(g => g.id === id)
    if (!g) return
    updateSmartGoal(id, { saved: Math.min((g.saved || 0) + amount, g.target) })
  }

  const catLabel = { saving: 'Poupança', invest: 'Investimento', reduce: 'Redução', goal: 'Meta' }
  const catColor = { saving: '#22C55E', invest: '#3B82F6', reduce: '#F59E0B', goal: '#8B5CF6' }

  return (
    <div className="card">
      {/* Header */}
      <button onClick={() => setExpanded(v => !v)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: expanded ? 14 : 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          🎯 Metas e pequenos passos
        </p>
        {expanded ? <ChevronUp size={16} color="var(--text3)" /> : <ChevronDown size={16} color="var(--text3)" />}
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {goals.map(g => {
            const pct = g.target > 0 ? Math.min(Math.round((g.saved || 0) / g.target * 100), 100) : 0
            const isEditing = editingId === g.id
            const color = catColor[g.type] || '#22C55E'
            const isComplete = pct >= 100

            return (
              <div key={g.id} style={{ borderLeft: `3px solid ${isComplete ? '#22C55E' : color}`, paddingLeft: 12 }}>
                {isEditing ? (
                  /* Edit mode */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input
                      className="input-field"
                      value={editVal.label}
                      onChange={e => setEditVal(p => ({ ...p, label: e.target.value }))}
                      placeholder="Nome da meta"
                      style={{ fontSize: 13 }}
                    />
                    <input
                      className="input-field"
                      value={editVal.desc}
                      onChange={e => setEditVal(p => ({ ...p, desc: e.target.value }))}
                      placeholder="Descrição / passo"
                      style={{ fontSize: 12 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>Aporte mensal (R$)</p>
                        <input className="input-field" type="number" value={editVal.monthly} onChange={e => setEditVal(p => ({ ...p, monthly: e.target.value }))} style={{ fontSize: 13 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>Meta total (R$)</p>
                        <input className="input-field" type="number" value={editVal.target} onChange={e => setEditVal(p => ({ ...p, target: e.target.value }))} style={{ fontSize: 13 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditingId(null)} className="btn-outline" style={{ flex: 1, padding: '9px' }}>
                        <X size={14} /> Cancelar
                      </button>
                      <button onClick={() => saveEdit(g.id)} className="btn-primary" style={{ flex: 1, padding: '9px' }}>
                        <Check size={14} /> Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14 }}>{g.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{g.label}</span>
                          <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: color + '1A', color, border: `1px solid ${color}44` }}>
                            {catLabel[g.type]}
                          </span>
                          {isComplete && <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 700 }}>✓ Concluída!</span>}
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{g.desc}</p>
                      </div>
                      <button onClick={() => startEdit(g)} style={{ color: 'var(--text3)', padding: '2px 4px', flexShrink: 0 }}>
                        <Edit2 size={13} />
                      </button>
                    </div>

                    {/* Progress bar */}
                    {g.target > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                            R$ {(g.saved || 0).toLocaleString('pt-BR')} de R$ {g.target.toLocaleString('pt-BR')}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: isComplete ? '#22C55E' : color }}>{pct}%</span>
                        </div>
                        <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: isComplete ? '#22C55E' : color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                        </div>
                      </>
                    )}

                    {/* Quick progress button */}
                    {g.monthly > 0 && !isComplete && (
                      <button onClick={() => addProgress(g.id, g.monthly)} style={{ fontSize: 11, color, padding: '4px 10px', background: color + '15', border: `1px solid ${color}33`, borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        + Registrar aporte de R$ {g.monthly.toLocaleString('pt-BR')}
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })}

          {/* Months to goal estimate */}
          {goals.some(g => g.target > 0 && (g.saved || 0) < g.target && g.monthly > 0) && (
            <div style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid rgba(34,197,94,0.4)' }}>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                💡 Seguindo esses aportes mensais, você atinge{' '}
                {goals.filter(g => g.target > 0 && g.monthly > 0 && (g.saved || 0) < g.target).map(g => {
                  const months = Math.ceil((g.target - (g.saved || 0)) / g.monthly)
                  return `"${g.label}" em ${months} ${months === 1 ? 'mês' : 'meses'}`
                }).join(' e ')}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
