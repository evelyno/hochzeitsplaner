'use client'

import styles from '../dashboard.module.css'
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

export default function VenueBudgetPage() {
    // Mock data - in production, fetch from API
    const clients = [
        { id: 1, names: 'Jonathan & Jane', date: 'Aug 12, 2024', totalBudget: 25000, spent: 11250, paid: 8500 },
        { id: 2, names: 'Michael & Sarah', date: 'Sep 05, 2024', totalBudget: 18000, spent: 5400, paid: 3000 },
        { id: 3, names: 'David & Emma', date: 'Oct 20, 2024', totalBudget: 30000, spent: 22500, paid: 15000 },
    ]

    const totalRevenue = clients.reduce((sum, c) => sum + c.paid, 0)
    const totalPending = clients.reduce((sum, c) => sum + (c.spent - c.paid), 0)

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>Budget Übersicht</h1>
                <p style={{ color: '#666' }}>Finanzielle Übersicht aller Hochzeiten</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <DollarSign size={18} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gesamtumsatz</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4caf50' }}>
                        €{totalRevenue.toLocaleString('de-DE')}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <AlertCircle size={18} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Ausstehend</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef6c00' }}>
                        €{totalPending.toLocaleString('de-DE')}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <TrendingUp size={18} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Aktive Hochzeiten</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>
                        {clients.length}
                    </div>
                </div>
            </div>

            {/* Client Budget Table */}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.85rem', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>PAAR</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>HOCHZEITSDATUM</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>GESAMTBUDGET</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>AUSGEGEBEN</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>BEZAHLT</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>AUSSTEHEND</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => {
                            const pending = client.spent - client.paid
                            const percentSpent = (client.spent / client.totalBudget) * 100

                            return (
                                <tr key={client.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{client.names}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{client.date}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>€{client.totalBudget.toLocaleString('de-DE')}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: percentSpent > 100 ? '#f44336' : '#666' }}>
                                        €{client.spent.toLocaleString('de-DE')}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#4caf50', fontWeight: 500 }}>
                                        €{client.paid.toLocaleString('de-DE')}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#ef6c00', fontWeight: 500 }}>
                                        €{pending.toLocaleString('de-DE')}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ width: '100%', maxWidth: 100 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 4 }}>
                                                {percentSpent.toFixed(0)}%
                                            </div>
                                            <div style={{ width: '100%', height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min(percentSpent, 100)}%`,
                                                    height: '100%',
                                                    background: percentSpent > 100 ? '#f44336' : '#d4a373'
                                                }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
