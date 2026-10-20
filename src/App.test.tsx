import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

const useSessionMock = vi.fn()
vi.mock('./features/auth/useSession', () => ({
  useSession: () => useSessionMock(),
}))

vi.mock('./data/supabase/household-repository', () => ({
  supabaseHouseholdRepository: {
    getMyHousehold: vi.fn().mockResolvedValue(null),
  },
}))

describe('App', () => {
  it('shows nothing (gated) while the session is loading', () => {
    useSessionMock.mockReturnValue({ session: null, loading: true })
    render(<App />)
    expect(screen.queryByText('E-mail')).not.toBeInTheDocument()
  })

  it('shows the login page when there is no session', () => {
    useSessionMock.mockReturnValue({ session: null, loading: false })
    render(<App />)
    expect(screen.getByText('E-mail')).toBeInTheDocument()
  })

  it('shows the household screen when there is a session', async () => {
    useSessionMock.mockReturnValue({ session: { user: { id: 'u1' } }, loading: false })
    render(<App />)
    await waitFor(() => expect(screen.getByText('Criar grupo')).toBeInTheDocument())
  })
})
