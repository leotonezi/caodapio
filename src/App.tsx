import { LoginPage } from './features/auth/LoginPage'
import { useSession } from './features/auth/useSession'
import { HouseholdScreen } from './features/household/HouseholdScreen'

function App() {
  const { session, loading } = useSession()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900" />
  }

  return session ? <HouseholdScreen userId={session.user.id} /> : <LoginPage />
}

export default App
