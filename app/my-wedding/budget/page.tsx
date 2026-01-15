'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react'

interface BudgetItem {
    id: string
    category: string
    name: string
    plannedAmount: number
    actualAmount: number
    paidAmount: number
    paymentStatus: string
    vendor?: string
}

const CATEGORY_LABELS: Record<string, string> = {
    VENUE: 'Location',
    CATERING: 'Catering',
    PHOTOGRAPHY: 'Fotografie',
    VIDEOGRAPHY: 'Videografie',
    FLOWERS: 'Blumen',
    MUSIC: 'Musik',
    DRESS: 'Brautkleid',
    SUIT: 'Anzug',
    RINGS: 'Ringe',
    INVITATIONS: 'Einladungen',
    DECORATION: 'Dekoration',
    TRANSPORTATION: 'Transport',
    OTHER: 'Sonstiges'
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Ausstehend',
    PARTIAL: 'Teilweise bezahlt',
    PAID: 'Bezahlt'
}

export default function BudgetPage() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    // Mock event ID - in production, get from session/context
    const eventId = 'mock-event-id'

    useEffect(() => {
        fetchBudgetItems()
    }, [])

    const fetchBudgetItems = async () => {
        try {
            const res = await fetch(`/api/budget?eventId=${eventId}`)
            if (res.ok) {
                const data = await res.json()
                setBudgetItems(data)
            }
        } catch (error) {
            console.error('Failed to fetch budget items:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const totalPlanned = budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0)
    const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0)
    const totalPaid = budgetItems.reduce((sum, item) => sum + item.paidAmount, 0)
    const percentageSpent = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Budget</h1>
                    <p style={{ color: '#666' }}>Verwalten Sie Ihr Hochzeitsbudget</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={styles.navItem}
                    style={{
                        background: '#d4a373',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        flexDirection: 'row',
                        gap: '0.5rem',
                        width: 'auto',
                        padding: '0 1.5rem',
                        height: '48px'
                    }}
                >
                    <Plus size={20} /> Neue Position
                </button>
            </div>

            {/* Budget Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <DollarSign size={18} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Geplant</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a' }}>
                        €{totalPlanned.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <DollarSign size={18} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Tatsächlich</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: totalActual > totalPlanned ? '#f44336' : '#1a1a1a' }}>
                        €{totalActual.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <DollarSign size={18} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Bezahlt</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4caf50' }}>
                        €{totalPaid.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Ausgegeben</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: percentageSpent > 100 ? '#f44336' : '#d4a373' }}>
                        {percentageSpent.toFixed(1)}%
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#eee', borderRadius: 3, marginTop: '0.5rem', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min(percentageSpent, 100)}%`,
                            height: '100%',
                            background: percentageSpent > 100 ? '#f44336' : '#d4a373',
                            transition: 'width 0.3s'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* Budget Items Table */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
                ) : budgetItems.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                        Noch keine Budgetpositionen. Klicken Sie auf "Neue Position" um zu beginnen.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.8rem', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: 1 }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Kategorie</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Position</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Anbieter</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Geplant</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Tatsächlich</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Bezahlt</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetItems.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{CATEGORY_LABELS[item.category]}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{item.name}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{item.vendor || '-'}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>€{item.plannedAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: item.actualAmount > item.plannedAmount ? '#f44336' : '#666' }}>
                                        €{item.actualAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#4caf50' }}>€{item.paidAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 50,
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                            background: item.paymentStatus === 'PAID' ? '#e8f5e9' : item.paymentStatus === 'PARTIAL' ? '#fff3e0' : '#ffebee',
                                            color: item.paymentStatus === 'PAID' ? '#2e7d32' : item.paymentStatus === 'PARTIAL' ? '#ef6c00' : '#c62828'
                                        }}>
                                            {STATUS_LABELS[item.paymentStatus]}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f44336' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
