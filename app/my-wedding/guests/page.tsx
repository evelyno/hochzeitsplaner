'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Search, Download, Edit2, Trash2, X } from 'lucide-react'

interface Guest {
    id: string
    name: string
    email?: string
    phone?: string
    rsvpStatus: string
    mealPreference: string
    dietaryNotes?: string
    tableNumber?: number
    tableGroup?: string
    isPlusOne: boolean
    hasChildren: boolean
    childrenCount: number
}

const RSVP_LABELS: Record<string, string> = {
    PENDING: 'Ausstehend',
    ACCEPTED: 'Zugesagt',
    DECLINED: 'Abgesagt'
}

const MEAL_LABELS: Record<string, string> = {
    STANDARD: 'Standard',
    VEGETARIAN: 'Vegetarisch',
    VEGAN: 'Vegan',
    GLUTEN_FREE: 'Glutenfrei',
    HALAL: 'Halal',
    KOSHER: 'Koscher',
    OTHER: 'Sonstiges'
}

export default function GuestListPage() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRSVP, setFilterRSVP] = useState('ALL')
    const [filterGroup, setFilterGroup] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rsvpStatus: 'PENDING',
        mealPreference: 'STANDARD',
        dietaryNotes: '',
        tableNumber: '',
        tableGroup: '',
        isPlusOne: false,
        hasChildren: false,
        childrenCount: '0'
    })

    useEffect(() => {
        fetchUserEvent()
    }, [])

    useEffect(() => {
        let filtered = guests

        if (searchTerm) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.email?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filterRSVP !== 'ALL') {
            filtered = filtered.filter(g => g.rsvpStatus === filterRSVP)
        }

        if (filterGroup !== 'ALL') {
            filtered = filtered.filter(g => g.tableGroup === filterGroup)
        }

        setFilteredGuests(filtered)
    }, [searchTerm, filterRSVP, filterGroup, guests])

    const fetchUserEvent = async () => {
        try {
            const res = await fetch('/api/user-event')
            if (res.ok) {
                const event = await res.json()
                setEventId(event.id)
                fetchGuests(event.id)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Failed to fetch user event:', error)
            setIsLoading(false)
        }
    }

    const fetchGuests = async (evtId: string) => {
        try {
            const res = await fetch(`/api/guests?eventId=${evtId}`)
            if (res.ok) {
                setGuests(await res.json())
            }
        } catch (error) {
            console.error('Failed to fetch guests:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!eventId || isSubmitting) return

        setIsSubmitting(true)
        try {
            const url = '/api/guests'
            const method = editingGuest ? 'PATCH' : 'POST'
            const body = editingGuest
                ? { id: editingGuest.id, ...formData, tableNumber: formData.tableNumber ? parseInt(formData.tableNumber) : null, childrenCount: parseInt(formData.childrenCount) }
                : { eventId, ...formData, tableNumber: formData.tableNumber ? parseInt(formData.tableNumber) : null, childrenCount: parseInt(formData.childrenCount) }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                await fetchGuests(eventId)
                setShowModal(false)
                setEditingGuest(null)
                resetForm()
            }
        } catch (error) {
            console.error('Failed to save guest:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteGuest = async (id: string) => {
        if (!confirm('Möchten Sie diesen Gast wirklich löschen?')) return
        try {
            const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' })
            if (res.ok && eventId) {
                await fetchGuests(eventId)
            }
        } catch (error) {
            console.error('Failed to delete guest:', error)
        }
    }

    const openEditModal = (guest: Guest) => {
        setEditingGuest(guest)
        setFormData({
            name: guest.name,
            email: guest.email || '',
            phone: guest.phone || '',
            rsvpStatus: guest.rsvpStatus,
            mealPreference: guest.mealPreference,
            dietaryNotes: guest.dietaryNotes || '',
            tableNumber: guest.tableNumber?.toString() || '',
            tableGroup: guest.tableGroup || '',
            isPlusOne: guest.isPlusOne,
            hasChildren: guest.hasChildren,
            childrenCount: guest.childrenCount.toString()
        })
        setShowModal(true)
    }

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            rsvpStatus: 'PENDING',
            mealPreference: 'STANDARD',
            dietaryNotes: '',
            tableNumber: '',
            tableGroup: '',
            isPlusOne: false,
            hasChildren: false,
            childrenCount: '0'
        })
    }

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Telefon', 'RSVP', 'Menü', 'Allergien', 'Tisch', 'Gruppe', 'Kinder']
        const rows = filteredGuests.map(g => [
            g.name,
            g.email || '',
            g.phone || '',
            RSVP_LABELS[g.rsvpStatus],
            MEAL_LABELS[g.mealPreference],
            g.dietaryNotes || '',
            g.tableNumber?.toString() || '',
            g.tableGroup || '',
            g.hasChildren ? `Ja (${g.childrenCount})` : 'Nein'
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'gaesteliste.csv'
        link.click()
    }

    const totalGuests = guests.length
    const accepted = guests.filter(g => g.rsvpStatus === 'ACCEPTED').length
    const declined = guests.filter(g => g.rsvpStatus === 'DECLINED').length
    const pending = guests.filter(g => g.rsvpStatus === 'PENDING').length
    const totalChildren = guests.reduce((sum, g) => sum + g.childrenCount, 0)

    const uniqueGroups = Array.from(new Set(guests.map(g => g.tableGroup).filter(Boolean)))

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Gästeliste</h1>
                    <p style={{ color: '#666' }}>Verwalten Sie RSVPs und Tischzuordnungen</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={exportToCSV}
                        style={{ background: 'white', color: '#d4a373', border: '2px solid #d4a373', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                    >
                        <Download size={18} /> CSV Export
                    </button>
                    <button
                        onClick={() => { setEditingGuest(null); resetForm(); setShowModal(true); }}
                        style={{ background: '#d4a373', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                    >
                        <Plus size={18} /> Gast hinzufügen
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{totalGuests}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Eingeladen</div>
                </div>
                <div className={styles.card} style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4caf50' }}>{accepted}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Zugesagt</div>
                </div>
                <div className={styles.card} style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f44336' }}>{declined}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Abgesagt</div>
                </div>
                <div className={styles.card} style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef6c00' }}>{pending}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Ausstehend</div>
                </div>
                <div className={styles.card} style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#9c27b0' }}>{totalChildren}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Kinder</div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5f6fa', padding: '0.75rem 1rem', borderRadius: 8, flex: 1, minWidth: 250 }}>
                        <Search size={18} color="#999" />
                        <input
                            type="text"
                            placeholder="Suche nach Name oder Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        />
                    </div>

                    <select
                        value={filterRSVP}
                        onChange={(e) => setFilterRSVP(e.target.value)}
                        style={{ border: '1px solid #eee', background: 'white', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <option value="ALL">Alle RSVP Status</option>
                        <option value="ACCEPTED">Zugesagt</option>
                        <option value="PENDING">Ausstehend</option>
                        <option value="DECLINED">Abgesagt</option>
                    </select>

                    <select
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        style={{ border: '1px solid #eee', background: 'white', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <option value="ALL">Alle Gruppen</option>
                        {uniqueGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                {/* Guest Table */}
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
                ) : filteredGuests.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                        Noch keine Gäste. Fügen Sie Ihren ersten Gast hinzu!
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.8rem', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: 1 }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Name</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Kontakt</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>RSVP</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Menü</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Tisch</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Gruppe</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuests.map((guest) => (
                                <tr key={guest.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{guest.name}</div>
                                        {guest.hasChildren && <div style={{ fontSize: '0.75rem', color: '#999' }}>{guest.childrenCount} Kind(er)</div>}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#666' }}>
                                        {guest.email && <div>{guest.email}</div>}
                                        {guest.phone && <div>{guest.phone}</div>}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 50,
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                            background: guest.rsvpStatus === 'ACCEPTED' ? '#e8f5e9' : guest.rsvpStatus === 'PENDING' ? '#fff3e0' : '#ffebee',
                                            color: guest.rsvpStatus === 'ACCEPTED' ? '#2e7d32' : guest.rsvpStatus === 'PENDING' ? '#ef6c00' : '#c62828'
                                        }}>
                                            {RSVP_LABELS[guest.rsvpStatus]}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{MEAL_LABELS[guest.mealPreference]}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                                        {guest.tableNumber ? `Tisch ${guest.tableNumber}` : '-'}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{guest.tableGroup || '-'}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEditModal(guest)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666', padding: '0.25rem' }}><Edit2 size={16} /></button>
                                            <button onClick={() => deleteGuest(guest.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f44336', padding: '0.25rem' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{editingGuest ? 'Gast bearbeiten' : 'Neuer Gast'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name *</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Telefon</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>RSVP Status</label>
                                    <select value={formData.rsvpStatus} onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                        {Object.entries(RSVP_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Menüwahl</label>
                                    <select value={formData.mealPreference} onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                        {Object.entries(MEAL_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Allergien/Diätwünsche</label>
                                    <input type="text" value={formData.dietaryNotes} onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })} placeholder="z.B. Keine Nüsse" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tischnummer</label>
                                    <input type="number" value={formData.tableNumber} onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Gruppe</label>
                                    <input type="text" value={formData.tableGroup} onChange={(e) => setFormData({ ...formData, tableGroup: e.target.value })} placeholder="z.B. Familie, Freunde" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type="checkbox" checked={formData.hasChildren} onChange={(e) => setFormData({ ...formData, hasChildren: e.target.checked })} style={{ width: 18, height: 18 }} />
                                    <label style={{ fontSize: '0.9rem' }}>Hat Kinder</label>
                                </div>
                                {formData.hasChildren && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Anzahl Kinder</label>
                                        <input type="number" min="0" value={formData.childrenCount} onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#f5f6fa', border: '1px solid #eee', padding: '0.75rem', borderRadius: 8, cursor: 'pointer' }}>Abbrechen</button>
                                <button type="submit" disabled={isSubmitting} style={{ flex: 1, background: isSubmitting ? '#ccc' : '#d4a373', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                    {isSubmitting ? 'Speichert...' : 'Speichern'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
