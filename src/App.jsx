import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import AppLayout from './components/layout/AppLayout'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Terms from './pages/Terms'
import Onboarding from './pages/Onboarding'
import { Plans, PlanSummary } from './pages/Plans'
import Dashboard from './pages/Dashboard'
import Bancos from './pages/Bancos'
import Perfil from './pages/Perfil'
import { Gastos, Investimentos, Imoveis, Alertas, Chat, LearnUp } from './pages/Pages'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/"                    element={<Splash />} />
            <Route path="/login"               element={<Login />} />
            <Route path="/termos"              element={<Terms />} />
            <Route path="/onboarding/:step"    element={<Onboarding />} />
            <Route path="/planos"              element={<Plans />} />
            <Route path="/plano-personalizado" element={<PlanSummary />} />
            <Route path="/dashboard"           element={<Dashboard />} />
            <Route path="/gastos"              element={<Gastos />} />
            <Route path="/investimentos"       element={<Investimentos />} />
            <Route path="/imoveis"             element={<Imoveis />} />
            <Route path="/alertas"             element={<Alertas />} />
            <Route path="/chat"                element={<Chat />} />
            <Route path="/learnup"             element={<LearnUp />} />
            <Route path="/perfil"              element={<Perfil />} />
            <Route path="/bancos"              element={<Bancos />} />
            <Route path="*"                    element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
