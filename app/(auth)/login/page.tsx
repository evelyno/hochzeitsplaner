'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Ungültige Anmeldedaten')
            } else {
                // Fetch session to get user role
                const response = await fetch('/api/auth/session')
                const session = await response.json()

                // Redirect based on role
                if (session?.user?.role === 'USER' || session?.user?.role === 'CLIENT') {
                    router.push('/my-wedding')
                } else if (session?.user?.role === 'ADMIN' || session?.user?.role === 'OPERATOR' || session?.user?.role === 'SUPER_ADMIN') {
                    router.push('/dashboard')
                } else {
                    router.push('/dashboard')
                }
                router.refresh()
            }
        } catch (err) {
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Willkommen zurück</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>E-Mail</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@beispiel.de"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Passwort</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Anmelden...' : 'Anmelden'}
                    </button>
                </form>

                <div className={styles.footer}>
                    Noch kein Konto?{' '}
                    <Link href="/register" className={styles.link}>
                        Location registrieren
                    </Link>
                </div>
            </div>
        </div>
    )
}
