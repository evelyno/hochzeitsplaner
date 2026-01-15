import Link from 'next/link'
import styles from './(auth)/auth.module.css'

export default function Home() {
    return (
        <main className={styles.container} style={{ flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    WeddingPlanner
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: 600, lineHeight: 1.6 }}>
                    The premium platform for venues to manage weddings and for couples to plan their perfect day.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link href="/login" className={styles.button} style={{ textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                    Sign In
                </Link>
                <Link href="/register" className={styles.button} style={{
                    textDecoration: 'none',
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    background: 'white',
                    color: '#d4a373',
                    border: '2px solid #d4a373'
                }}>
                    Register Venue
                </Link>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', opacity: 0.8 }}>
                <div className={styles.card} style={{ width: 250, padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: '#d4a373' }}>For Venues</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Manage multiple weddings, track revenue, and organize events efficiently.</p>
                </div>
                <div className={styles.card} style={{ width: 250, padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: '#d4a373' }}>For Couples</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Your personal dashboard with checklists, guest tracking, and budget tools.</p>
                </div>
            </div>
        </main>
    )
}
