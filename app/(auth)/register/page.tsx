'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        venueName: '',
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text)
            }

            router.push('/login')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Register Venue</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Venue Name</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={formData.venueName}
                            onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                            required
                            placeholder="Grand Hotel"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="contact@grandhotel.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <label className={styles.checkbox}>
                        <input type="checkbox" required />
                        <span>
                            I agree to the <a href="#" className={styles.link}>Privacy Policy</a> and confirm that I have read the GDPR compliance statement.
                        </span>
                    </label>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Venue Account'}
                    </button>
                </form>

                <div className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}
