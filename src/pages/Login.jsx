import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Shield } from 'lucide-react'

export default function Login() {
  const nav = useNavigate()
  const { set } = useUser()

  function continueWith(name) {
    set({ name })
    nav('/termos')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#1A2F1A,#0F1F0F)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>💹</div>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Acesse o <span style={{ color: 'var(--green)' }}>FinUp</span></h2>
        <p style={{ fontSize: 14, color: 'var(--text2)', textAlign: 'center', lineHeight: 1.5 }}>
          Entre com sua conta Google ou experimente como convidado para conhecer o app.
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn-outline" onClick={() => continueWith('Usuário')}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continuar com Google
        </button>

        <button className="btn-outline" style={{ borderColor: '#2A2A2A' }} onClick={() => continueWith('Convidado')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          Testar como convidado
        </button>

        <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.5, marginTop: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          Mesmo como convidado, você passa pelo onboarding para que a IA personalize o app de acordo com seu perfil.
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Shield size={12} /> Seus dados ficam protegidos e criptografados.
      </p>
    </div>
  )
}
