'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Search, Mail, Download, Filter, Users as UsersIcon } from 'lucide-react'

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

export default function EnhancedGuestListPage() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRSVP, setFilterRSVP] = useState('ALL')
    const [filterGroup, setFilterGroup] = useState('ALL')

    // Mock event ID
    const eventId = 'mock-event-id'

    useEffect(() => {
        // Mock data - in production, fetch from API
        const mockGuests: Guest[] = [
            { id: '1', name: 'Uncle Bob', email: 'bob@example.com', phone: '+49123456', rsvpStatus: 'ACCEPTED', mealPreference: 'STANDARD', tableNumber: 1, tableGroup: 'Familie', isPlusOne: false, hasChildren: false, childrenCount: 0 },
            { id: '2', name: 'Aunt Alice', email: 'alice@example.com', phone: '+49123457', rsvpStatus: 'ACCEPTED', mealPreference: 'VEGETARIAN', dietaryNotes: 'Keine Nüsse', tableNumber: 1, tableGroup: 'Familie', isPlusOne: false, hasChildren: true, childrenCount: 2 },
            { id: '3', name: 'Cousin Joe', email: 'joe@example.com', phone: '', rsvpStatus: 'DECLINED', mealPreference: 'STANDARD', tableGroup: 'Familie', isPlusOne: false, hasChildren: false, childrenCount: 0 },
            { id: '4', name: 'Best Friend Sarah', email: 'sarah@example.com', phone: '+49123458', rsvpStatus: 'PENDING', mealPreference: 'VEGAN', tableNumber: 2, tableGroup: 'Freunde', isPlusOne: false, hasChildren: false, childrenCount: 0 },
            { id: '5', name: 'Colleague Mike', email: 'mike@company.com', phone: '', rsvpStatus: 'PENDING', mealPreference: 'STANDARD', tableGroup: 'Arbeit', isPlusOne: false, hasChildren: false, childrenCount: 0 },
        ]
        setGuests(mockGuests)
        setFilteredGuests(mockGuests)
    }, [])

    useEffect(() => {
        let filtered = guests

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.email?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // RSVP filter
        if (filterRSVP !== 'ALL') {
            filtered = filtered.filter(g => g.rsvpStatus === filterRSVP)
        }

        // Group filter
        if (filterGroup !== 'ALL') {
            filtered = filtered.filter(g => g.tableGroup === filterGroup)
        }

        setFilteredGuests(filtered)
    }, [searchTerm, filterRSVP, filterGroup, guests])

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
                        className={styles.navItem}
                        style={{
                            background: 'white',
                            color: '#d4a373',
                            border: '2px solid #d4a373',
                            cursor: 'pointer',
                            flexDirection: 'row',
                            gap: '0.5rem',
                            width: 'auto',
                            padding: '0 1.5rem',
                            height: '48px'
                        }}
                    >
                        <Download size={20} /> CSV Export
                    </button>
                    <button
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
                        <Plus size={20} /> Gast hinzufügen
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.8rem', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: 1 }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Kontakt</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>RSVP</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Menü</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Allergien</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Tisch</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Gruppe</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Kinder</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuests.map((guest) => (
                            <tr key={guest.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 600 }}>{guest.name}</div>
                                    {guest.isPlusOne && <div style={{ fontSize: '0.75rem', color: '#999' }}>Begleitung</div>}
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
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#666' }}>
                                    {guest.dietaryNotes || '-'}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                                    {guest.tableNumber ? `Tisch ${guest.tableNumber}` : '-'}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{guest.tableGroup || '-'}</td>
                                <td style={{ padding: '1rem 1.5rem', color: '#666' }}>
                                    {guest.hasChildren ? `${guest.childrenCount}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
