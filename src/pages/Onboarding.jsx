import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* ── shared helpers ── */
function ProgressBar({ step, total = 5 }) {
  return (
    <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(step / total) * 100}%`, background: 'var(--green)', borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function OBHeader({ step, onBack, label }) {
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={onBack} style={{ fontSize: 14, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {step > 1 && <><ChevronLeft size={16} /> Voltar</>}
        </button>
        <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>Passo {step} de 5</span>
        <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{step * 20}%</span>
      </div>
      <ProgressBar step={step} />
    </div>
  )
}

function RadioCard({ label, sub, selected, onClick, half }) {
  return (
    <button onClick={onClick} style={{
      width: half ? 'calc(50% - 4px)' : '100%',
      padding: '14px 16px', textAlign: 'left',
      background: selected ? 'rgba(34,197,94,0.08)' : 'var(--card)',
      border: `1px solid ${selected ? 'rgba(34,197,94,0.5)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 8, transition: 'all 0.15s', color: 'var(--text)',
    }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{sub}</p>}
      </div>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? 'var(--green)' : 'var(--border2)'}`,
        background: selected ? 'var(--green)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000' }} />}
      </div>
    </button>
  )
}

/* ── Step 1: Identidade ── */
function Step1({ onNext }) {
  const { u, set } = useUser()
  const [name, setName] = useState(u.name || '')
  const [age, setAge] = useState(u.ageRange || '')
  const [job, setJob] = useState(u.jobType || '')

  const ages = [
    { id: '18-22', label: '18-22 anos' },
    { id: '23-28', label: '23-28 anos' },
    { id: '29-35', label: '29-35 anos' },
    { id: '36+',   label: '36+ anos' },
  ]
  const jobs = [
    { id: 'estudante',     label: 'Estudante',        sub: 'Ainda não tenho renda fixa' },
    { id: 'clt',           label: 'CLT / Empregado',  sub: 'Renda fixa mensal' },
    { id: 'autonomo',      label: 'Autônomo / PJ',    sub: 'Renda variável' },
    { id: 'empreendedor',  label: 'Empreendedor',     sub: 'Tenho meu próprio negócio' },
  ]

  const ok = name && age && job

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Vamos te conhecer!</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Precisamos de algumas informações para personalizar sua experiência.</p>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>COMO VOCÊ DESEJA SER CHAMADO?</label>
        <input className="input-field" style={{ marginTop: 8 }} placeholder="Digite seu nome ou apelido" value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>FAIXA ETÁRIA</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {ages.map(a => <RadioCard key={a.id} label={a.label} selected={age === a.id} onClick={() => setAge(a.id)} half />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>SITUAÇÃO PROFISSIONAL</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {jobs.map(j => <RadioCard key={j.id} label={j.label} sub={j.sub} selected={job === j.id} onClick={() => setJob(j.id)} />)}
        </div>
      </div>

      <button className="btn-primary" disabled={!ok} onClick={() => { set({ name, ageRange: age, jobType: job }); onNext() }}>
        Continuar <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* ── Step 2: Situação financeira ── */
function Step2({ onNext }) {
  const { u, set } = useUser()
  const [incomeRange, setIncomeRange] = useState(u.incomeRange || '')
  const [incomeSalary, setIncomeSalary] = useState(u.incomeSalary || '')
  const [spendingProfile, setSpending] = useState(u.spendingProfile || '')
  const [hasLoan, setHasLoan] = useState(u.hasLoan || false)
  const [loanAmount, setLoanAmount] = useState(u.loanAmount || '')
  const [dependents, setDependents] = useState(u.dependents || '')
  const [debtLevel, setDebt] = useState(u.debtLevel || '')
  const [includeEducation, setEdu] = useState(u.includeEducation || false)

  const ranges = [
    { id: 'ate2k',   label: 'Até R$ 2.000',        sub: 'Renda inicial' },
    { id: '2k-5k',   label: 'R$ 2.000 - R$ 5.000',  sub: 'Renda intermediária' },
    { id: '5k-10k',  label: 'R$ 5.000 - R$ 10.000', sub: 'Renda avançada' },
    { id: 'acima10k',label: 'Acima de R$ 10.000',    sub: 'Alta renda' },
  ]
  const spends = [
    { id: 'gasto_tudo',    label: 'Gasto quase tudo',       sub: 'Sobra muito pouco no fim do mês' },
    { id: 'guardo_pouco',  label: 'Consigo guardar um pouco',sub: 'Guardo entre 5-15% da renda' },
    { id: 'guardo_bom',    label: 'Guardo uma boa parte',    sub: 'Guardo entre 15-30% da renda' },
    { id: 'economico',     label: 'Sou muito econômico',     sub: 'Guardo mais de 30% da renda' },
  ]
  const deps = [
    { id: '0', label: 'Nenhum',       sub: 'Sou só eu' },
    { id: '1', label: '1 dependente', sub: 'Filho(a), cônjuge ou familiar' },
    { id: '2-3', label: '2-3 dependentes', sub: 'Família pequena' },
    { id: '4+', label: '4+ dependentes',   sub: 'Família numerosa' },
  ]
  const debts = [
    { id: 'none',   label: 'Sem dívidas',   sub: 'Estou no azul' },
    { id: 'small',  label: 'Dívidas pequenas', sub: 'Cartão de crédito até 1 salário' },
    { id: 'medium', label: 'Dívidas médias',   sub: '1-3 salários comprometidos' },
    { id: 'large',  label: 'Dívidas grandes',  sub: 'Acima de 3 salários ou financiamento longo' },
  ]

  const ok = incomeRange && spendingProfile && dependents && debtLevel

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Sua situação financeira</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Quanto mais detalhes, mais a IA personaliza o app pra você.</p>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>$ RENDA MENSAL APROXIMADA</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {ranges.map(r => <RadioCard key={r.id} label={r.label} sub={r.sub} selected={incomeRange === r.id} onClick={() => setIncomeRange(r.id)} />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>SALÁRIO MENSAL EXATO</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 14px' }}>
          <span style={{ color: 'var(--text3)', fontSize: 14 }}>R$</span>
          <input className="input-field" style={{ border: 'none', background: 'transparent', padding: '12px 4px' }} placeholder="Digite seu salário líquido" type="number" value={incomeSalary} onChange={e => setIncomeSalary(e.target.value)} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>PERFIL DE GASTOS</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {spends.map(s => <RadioCard key={s.id} label={s.label} sub={s.sub} selected={spendingProfile === s.id} onClick={() => setSpending(s.id)} />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>VOCÊ TEM EMPRÉSTIMO OU FINANCIAMENTO ATIVO?</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <RadioCard label="Não" sub="Não tenho parcelas ativas" selected={!hasLoan} onClick={() => setHasLoan(false)} half />
          <RadioCard label="Sim" sub="Tenho parcelas em aberto" selected={hasLoan} onClick={() => setHasLoan(true)} half />
        </div>
        {hasLoan && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 14px' }}>
            <span style={{ color: 'var(--text3)', fontSize: 14 }}>R$</span>
            <input className="input-field" style={{ border: 'none', background: 'transparent', padding: '12px 4px' }} placeholder="Valor total das parcelas/mês" type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
          </div>
        )}
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>👥 VOCÊ TEM DEPENDENTES?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {deps.map(d => <RadioCard key={d.id} label={d.label} sub={d.sub} selected={dependents === d.id} onClick={() => setDependents(d.id)} half />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>ⓘ COMO ESTÃO SUAS DÍVIDAS?</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {debts.map(d => <RadioCard key={d.id} label={d.label} sub={d.sub} selected={debtLevel === d.id} onClick={() => setDebt(d.id)} />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>DESEJA INCLUIR EDUCAÇÃO COMO CATEGORIA DE GASTOS?</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <RadioCard label="Não" sub="Posso criar depois se precisar" selected={!includeEducation} onClick={() => setEdu(false)} half />
          <RadioCard label="Sim" sub="Cursos, faculdade e estudos" selected={includeEducation} onClick={() => setEdu(true)} half />
        </div>
      </div>

      <button className="btn-primary" disabled={!ok} onClick={() => { set({ incomeRange, incomeSalary, spendingProfile, hasLoan, loanAmount, dependents, debtLevel, includeEducation }); onNext() }}>
        Continuar <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* ── Step 3: Objetivos & Moradia ── */
function Step3({ onNext }) {
  const { u, set } = useUser()
  const [goals, setGoals] = useState(u.goals || [])
  const [lives, setLives] = useState(u.livesWith || '')

  const goalsList = [
    { id: 'imovel',     label: 'Comprar um imóvel',         sub: 'Casa própria ou investimento' },
    { id: 'carro',      label: 'Comprar um carro',           sub: 'Veículo novo ou seminovo' },
    { id: 'viagem',     label: 'Viajar',                     sub: 'Viagem dos sonhos' },
    { id: 'emergencia', label: 'Reserva de emergência',      sub: '6-12 meses de segurança' },
    { id: 'educacao',   label: 'Educação',                   sub: 'Curso, pós ou intercâmbio' },
    { id: 'independencia', label: 'Independência financeira',sub: 'Viver de renda passiva' },
  ]
  const living = [
    { id: 'parents',  label: 'Mora com os pais' },
    { id: 'alone',    label: 'Mora sozinho(a)' },
    { id: 'roomies',  label: 'Divide apartamento' },
    { id: 'partner',  label: 'Mora com cônjuge' },
  ]

  function toggle(id) { setGoals(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]) }

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Seus objetivos & moradia</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Selecione todos que se aplicam — vamos traçar o melhor caminho.</p>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>OBJETIVOS FINANCEIROS</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {goalsList.map(g => (
            <button key={g.id} onClick={() => toggle(g.id)} style={{
              padding: '14px 16px', textAlign: 'left',
              background: goals.includes(g.id) ? 'rgba(34,197,94,0.08)' : 'var(--card)',
              border: `1px solid ${goals.includes(g.id) ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', color: 'var(--text)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{g.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>{g.sub}</p>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${goals.includes(g.id) ? 'var(--green)' : 'var(--border2)'}`, background: goals.includes(g.id) ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {goals.includes(g.id) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round"/></svg>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>ONDE VOCÊ MORA?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {living.map(l => <RadioCard key={l.id} label={l.label} selected={lives === l.id} onClick={() => setLives(l.id)} half />)}
        </div>
      </div>

      <button className="btn-primary" disabled={goals.length === 0 || !lives} onClick={() => { set({ goals, livesWith: lives }); onNext() }}>
        Continuar <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* ── Step 4: Perfil de investidor ── */
function Step4({ onNext }) {
  const { u, set } = useUser()
  const [risk, setRisk] = useState(u.riskProfile || '')
  const [exp, setExp] = useState(u.investmentExp || '')

  const risks = [
    { id: 'conservador', label: 'Conservador', sub: 'Prefiro segurança, mesmo rendendo menos' },
    { id: 'moderado',    label: 'Moderado',    sub: 'Aceito riscos calculados' },
    { id: 'arrojado',    label: 'Arrojado',    sub: 'Busco maiores retornos' },
    { id: 'agressivo',   label: 'Agressivo',   sub: 'Alto risco, alto retorno' },
  ]
  const exps = [
    { id: 'nunca',        label: 'Nunca investi',  sub: 'Sou completamente iniciante' },
    { id: 'basico',       label: 'Básico',         sub: 'Poupança ou CDB' },
    { id: 'intermediario',label: 'Intermediário',  sub: 'Ações, FIIs, tesouro' },
    { id: 'avancado',     label: 'Avançado',       sub: 'Derivativos, cripto, day trade' },
  ]

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Perfil de investidor</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Isso nos ajuda a recomendar investimentos adequados ao seu perfil.</p>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>TOLERÂNCIA AO RISCO</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {risks.map(r => <RadioCard key={r.id} label={r.label} sub={r.sub} selected={risk === r.id} onClick={() => setRisk(r.id)} half />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>EXPERIÊNCIA COM INVESTIMENTOS</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {exps.map(e => <RadioCard key={e.id} label={e.label} sub={e.sub} selected={exp === e.id} onClick={() => setExp(e.id)} />)}
        </div>
      </div>

      <button className="btn-primary" disabled={!risk || !exp} onClick={() => { set({ riskProfile: risk, investmentExp: exp }); onNext() }}>
        Continuar <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* ── Step 5: Prazo e dedicação ── */
function Step5({ onNext }) {
  const { u, set } = useUser()
  const [deadline, setDeadline] = useState(u.goalDeadline || '')
  const [ded, setDed] = useState(u.dedication || '')

  const deadlines = [
    { id: '6m',   label: '6 meses',  sub: 'Quero resultados rápidos' },
    { id: '1-2a', label: '1-2 anos', sub: 'Curto prazo' },
    { id: '3-5a', label: '3-5 anos', sub: 'Médio prazo' },
    { id: '5+a',  label: '5+ anos',  sub: 'Longo prazo, foco no futuro' },
  ]
  const deds = [
    { id: 'minima',    label: 'Mínima',     sub: 'Quero algo automático, sem esforço' },
    { id: 'moderada',  label: 'Moderada',   sub: 'Posso dedicar 1-2h por semana' },
    { id: 'alta',      label: 'Alta',       sub: 'Quero acompanhar de perto, 1h/dia' },
    { id: 'intensiva', label: 'Intensiva',  sub: 'Finanças são prioridade, tempo integral' },
  ]

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Prazo e dedicação</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Última etapa! Em quanto tempo quer alcançar seus objetivos?</p>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>PRAZO PARA OBJETIVOS</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {deadlines.map(d => <RadioCard key={d.id} label={d.label} sub={d.sub} selected={deadline === d.id} onClick={() => setDeadline(d.id)} half />)}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>DEDICAÇÃO ÀS FINANÇAS</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {deds.map(d => <RadioCard key={d.id} label={d.label} sub={d.sub} selected={ded === d.id} onClick={() => setDed(d.id)} />)}
        </div>
      </div>

      <button className="btn-primary" disabled={!deadline || !ded} onClick={() => { set({ goalDeadline: deadline, dedication: ded }); onNext() }}>
        Ver meu plano →
      </button>
    </div>
  )
}

/* ── Main Onboarding router ── */
export default function Onboarding() {
  const { step } = useParams()
  const nav = useNavigate()
  const s = parseInt(step) || 1

  function next() { s < 5 ? nav(`/onboarding/${s + 1}`) : nav('/planos') }
  function back() { s > 1 ? nav(`/onboarding/${s - 1}`) : nav('/termos') }

  return (
    <div style={{ minHeight: '100dvh', overflowY: 'auto' }}>
      <OBHeader step={s} onBack={back} />
      {s === 1 && <Step1 onNext={next} />}
      {s === 2 && <Step2 onNext={next} />}
      {s === 3 && <Step3 onNext={next} />}
      {s === 4 && <Step4 onNext={next} />}
      {s === 5 && <Step5 onNext={next} />}
    </div>
  )
}
