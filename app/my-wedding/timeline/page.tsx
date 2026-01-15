'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Edit2, Trash2, X, Clock, MapPin, Calendar } from 'lucide-react'

interface TimelineEvent {
    id: string
    time: string
    title: string
    description?: string
    duration?: number
    location?: string
    category: string
}

const CATEGORIES = {
    CEREMONY: { label: 'Trauung', color: '#d4a373' },
    RECEPTION: { label: 'Empfang', color: '#c89563' },
    PHOTOS: { label: 'Fotos', color: '#b8864f' },
    DINNER: { label: 'Dinner', color: '#a8773f' },
    PARTY: { label: 'Party', color: '#98682f' },
    OTHER: { label: 'Sonstiges', color: '#888' }
}

export default function TimelinePage() {
    const [events, setEvents] = useState<TimelineEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        time: '',
        title: '',
        description: '',
        duration: '',
        location: '',
        category: 'OTHER'
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
                fetchTimelineEvents(event.id)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Failed to fetch user event:', error)
            setIsLoading(false)
        }
    }

    const fetchTimelineEvents = async (evtId: string) => {
        try {
            const res = await fetch(`/api/timeline?eventId=${evtId}`)
            if (res.ok) {
                setEvents(await res.json())
            }
        } catch (error) {
            console.error('Failed to fetch timeline events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!eventId) return

        try {
            const url = editingEvent ? '/api/timeline' : '/api/timeline'
            const method = editingEvent ? 'PATCH' : 'POST'
            const body = editingEvent
                ? { id: editingEvent.id, ...formData }
                : { eventId, ...formData }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                fetchTimelineEvents(eventId)
                setShowModal(false)
                setEditingEvent(null)
                setFormData({ time: '', title: '', description: '', duration: '', location: '', category: 'OTHER' })
            }
        } catch (error) {
            console.error('Failed to save timeline event:', error)
        }
    }

    const deleteEvent = async (id: string) => {
        if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return
        try {
            const res = await fetch(`/api/timeline?id=${id}`, { method: 'DELETE' })
            if (res.ok && eventId) {
                fetchTimelineEvents(eventId)
            }
        } catch (error) {
            console.error('Failed to delete timeline event:', error)
        }
    }

    const openEditModal = (event: TimelineEvent) => {
        setEditingEvent(event)
        setFormData({
            time: event.time,
            title: event.title,
            description: event.description || '',
            duration: event.duration?.toString() || '',
            location: event.location || '',
            category: event.category
        })
        setShowModal(true)
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Ablaufplan</h1>
                    <p style={{ color: '#666' }}>Planen Sie den zeitlichen Ablauf Ihres Hochzeitstages</p>
                </div>
                <button
                    onClick={() => { setEditingEvent(null); setFormData({ time: '', title: '', description: '', duration: '', location: '', category: 'OTHER' }); setShowModal(true); }}
                    style={{ background: '#d4a373', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                >
                    <Plus size={18} /> Neuer Eintrag
                </button>
            </div>

            {/* Timeline */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
                ) : events.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                        Noch keine Einträge. Erstellen Sie Ihren ersten Ablaufplan-Eintrag!
                    </div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        {/* Timeline Line */}
                        <div style={{ position: 'absolute', left: '2rem', top: 0, bottom: 0, width: 2, background: '#eee' }}></div>

                        {events.map((event, index) => (
                            <div key={event.id} style={{ position: 'relative', padding: '1.5rem 1.5rem 1.5rem 5rem', borderBottom: index < events.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                                {/* Timeline Dot */}
                                <div style={{ position: 'absolute', left: '1.5rem', top: '1.5rem', width: 16, height: 16, borderRadius: '50%', background: CATEGORIES[event.category as keyof typeof CATEGORIES]?.color || '#888', border: '3px solid white', boxShadow: '0 0 0 1px #eee' }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: CATEGORIES[event.category as keyof typeof CATEGORIES]?.color || '#888' }}>{event.time}</div>
                                            <div style={{ padding: '0.25rem 0.75rem', borderRadius: 50, fontSize: '0.75rem', background: CATEGORIES[event.category as keyof typeof CATEGORIES]?.color + '20' || '#88820', color: CATEGORIES[event.category as keyof typeof CATEGORIES]?.color || '#888' }}>
                                                {CATEGORIES[event.category as keyof typeof CATEGORIES]?.label || 'Sonstiges'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 500, marginBottom: '0.5rem' }}>{event.title}</div>
                                        {event.description && <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{event.description}</div>}
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#999' }}>
                                            {event.duration && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={14} /> {event.duration} Min.
                                                </div>
                                            )}
                                            {event.location && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <MapPin size={14} /> {event.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEditModal(event)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666', padding: '0.25rem' }}><Edit2 size={16} /></button>
                                        <button onClick={() => deleteEvent(event.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f44336', padding: '0.25rem' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{editingEvent ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Uhrzeit *</label>
                                <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Titel *</label>
                                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="z.B. Trauung" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kategorie</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}>
                                    {Object.entries(CATEGORIES).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Beschreibung</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8, fontFamily: 'inherit' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Dauer (Minuten)</label>
                                <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="60" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ort</label>
                                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="z.B. Kirche St. Maria" style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }} />
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
