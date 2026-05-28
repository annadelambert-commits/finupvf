import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft } from 'lucide-react'

function RadioRow({ label, sub, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', padding: '12px 14px', textAlign: 'left', background: selected ? 'rgba(34,197,94,0.08)' : 'var(--bg3)', border: `1px solid ${selected ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, transition: 'all 0.15s' }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: 'var(--text2)' }}>{sub}</p>}
      </div>
      <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${selected ? 'var(--green)' : 'var(--border2)'}`, background: selected ? 'var(--green)' : 'transparent', flexShrink: 0 }} />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</p>
      {children}
    </div>
  )
}

export default function Perfil() {
  const nav = useNavigate()
  const { u, set, reset } = useUser()

  // Local edit state mirrors profile
  const [name, setName]       = useState(u.name || '')
  const [salary, setSalary]   = useState(u.incomeSalary || '')
  const [ageRange, setAge]    = useState(u.ageRange || '')
  const [jobType, setJob]     = useState(u.jobType || '')
  const [incomeRange, setInc] = useState(u.incomeRange || '')
  const [livesWith, setLives] = useState(u.livesWith || '')
  const [riskProfile, setRisk]= useState(u.riskProfile || '')
  const [investExp, setExp]   = useState(u.investmentExp || '')
  const [debtLevel, setDebt]  = useState(u.debtLevel || '')
  const [dependents, setDeps] = useState(u.dependents || '')
  const [goalDeadline, setDL] = useState(u.goalDeadline || '')
  const [saved, setSaved]     = useState(false)

  function saveAll() {
    set({ name, incomeSalary: salary, ageRange, jobType, incomeRange, livesWith, riskProfile, investmentExp: investExp, debtLevel, dependents, goalDeadline })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const rL = { conservador:'Conservador', moderado:'Moderado', arrojado:'Arrojado', agressivo:'Agressivo' }
  const livL = { parents:'Mora com os pais', alone:'Mora sozinho(a)', roomies:'Divide apartamento', partner:'Mora com cônjuge' }

  return (
    <div style={{ padding: '52px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👤</div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{u.name}</p>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{livL[u.livesWith] || '—'} • {rL[u.riskProfile] || '—'}</p>
        </div>
      </div>

      {/* Tokens + Plan */}
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

      {/* ── Editable fields ── */}
      <Section title="Identificação">
        <label style={{ fontSize: 12, color: 'var(--text2)' }}>Como quer ser chamado(a)</label>
        <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome ou apelido" />

        <label style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Salário mensal líquido (R$)</label>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
          <span style={{ color: 'var(--text3)', marginRight: 6, fontSize: 13 }}>R$</span>
          <input className="input-field" type="number" style={{ border: 'none', background: 'transparent', padding: '11px 0' }} placeholder="0,00" value={salary} onChange={e => setSalary(e.target.value)} />
        </div>

        <label style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Faixa etária</label>
        {[['18-22','18-22 anos'],['23-28','23-28 anos'],['29-35','29-35 anos'],['36+','36+ anos']].map(([id, lbl]) =>
          <RadioRow key={id} label={lbl} selected={ageRange === id} onClick={() => setAge(id)} />
        )}

        <label style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Situação profissional</label>
        {[['clt','CLT / Empregado','Renda fixa mensal'],['autonomo','Autônomo / PJ','Renda variável'],['empreendedor','Empreendedor','Tenho meu próprio negócio'],['estudante','Estudante','Ainda não tenho renda fixa']].map(([id, lbl, sub]) =>
          <RadioRow key={id} label={lbl} sub={sub} selected={jobType === id} onClick={() => setJob(id)} />
        )}
      </Section>

      <Section title="Situação financeira">
        <label style={{ fontSize: 12, color: 'var(--text2)' }}>Faixa de renda</label>
        {[['ate2k','Até R$ 2.000'],['2k-5k','R$ 2.000 - R$ 5.000'],['5k-10k','R$ 5.000 - R$ 10.000'],['acima10k','Acima de R$ 10.000']].map(([id, lbl]) =>
          <RadioRow key={id} label={lbl} selected={incomeRange === id} onClick={() => setInc(id)} />
        )}

        <label style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Nível de dívidas</label>
        {[['none','Sem dívidas','Estou no azul'],['small','Dívidas pequenas','Cartão até 1 salário'],['medium','Dívidas médias','1-3 salários'],['large','Dívidas grandes','Acima de 3 salários']].map(([id, lbl, sub]) =>
          <RadioRow key={id} label={lbl} sub={sub} selected={debtLevel === id} onClick={() => setDebt(id)} />
        )}

        <label style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Dependentes</label>
        {[['0','Nenhum'],['1','1 dependente'],['2-3','2-3 dependentes'],['4+','4+ dependentes']].map(([id, lbl]) =>
          <RadioRow key={id} label={lbl} selected={dependents === id} onClick={() => setDeps(id)} />
        )}
      </Section>

      <Section title="Moradia">
        {[['parents','Mora com os pais'],['alone','Mora sozinho(a)'],['roomies','Divide apartamento'],['partner','Mora com cônjuge']].map(([id, lbl]) =>
          <RadioRow key={id} label={lbl} selected={livesWith === id} onClick={() => setLives(id)} />
        )}
      </Section>

      <Section title="Perfil de investidor">
        <label style={{ fontSize: 12, color: 'var(--text2)' }}>Tolerância ao risco</label>
        {[['conservador','Conservador','Prefiro segurança'],['moderado','Moderado','Aceito riscos calculados'],['arrojado','Arrojado','Busco maiores retornos'],['agressivo','Agressivo','Alto risco, alto retorno']].map(([id, lbl, sub]) =>
          <RadioRow key={id} label={lbl} sub={sub} selected={riskProfile === id} onClick={() => setRisk(id)} />
        )}

        <label style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Experiência com investimentos</label>
        {[['nunca','Nunca investi','Sou completamente iniciante'],['basico','Básico','Poupança ou CDB'],['intermediario','Intermediário','Ações, FIIs, tesouro'],['avancado','Avançado','Derivativos, cripto']].map(([id, lbl, sub]) =>
          <RadioRow key={id} label={lbl} sub={sub} selected={investExp === id} onClick={() => setExp(id)} />
        )}
      </Section>

      <Section title="Prazo dos objetivos">
        {[['6m','6 meses','Quero resultados rápidos'],['1-2a','1-2 anos','Curto prazo'],['3-5a','3-5 anos','Médio prazo'],['5+a','5+ anos','Longo prazo']].map(([id, lbl, sub]) =>
          <RadioRow key={id} label={lbl} sub={sub} selected={goalDeadline === id} onClick={() => setDL(id)} />
        )}
      </Section>

      <button className="btn-primary" onClick={saveAll}>
        {saved ? '✓ Salvo!' : 'Salvar alterações'}
      </button>
{/* Indicações */}
<div className="card">
  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>🔗 Indicar amigos</p>
  <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
    Cada indicação aumenta seu limite diário de tokens (+2 tokens/dia).
    {u.plan === 'free' && ` Plano Free: ${u.referralCount || 0}/5 indicações usadas.`}
  </p>
  <button
    onClick={() => {
      const max = u.plan === 'free' ? 5 : 999
      const count = u.referralCount || 0
      if (count >= max) { alert('Limite atingido! Faça upgrade para indicações ilimitadas.'); return }
      set({ referralCount: count + 1, aiTokensDaily: (u.aiTokensDaily || 10) + 2, aiTokens: (u.aiTokens || 0) + 2 })
      alert(`Indicação registrada! Limite diário agora: ${(u.aiTokensDaily || 10) + 2} tokens.`)
    }}
    disabled={u.plan === 'free' && (u.referralCount || 0) >= 5}
    style={{ width: '100%', padding: '11px', background: (u.plan === 'free' && (u.referralCount || 0) >= 5) ? 'var(--bg3)' : 'var(--green-bg)', border: `1px solid ${(u.plan === 'free' && (u.referralCount || 0) >= 5) ? 'var(--border)' : 'rgba(34,197,94,0.3)'}`, borderRadius: 'var(--radius-sm)', color: (u.plan === 'free' && (u.referralCount || 0) >= 5) ? 'var(--text3)' : 'var(--green)', fontWeight: 600, fontSize: 14 }}
  >
    {u.plan === 'free' && (u.referralCount || 0) >= 5 ? 'Limite atingido — faça upgrade' : `Registrar indicação (${u.referralCount || 0}/${u.plan === 'free' ? 5 : '∞'})`}
  </button>
</div>
      <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)' }} onClick={() => nav('/planos')}>
        Upgrade de plano →
      </button>

      <button onClick={() => { if (window.confirm('Apaga todos os dados. Confirma?')) { reset(); nav('/') } }} style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: 8 }}>
        Sair / Recomeçar
      </button>
    </div>
  )
}
