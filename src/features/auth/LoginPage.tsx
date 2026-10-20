import { useState } from 'react'
import { supabase } from '../../data/supabase/client'
import { t } from '../../i18n/pt-BR'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setStatus(error ? 'error' : 'sent')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-neutral-900">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold text-neutral-900 dark:text-white">
          {t('app.title')}
        </h1>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {t('auth.emailLabel')}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-white dark:bg-white dark:text-neutral-900"
        >
          {t('auth.sendLinkButton')}
        </button>
        {status === 'sent' && (
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            {t('auth.checkEmail')}
          </p>
        )}
        {status === 'error' && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            {t('auth.genericError')}
          </p>
        )}
      </form>
    </div>
  )
}
