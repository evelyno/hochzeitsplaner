'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

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
    VENUE: 'Location', CATERING: 'Catering', PHOTOGRAPHY: 'Fotografie', VIDEOGRAPHY: 'Videografie',
    FLORIST: 'Floristik', MUSIC_DJ: 'DJ', MUSIC_BAND: 'Band', HAIR_MAKEUP: 'Haare & Make-up',
    DRESS: 'Brautkleid', SUIT: 'Anzug', RINGS: 'Ringe', INVITATIONS: 'Einladungen',
    DECORATION: 'Dekoration', TRANSPORTATION: 'Transport', CAKE: 'Torte', ENTERTAINMENT: 'Unterhaltung', OTHER: 'Sonstiges'
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Ausstehend', PARTIAL: 'Teilweise bezahlt', PAID: 'Bezahlt'
}

export default function BudgetPage() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
    const [formData, setFormData] = useState({
        category: 'VENUE', name: '', plannedAmount: '', vendor: ''
    })

    const eventId = 'mock-event-id'

    useEffect(() => {
        fetchBudgetItems()
    }, [])

    const fetchBudgetItems = async () => {
        try {
            const res = await fetch(`/api/budget?eventId=${eventId}`)
            if (res.ok) setBudgetItems(await res.json())
        } catch (error) {
            console.error('Failed to fetch budget items:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const url = editingItem ? '/api/budget' : '/api/budget'
            const method = editingItem ? 'PATCH' : 'POST'
            const body = editingItem
                ? { id: editingItem.id, ...formData }
                : { eventId, ...formData }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                fetchBudgetItems()
                setShowModal(false)
                setEditingItem(null)
                setFormData({ category: 'VENUE', name: '', plannedAmount: '', vendor: '' })
            }
        } catch (error) {
            console.error('Failed to save budget item:', error)
        }
    }

    const deleteItem = async (id: string) => {
        if (!confirm('Möchten Sie diese Position wirklich löschen?')) return
        try {
            const res = await fetch(`/api/budget?id=${id}`, { method: 'DELETE' })
            if (res.ok) setBudgetItems(budgetItems.filter(i => i.id !== id))
        } catch (error) {
            console.error('Failed to delete budget item:', error)
        }
    }

    const openEditModal = (item: BudgetItem) => {
        setEditingItem(item)
        setFormData({
            category: item.category,
            name: item.name,
            plannedAmount: item.plannedAmount.toString(),
            vendor: item.vendor || ''
        })
        setShowModal(true)
    }

    const totalPlanned = budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0)
    const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0)
    const totalPaid = budgetItems.reduce((sum, item) => sum + item.paidAmount, 0)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Budget</h1>
                    <p style={{ color: '#666' }}>Verwalten Sie Ihr Hochzeitsbudget</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    className={styles.navItem}
                    style={{ background: '#d4a373', color: 'white', border: 'none', cursor: 'pointer', flexDirection: 'row', gap: '0.5rem', width: 'auto', padding: '0 1.5rem', height: '48px' }}
                >
                    <Plus size={20} /> Neue Position
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Geplant</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>€{totalPlanned.toLocaleString('de-DE')}</div>
                </div>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Tatsächlich</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: totalActual > totalPlanned ? '#f44336' : '#1a1a1a' }}>€{totalActual.toLocaleString('de-DE')}</div>
                </div>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Bezahlt</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4caf50' }}>€{totalPaid.toLocaleString('de-DE')}</div>
                </div>
            </div>

            {/* Budget Table */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                {budgetItems.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Noch keine Budgetpositionen.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.8rem', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Kategorie</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Position</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Anbieter</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Geplant</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetItems.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{CATEGORY_LABELS[item.category]}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{item.name}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{item.vendor || '-'}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>€{item.plannedAmount.toLocaleString('de-DE')}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: 50, fontSize: '0.8rem', background: item.paymentStatus === 'PAID' ? '#e8f5e9' : '#ffebee', color: item.paymentStatus === 'PAID' ? '#2e7d32' : '#c62828' }}>
                                            {STATUS_LABELS[item.paymentStatus]}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEditModal(item)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}><Edit2 size={16} /></button>
                                            <button onClick={() => deleteItem(item.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f44336' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{editingItem ? 'Position bearbeiten' : 'Neue Position'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kategorie</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Position *</label>
                                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Geplanter Betrag (€) *</label>
                                <input required type="number" value={formData.plannedAmount} onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Anbieter</label>
                                <input type="text" value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#f5f6fa', border: '1px solid #eee', padding: '0.75rem', borderRadius: 8, cursor: 'pointer' }}>Abbrechen</button>
                                <button type="submit" style={{ flex: 1, background: '#d4a373', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 8, cursor: 'pointer' }}>Speichern</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
