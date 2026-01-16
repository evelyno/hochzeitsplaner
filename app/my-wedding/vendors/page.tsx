'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Phone, Mail, Globe, Star, Edit2, Trash2, X, Check } from 'lucide-react'

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [filterCategory, setFilterCategory] = useState('ALL')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        category: 'OTHER',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        status: 'RESEARCHING',
        quotedPrice: '',
        finalPrice: '',
        depositPaid: '0',
        contractSigned: false,
        rating: '',
        notes: ''
    })

    useEffect(() => {
        fetchUserEvent()
    }, [])

    const fetchUserEvent = async () => {
        try {
            const res = await fetch('/api/user-event')
            if (res.ok) {
                const event = await res.json()
                setEventId(event.id)
                fetchVendors(event.id)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Failed to fetch user event:', error)
            setIsLoading(false)
        }
    }

    const fetchVendors = async (evtId: string) => {
        try {
            const res = await fetch(`/api/vendors?eventId=${evtId}`)
            if (res.ok) {
                setVendors(await res.json())
            }
        } catch (error) {
            console.error('Failed to fetch vendors:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!eventId || isSubmitting) return

        setIsSubmitting(true)
        try {
            const url = '/api/vendors'
            const method = editingVendor ? 'PATCH' : 'POST'
            const body = editingVendor
                ? {
                    id: editingVendor.id,
                    ...formData,
                    quotedPrice: formData.quotedPrice ? parseFloat(formData.quotedPrice) : null,
                    finalPrice: formData.finalPrice ? parseFloat(formData.finalPrice) : null,
                    depositPaid: parseFloat(formData.depositPaid),
                    rating: formData.rating ? parseInt(formData.rating) : null
                }
                : {
                    eventId,
                    ...formData,
                    quotedPrice: formData.quotedPrice ? parseFloat(formData.quotedPrice) : null,
                    finalPrice: formData.finalPrice ? parseFloat(formData.finalPrice) : null,
                    depositPaid: parseFloat(formData.depositPaid),
                    rating: formData.rating ? parseInt(formData.rating) : null
                }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                await fetchVendors(eventId)
                setShowModal(false)
                setEditingVendor(null)
                resetForm()
            }
        } catch (error) {
            console.error('Failed to save vendor:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteVendor = async (id: string) => {
        if (!confirm('Möchten Sie diesen Dienstleister wirklich löschen?')) return
        try {
            const res = await fetch(`/api/vendors?id=${id}`, { method: 'DELETE' })
            if (res.ok && eventId) {
                await fetchVendors(eventId)
            }
        } catch (error) {
            console.error('Failed to delete vendor:', error)
        }
    }

    const openEditModal = (vendor: Vendor) => {
        setEditingVendor(vendor)
        setFormData({
            category: vendor.category,
            companyName: vendor.companyName,
            contactPerson: vendor.contactPerson || '',
            email: vendor.email || '',
            phone: vendor.phone || '',
            website: vendor.website || '',
            status: vendor.status,
            quotedPrice: vendor.quotedPrice?.toString() || '',
            finalPrice: vendor.finalPrice?.toString() || '',
            depositPaid: vendor.depositPaid.toString(),
            contractSigned: vendor.contractSigned,
            rating: vendor.rating?.toString() || '',
            notes: vendor.notes || ''
        })
        setShowModal(true)
    }

    const resetForm = () => {
        setFormData({
            category: 'OTHER',
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            website: '',
            status: 'RESEARCHING',
            quotedPrice: '',
            finalPrice: '',
            depositPaid: '0',
            contractSigned: false,
            rating: '',
            notes: ''
        })
    }

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
                    onClick={() => { setEditingVendor(null); resetForm(); setShowModal(true); }}
                    style={{ background: '#d4a373', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                >
                    <Plus size={18} /> Dienstleister hinzufügen
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
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Vendor Cards */}
            {isLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
            ) : filteredVendors.length === 0 ? (
                <div className={styles.card} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                    Keine Dienstleister gefunden. Fügen Sie Ihren ersten Dienstleister hinzu!
                </div>
            ) : (
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
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {vendor.rating && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ffc107' }}>
                                                    <Star size={16} fill="#ffc107" />
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{vendor.rating}</span>
                                                </div>
                                            )}
                                        </div>
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
                                            {vendor.contractSigned && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4caf50', fontSize: '0.85rem' }}>
                                                    <Check size={16} />
                                                    Vertrag
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => openEditModal(vendor)} style={{ border: 'none', background: '#f5f6fa', cursor: 'pointer', color: '#666', padding: '0.5rem 1rem', borderRadius: 6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Edit2 size={16} /> Bearbeiten
                                        </button>
                                        <button onClick={() => deleteVendor(vendor.id)} style={{ border: 'none', background: '#ffebee', cursor: 'pointer', color: '#f44336', padding: '0.5rem 1rem', borderRadius: 6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Trash2 size={16} /> Löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{editingVendor ? 'Dienstleister bearbeiten' : 'Neuer Dienstleister'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kategorie *</label>
                                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                        {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Firmenname *</label>
                                    <input required type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ansprechpartner</label>
                                    <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
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
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Website</label>
                                    <input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="beispiel.de" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Angebotspreis (€)</label>
                                    <input type="number" step="0.01" value={formData.quotedPrice} onChange={(e) => setFormData({ ...formData, quotedPrice: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Endpreis (€)</label>
                                    <input type="number" step="0.01" value={formData.finalPrice} onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Anzahlung (€)</label>
                                    <input type="number" step="0.01" value={formData.depositPaid} onChange={(e) => setFormData({ ...formData, depositPaid: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Bewertung (1-5)</label>
                                    <input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type="checkbox" checked={formData.contractSigned} onChange={(e) => setFormData({ ...formData, contractSigned: e.target.checked })} style={{ width: 18, height: 18 }} />
                                    <label style={{ fontSize: '0.9rem' }}>Vertrag unterzeichnet</label>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Notizen</label>
                                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8, fontFamily: 'inherit' }} />
                                </div>
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
