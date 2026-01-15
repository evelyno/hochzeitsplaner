'use client'

import { useState, useEffect } from 'react'
import styles from '../dashboard.module.css'
import { Plus, X, Calendar, Euro, Mail, User } from 'lucide-react'

interface Event {
    id: string
    name: string
    date: string
    budget?: number
    client: {
        id: string
        name: string
        email: string
    }
}

export default function ClientsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        eventName: '',
        eventDate: '',
        budget: ''
    })

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events')
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error('Failed to fetch events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                const newEvent = await res.json()
                setEvents([...events, newEvent])
                setShowModal(false)
                setFormData({
                    clientName: '',
                    clientEmail: '',
                    eventName: '',
                    eventDate: '',
                    budget: ''
                })
            }
        } catch (error) {
            console.error('Failed to create event:', error)
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>Kunden</h1>
                    <p style={{ color: '#666' }}>Verwalten Sie alle Hochzeiten und Paare</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        background: '#d4a373',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 500,
                        fontSize: '0.95rem'
                    }}
                >
                    <Plus size={18} /> Neuer Kunde
                </button>
            </div>

            {/* Events Grid */}
            {isLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
            ) : events.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#999' }}>
                    Noch keine Kunden. Fügen Sie Ihren ersten Kunden hinzu!
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {events.map((event) => (
                        <div key={event.id} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{event.client.name}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>{event.name}</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                    <Calendar size={14} />
                                    {new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                    <Mail size={14} />
                                    {event.client.email}
                                </div>
                                {event.budget && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                        <Euro size={14} />
                                        €{event.budget.toLocaleString('de-DE')} Budget
                                    </div>
                                )}
                            </div>

                            <button
                                style={{
                                    width: '100%',
                                    background: '#f5f6fa',
                                    border: '1px solid #eee',
                                    padding: '0.75rem',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: '#666'
                                }}
                            >
                                Details anzeigen
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Client Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: 12,
                        padding: '2rem',
                        maxWidth: 500,
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Neuer Kunde</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Name des Paares *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.clientName}
                                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                    placeholder="z.B. Anna & Max"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    E-Mail
                                </label>
                                <input
                                    type="email"
                                    value={formData.clientEmail}
                                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                    placeholder="anna.max@beispiel.de"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    placeholder="Hochzeit Anna & Max"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Hochzeitsdatum *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Budget (€)
                                </label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    placeholder="25000"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1,
                                        background: '#f5f6fa',
                                        border: '1px solid #eee',
                                        padding: '0.75rem',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        background: '#d4a373',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Kunde erstellen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
