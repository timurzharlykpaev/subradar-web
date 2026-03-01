import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import DashboardPage from '@/pages/DashboardPage'
import SubscriptionsPage from '@/pages/SubscriptionsPage'
import AddSubscriptionPage from '@/pages/AddSubscriptionPage'
import SubscriptionDetailPage from '@/pages/SubscriptionDetailPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import CardsPage from '@/pages/CardsPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import LoginPage from '@/pages/LoginPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import PrivacyPage from '@/pages/legal/PrivacyPage'
import RefundPage from '@/pages/legal/RefundPage'
import TermsPage from '@/pages/legal/TermsPage'
import CookiesPage from '@/pages/legal/CookiesPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/legal/privacy" element={<PrivacyPage />} />
      <Route path="/legal/refund" element={<RefundPage />} />
      <Route path="/legal/terms" element={<TermsPage />} />
      <Route path="/legal/cookies" element={<CookiesPage />} />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="subscriptions/add" element={<AddSubscriptionPage />} />
                <Route path="subscriptions/:id" element={<SubscriptionDetailPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
