'use client'

import styles from './client-dashboard.module.css'
import { CheckCircle2, Circle } from 'lucide-react'

export default function ClientDashboardPage() {
    return (
        <div>
            <div className={styles.heroCard}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.5rem' }}>142 Days</h1>
                <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Until your special day on August 24, 2024</p>

                <div className={styles.countdown}>
                    <div className={styles.countdownItem}>
                        <span className={styles.countdownValue}>142</span>
                        <span className={styles.countdownLabel}>Days</span>
                    </div>
                    <div className={styles.countdownItem}>
                        <span className={styles.countdownValue}>12</span>
                        <span className={styles.countdownLabel}>Hours</span>
                    </div>
                    <div className={styles.countdownItem}>
                        <span className={styles.countdownValue}>45</span>
                        <span className={styles.countdownLabel}>Minutes</span>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Priority Tasks</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { text: 'Finalize Guest List', status: 'pending' },
                            { text: 'Book Photographer', status: 'pending' },
                            { text: 'Send Save the Dates', status: 'done' }
                        ].map((task, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: 8 }}>
                                {task.status === 'done' ? <CheckCircle2 size={20} color="#4caf50" /> : <Circle size={20} color="#d4a373" />}
                                <span style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? '#999' : '#333' }}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Budget Summary</h2>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#666' }}>Total Budget</span>
                            <span style={{ fontWeight: 600 }}>$25,000</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: '45%', height: '100%', background: '#d4a373' }}></div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>45% Spent</div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            <span>Venue</span>
                            <span>$12,000</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            <span>Catering</span>
                            <span>$4,500</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
