'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Phone, Mail, Globe, Star, FileText, Check, X } from 'lucide-react'

interface Vendor {
    id: string
    category: string
    companyName: string
    contactPerson?: string
    email?: string
    phone?: string
    website?: string
    status: string
    quotedPrice?: number
    finalPrice?: number
    depositPaid: number
    contractSigned: boolean
    rating?: number
    notes?: string
}

const CATEGORY_LABELS: Record<string, string> = {
    VENUE: 'Location',
    CATERING: 'Catering',
    PHOTOGRAPHY: 'Fotografie',
    VIDEOGRAPHY: 'Videografie',
    FLORIST: 'Floristik',
    MUSIC_DJ: 'DJ',
    MUSIC_BAND: 'Band',
    HAIR_MAKEUP: 'Haare & Make-up',
    DRESS: 'Brautkleid',
    SUIT: 'Anzug',
    CAKE: 'Torte',
    DECORATION: 'Dekoration',
    TRANSPORTATION: 'Transport',
    INVITATIONS: 'Einladungen',
    ENTERTAINMENT: 'Unterhaltung',
    OTHER: 'Sonstiges'
}

const STATUS_LABELS: Record<string, string> = {
    RESEARCHING: 'In Recherche',
    CONTACTED: 'Kontaktiert',
    QUOTE_RECEIVED: 'Angebot erhalten',
    BOOKED: 'Gebucht',
    CONFIRMED: 'Bestätigt',
    COMPLETED: 'Abgeschlossen',
    CANCELLED: 'Storniert'
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    RESEARCHING: { bg: '#f5f5f5', text: '#666' },
    CONTACTED: { bg: '#e3f2fd', text: '#1976d2' },
    QUOTE_RECEIVED: { bg: '#fff3e0', text: '#ef6c00' },
    BOOKED: { bg: '#e8f5e9', text: '#2e7d32' },
    CONFIRMED: { bg: '#e8f5e9', text: '#2e7d32' },
    COMPLETED: { bg: '#f3e5f5', text: '#7b1fa2' },
    CANCELLED: { bg: '#ffebee', text: '#c62828' }
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterCategory, setFilterCategory] = useState('ALL')
    const [filterStatus, setFilterStatus] = useState('ALL')

    const eventId = 'mock-event-id'

    useEffect(() => {
        // Mock data
        const mockVendors: Vendor[] = [
            { id: '1', category: 'PHOTOGRAPHY', companyName: 'Moments Photography', contactPerson: 'Anna Schmidt', email: 'anna@moments.de', phone: '+49123456', website: 'moments-photo.de', status: 'BOOKED', quotedPrice: 2500, finalPrice: 2300, depositPaid: 500, contractSigned: true, rating: 5 },
            { id: '2', category: 'CATERING', companyName: 'Gourmet Delights', contactPerson: 'Chef Thomas', email: 'info@gourmet.de', phone: '+49123457', status: 'QUOTE_RECEIVED', quotedPrice: 8500, depositPaid: 0, contractSigned: false },
            { id: '3', category: 'FLORIST', companyName: 'Blumen Paradies', contactPerson: 'Maria Blume', email: 'maria@blumen.de', phone: '+49123458', status: 'CONTACTED', depositPaid: 0, contractSigned: false },
            { id: '4', category: 'MUSIC_DJ', companyName: 'DJ Soundwave', contactPerson: 'Max Beats', email: 'max@soundwave.de', status: 'RESEARCHING', depositPaid: 0, contractSigned: false },
        ]
        setVendors(mockVendors)
        setIsLoading(false)
    }, [])

    const filteredVendors = vendors.filter(v => {
        if (filterCategory !== 'ALL' && v.category !== filterCategory) return false
        if (filterStatus !== 'ALL' && v.status !== filterStatus) return false
        return true
    })

    const totalBudget = vendors.reduce((sum, v) => sum + (v.finalPrice || v.quotedPrice || 0), 0)
    const totalPaid = vendors.reduce((sum, v) => sum + v.depositPaid, 0)
    const bookedCount = vendors.filter(v => v.status === 'BOOKED' || v.status === 'CONFIRMED').length

    const uniqueCategories = Array.from(new Set(vendors.map(v => v.category)))

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Dienstleister</h1>
                    <p style={{ color: '#666' }}>Verwalten Sie alle Ihre Hochzeitsdienstleister</p>
                </div>
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
                    <Plus size={20} /> Dienstleister hinzufügen
                </button>
            </div>

            {/* Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gesamtkosten</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a' }}>€{totalBudget.toLocaleString('de-DE')}</div>
                </div>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Anzahlungen</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4caf50' }}>€{totalPaid.toLocaleString('de-DE')}</div>
                </div>
                <div className={styles.card} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gebucht</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#d4a373' }}>{bookedCount} / {vendors.length}</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ border: '1px solid #eee', background: 'white', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                    <option value="ALL">Alle Kategorien</option>
                    {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ border: '1px solid #eee', background: 'white', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                    <option value="ALL">Alle Status</option>
                    <option value="RESEARCHING">In Recherche</option>
                    <option value="CONTACTED">Kontaktiert</option>
                    <option value="QUOTE_RECEIVED">Angebot erhalten</option>
                    <option value="BOOKED">Gebucht</option>
                    <option value="CONFIRMED">Bestätigt</option>
                </select>
            </div>

            {/* Vendor Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {filteredVendors.map((vendor) => {
                    const statusColor = STATUS_COLORS[vendor.status]
                    return (
                        <div key={vendor.id} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f5f5f5' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>
                                            {CATEGORY_LABELS[vendor.category]}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{vendor.companyName}</h3>
                                    </div>
                                    {vendor.rating && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ffc107' }}>
                                            <Star size={16} fill="#ffc107" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{vendor.rating}</span>
                                        </div>
                                    )}
                                </div>

                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: 50,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    background: statusColor.bg,
                                    color: statusColor.text
                                }}>
                                    {STATUS_LABELS[vendor.status]}
                                </span>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                {vendor.contactPerson && (
                                    <div style={{ marginBottom: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                                        👤 {vendor.contactPerson}
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {vendor.email && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                            <Mail size={14} />
                                            <a href={`mailto:${vendor.email}`} style={{ color: '#d4a373', textDecoration: 'none' }}>{vendor.email}</a>
                                        </div>
                                    )}
                                    {vendor.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                            <Phone size={14} />
                                            {vendor.phone}
                                        </div>
                                    )}
                                    {vendor.website && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                            <Globe size={14} />
                                            <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#d4a373', textDecoration: 'none' }}>{vendor.website}</a>
                                        </div>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        {vendor.finalPrice ? (
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#999' }}>Endpreis</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a' }}>€{vendor.finalPrice.toLocaleString('de-DE')}</div>
                                            </div>
                                        ) : vendor.quotedPrice ? (
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#999' }}>Angebot</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#666' }}>€{vendor.quotedPrice.toLocaleString('de-DE')}</div>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem', color: '#999' }}>Kein Preis</div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {vendor.contractSigned ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4caf50', fontSize: '0.85rem' }}>
                                                <Check size={16} />
                                                Vertrag
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#999', fontSize: '0.85rem' }}>
                                                <X size={16} />
                                                Kein Vertrag
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filteredVendors.length === 0 && (
                <div className={styles.card} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                    Keine Dienstleister gefunden. Fügen Sie Ihren ersten Dienstleister hinzu!
                </div>
            )}
        </div>
    )
}
