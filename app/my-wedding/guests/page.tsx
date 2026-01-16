'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Search, Download, Edit2, Trash2, X, CheckSquare, Square } from 'lucide-react'

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
    const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRSVP, setFilterRSVP] = useState('ALL')
    const [filterGroup, setFilterGroup] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bulkAction, setBulkAction] = useState({
        rsvpStatus: '',
        tableNumber: '',
        tableGroup: ''
    })
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

    const handleBulkUpdate = async () => {
        if (selectedGuests.size === 0 || !eventId || isSubmitting) return

        setIsSubmitting(true)
        try {
            // Update each selected guest
            const updates = Array.from(selectedGuests).map(guestId => {
                const updateData: any = { id: guestId }
                if (bulkAction.rsvpStatus) updateData.rsvpStatus = bulkAction.rsvpStatus
                if (bulkAction.tableNumber) updateData.tableNumber = parseInt(bulkAction.tableNumber)
                if (bulkAction.tableGroup) updateData.tableGroup = bulkAction.tableGroup

                return fetch('/api/guests', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                })
            })

            await Promise.all(updates)
            await fetchGuests(eventId)
            setShowBulkModal(false)
            setSelectedGuests(new Set())
            setBulkAction({ rsvpStatus: '', tableNumber: '', tableGroup: '' })
        } catch (error) {
            console.error('Failed to bulk update guests:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedGuests.size === 0) return
        if (!confirm(`Möchten Sie wirklich ${selectedGuests.size} Gäste löschen?`)) return

        try {
            const deletes = Array.from(selectedGuests).map(guestId =>
                fetch(`/api/guests?id=${guestId}`, { method: 'DELETE' })
            )

            await Promise.all(deletes)
            if (eventId) await fetchGuests(eventId)
            setSelectedGuests(new Set())
        } catch (error) {
            console.error('Failed to bulk delete guests:', error)
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

    const toggleSelectAll = () => {
        if (selectedGuests.size === filteredGuests.length) {
            setSelectedGuests(new Set())
        } else {
            setSelectedGuests(new Set(filteredGuests.map(g => g.id)))
        }
    }

    const toggleSelectGuest = (guestId: string) => {
        const newSelected = new Set(selectedGuests)
        if (newSelected.has(guestId)) {
            newSelected.delete(guestId)
        } else {
            newSelected.add(guestId)
        }
        setSelectedGuests(newSelected)
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

            {/* Bulk Actions Bar */}
            {selectedGuests.size > 0 && (
                <div style={{ background: '#fff5eb', border: '1px solid #d4a373', borderRadius: 8, padding: '1rem 1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: '#d4a373' }}>
                        {selectedGuests.size} Gäste ausgewählt
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setShowBulkModal(true)}
                            style={{ background: '#d4a373', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Bulk-Bearbeitung
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Ausgewählte löschen
                        </button>
                        <button
                            onClick={() => setSelectedGuests(new Set())}
                            style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Abbrechen
                        </button>
                    </div>
                </div>
            )}

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
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, width: 40 }}>
                                    <button onClick={toggleSelectAll} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                                        {selectedGuests.size === filteredGuests.length ? <CheckSquare size={20} color="#d4a373" /> : <Square size={20} color="#999" />}
                                    </button>
                                </th>
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
                                <tr key={guest.id} style={{ borderBottom: '1px solid #f9f9f9', background: selectedGuests.has(guest.id) ? '#fff5eb' : 'transparent' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <button onClick={() => toggleSelectGuest(guest.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                                            {selectedGuests.has(guest.id) ? <CheckSquare size={20} color="#d4a373" /> : <Square size={20} color="#999" />}
                                        </button>
                                    </td>
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

            {/* Bulk Edit Modal */}
            {showBulkModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Bulk-Bearbeitung ({selectedGuests.size} Gäste)</h2>
                            <button onClick={() => setShowBulkModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>RSVP Status ändern</label>
                            <select value={bulkAction.rsvpStatus} onChange={(e) => setBulkAction({ ...bulkAction, rsvpStatus: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                <option value="">-- Nicht ändern --</option>
                                {Object.entries(RSVP_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tischnummer zuweisen</label>
                            <input type="number" value={bulkAction.tableNumber} onChange={(e) => setBulkAction({ ...bulkAction, tableNumber: e.target.value })} placeholder="Leer lassen für keine Änderung" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Gruppe zuweisen</label>
                            <input type="text" value={bulkAction.tableGroup} onChange={(e) => setBulkAction({ ...bulkAction, tableGroup: e.target.value })} placeholder="Leer lassen für keine Änderung" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowBulkModal(false)} style={{ flex: 1, background: '#f5f6fa', border: '1px solid #eee', padding: '0.75rem', borderRadius: 8, cursor: 'pointer' }}>Abbrechen</button>
                            <button onClick={handleBulkUpdate} disabled={isSubmitting} style={{ flex: 1, background: isSubmitting ? '#ccc' : '#d4a373', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? 'Aktualisiert...' : 'Anwenden'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
