import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

const NO_NAV = ['/', '/login', '/termos', '/onboarding', '/planos', '/plano-personalizado']

export default function AppLayout() {
  const { pathname } = useLocation()
  const hide = NO_NAV.some(p => pathname === p || pathname.startsWith('/onboarding'))
  return (
    <div style={{ paddingBottom: hide ? 0 : 70 }}>
      <Outlet />
      {!hide && <BottomNav />}
    </div>
  )
}
