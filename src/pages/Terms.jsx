import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ChevronLeft, Check } from 'lucide-react'

const TERMS = [
  { title: '1. Aceitação dos Termos', body: 'Ao acessar o FinUp, você concorda com estes Termos de Uso e nossa Política de Privacidade. Se não concordar, por favor não utilize o aplicativo.' },
  { title: '2. Natureza do Serviço', body: 'O FinUp é uma ferramenta de educação e organização financeira pessoal que utiliza inteligência artificial. As recomendações apresentadas têm caráter informativo e não constituem consultoria financeira regulada pela CVM ou ofertas de produtos de investimento.' },
  { title: '3. Dados Pessoais', body: 'Coletamos apenas as informações necessárias para personalizar sua experiência: faixa etária, renda, objetivos e perfil de risco. Conforme a LGPD (Lei 13.709/18), você pode solicitar exclusão ou portabilidade a qualquer momento.' },
  { title: '4. Uso da IA', body: 'As recomendações da IA são geradas com base no perfil que você informou. Decisões de investimento são de sua exclusiva responsabilidade — sempre consulte um profissional certificado antes de operações de maior porte.' },
  { title: '5. Tokens e Anúncios', body: 'Tokens são uma moeda interna usada para liberar funcionalidades de IA. Você pode obtê-los completando desafios diários ou assistindo a anúncios (limite de 5 vídeos/dia no plano gratuito).' },
  { title: '6. Limitação de Responsabilidade', body: 'O FinUp não se responsabiliza por perdas financeiras decorrentes de decisões tomadas com base nas informações fornecidas pelo aplicativo.' },
  { title: '7. Alterações', body: 'Podemos atualizar estes termos periodicamente. Notificaremos você sobre mudanças significativas por meio do aplicativo.' },
]

export default function Terms() {
  const nav = useNavigate()
  const [agreed, setAgreed] = useState(false)

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => nav('/login')} style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
          <ChevronLeft size={18} /> Voltar
        </button>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="var(--green)" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Termos de Uso</h2>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>Leia antes de continuar</p>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, overflowY: 'auto', maxHeight: '52vh', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TERMS.map(({ title, body }) => (
            <div key={title}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Agree checkbox */}
        <button
          onClick={() => setAgreed(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 16px', borderRadius: 'var(--radius)',
            background: agreed ? 'var(--green-bg)' : 'var(--card)',
            border: `1px solid ${agreed ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
            color: agreed ? 'var(--green)' : 'var(--text2)',
            fontSize: 13, fontWeight: 500, textAlign: 'left',
            transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: agreed ? 'var(--green)' : 'transparent',
            border: `2px solid ${agreed ? 'var(--green)' : 'var(--border2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}>
            {agreed && <Check size={12} color="#000" strokeWidth={3} />}
          </div>
          Li e concordo com os <strong style={{ color: agreed ? 'var(--green)' : 'var(--text)' }}>Termos de Uso</strong> e a <strong style={{ color: agreed ? 'var(--green)' : 'var(--text)' }}>Política de Privacidade</strong> do FinUp.
        </button>

        <button className="btn-primary" disabled={!agreed} onClick={() => nav('/onboarding/1')}>
          Aceitar e continuar
        </button>
      </div>
    </div>
  )
}
