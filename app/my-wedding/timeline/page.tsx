'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Edit2, Trash2, X, Clock, AlertCircle, GripVertical } from 'lucide-react'

interface TimelineEvent {
    id: string
    time: string
    title: string
    description: string | null
    duration: number | null
    location: string | null
    category: string
    order: number
}

export default function TimelinePage() {
    const [events, setEvents] = useState<TimelineEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)
    const [draggedItem, setDraggedItem] = useState<TimelineEvent | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        time: '',
        title: '',
        description: '',
        duration: 60,
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
                fetchEvents(event.id)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Failed to fetch user event:', error)
            setIsLoading(false)
        }
    }

    const fetchEvents = async (evtId: string) => {
        try {
            const res = await fetch(`/api/timeline?eventId=${evtId}`)
            if (res.ok) {
                const data = await res.json()
                setEvents(data.sort((a: TimelineEvent, b: TimelineEvent) => a.order - b.order))
            }
        } catch (error) {
            console.error('Failed to fetch events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const parseTime = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        return hours * 60 + minutes
    }

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }

    const calculateEndTime = (startTime: string, duration: number | null): string => {
        if (!duration) return startTime
        const startMinutes = parseTime(startTime)
        const endMinutes = startMinutes + duration
        return formatTime(endMinutes)
    }

    const hasConflict = (event: TimelineEvent, otherEvents: TimelineEvent[]): boolean => {
        if (!event.duration) return false

        const start1 = parseTime(event.time)
        const end1 = start1 + event.duration

        return otherEvents.some(other => {
            if (other.id === event.id || !other.duration) return false
            const start2 = parseTime(other.time)
            const end2 = start2 + other.duration
            return start1 < end2 && end1 > start2
        })
    }

    const recalculateTimes = (reorderedEvents: TimelineEvent[]): TimelineEvent[] => {
        const updated = [...reorderedEvents]

        for (let i = 1; i < updated.length; i++) {
            const prevEvent = updated[i - 1]
            if (prevEvent.duration) {
                const prevEnd = parseTime(prevEvent.time) + prevEvent.duration
                updated[i] = { ...updated[i], time: formatTime(prevEnd) }
            }
        }

        return updated
    }

    const handleDragStart = (e: React.DragEvent, event: TimelineEvent) => {
        setDraggedItem(event)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverIndex(null)
    }

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()

        if (!draggedItem) return

        const dragIndex = events.findIndex(ev => ev.id === draggedItem.id)
        if (dragIndex === dropIndex) {
            setDraggedItem(null)
            setDragOverIndex(null)
            return
        }

        // Reorder events
        const reordered = [...events]
        reordered.splice(dragIndex, 1)
        reordered.splice(dropIndex, 0, draggedItem)

        // Recalculate times
        const withNewTimes = recalculateTimes(reordered)

        // Update order property
        const withNewOrder = withNewTimes.map((ev, idx) => ({ ...ev, order: idx }))

        setEvents(withNewOrder)
        setDraggedItem(null)
        setDragOverIndex(null)

        // Save to backend
        try {
            await Promise.all(
                withNewOrder.map(ev =>
                    fetch('/api/timeline', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: ev.id, time: ev.time, order: ev.order })
                    })
                )
            )
        } catch (error) {
            console.error('Failed to update event order:', error)
        }
    }

    const addEvent = async () => {
        if (!eventId || !formData.title || !formData.time) return

        try {
            const res = await fetch('/api/timeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    ...formData,
                    order: events.length
                })
            })

            if (res.ok) {
                fetchEvents(eventId)
                setShowModal(false)
                resetForm()
            }
        } catch (error) {
            console.error('Failed to add event:', error)
        }
    }

    const updateEvent = async () => {
        if (!editingEvent) return

        try {
            const res = await fetch('/api/timeline', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingEvent.id,
                    ...formData
                })
            })

            if (res.ok && eventId) {
                fetchEvents(eventId)
                setShowModal(false)
                setEditingEvent(null)
                resetForm()
            }
        } catch (error) {
            console.error('Failed to update event:', error)
        }
    }

    const deleteEvent = async (id: string) => {
        if (!confirm('Ereignis löschen?')) return

        try {
            await fetch(`/api/timeline?id=${id}`, { method: 'DELETE' })
            if (eventId) fetchEvents(eventId)
        } catch (error) {
            console.error('Failed to delete event:', error)
        }
    }

    const openEditModal = (event: TimelineEvent) => {
        setEditingEvent(event)
        setFormData({
            time: event.time,
            title: event.title,
            description: event.description || '',
            duration: event.duration || 60,
            location: event.location || '',
            category: event.category
        })
        setShowModal(true)
    }

    const resetForm = () => {
        setFormData({
            time: '',
            title: '',
            description: '',
            duration: 60,
            location: '',
            category: 'OTHER'
        })
    }

    const getCategoryColor = (category: string): string => {
        const colors: Record<string, string> = {
            CEREMONY: '#d4a373',
            RECEPTION: '#a9845b',
            PHOTOS: '#667eea',
            DINNER: '#f093fb',
            PARTY: '#4facfe',
            OTHER: '#95a5a6'
        }
        return colors[category] || colors.OTHER
    }

    return (
        <div className={styles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className={styles.title}>Ablaufplan</h1>
                    <p style={{ opacity: 0.7 }}>Organisieren Sie Ihren Hochzeitstag</p>
                </div>
                <button
                    onClick={() => { setEditingEvent(null); resetForm(); setShowModal(true); }}
                    style={{ padding: '0.75rem 1.5rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> Ereignis hinzufügen
                </button>
            </div>

            {isLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {events.map((event, index) => {
                        const conflict = hasConflict(event, events)
                        const endTime = calculateEndTime(event.time, event.duration)
                        const isDragging = draggedItem?.id === event.id
                        const isDropTarget = dragOverIndex === index

                        return (
                            <div
                                key={event.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, event)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDrop(e, index)}
                                style={{
                                    background: 'white',
                                    borderRadius: 12,
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    border: `2px solid ${conflict ? '#e74c3c' : isDropTarget ? '#d4a373' : 'transparent'}`,
                                    opacity: isDragging ? 0.5 : 1,
                                    cursor: 'grab',
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ color: '#999', cursor: 'grab', paddingTop: '0.25rem' }}>
                                        <GripVertical size={20} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <div style={{
                                                background: getCategoryColor(event.category),
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: 8,
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <Clock size={16} />
                                                {event.time} - {endTime}
                                                {event.duration && <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>({event.duration} Min)</span>}
                                            </div>
                                            {conflict && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e74c3c', fontSize: '0.85rem' }}>
                                                    <AlertCircle size={16} />
                                                    Zeitkonflikt!
                                                </div>
                                            )}
                                        </div>

                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{event.title}</h3>

                                        {event.description && (
                                            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{event.description}</p>
                                        )}

                                        {event.location && (
                                            <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>📍 {event.location}</p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => openEditModal(event)}
                                            style={{ border: 'none', background: '#f0f0f0', padding: '0.5rem', borderRadius: 6, cursor: 'pointer' }}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            style={{ border: 'none', background: '#ffe5e5', padding: '0.5rem', borderRadius: 6, cursor: 'pointer', color: '#e74c3c' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {events.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                            Noch keine Ereignisse. Fügen Sie Ihr erstes Ereignis hinzu!
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setShowModal(false)}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>{editingEvent ? 'Ereignis bearbeiten' : 'Neues Ereignis'}</h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Uhrzeit *</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Titel *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Dauer (Minuten)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                min="0"
                                step="15"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Beschreibung</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ort</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kategorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                            >
                                <option value="CEREMONY">Trauung</option>
                                <option value="RECEPTION">Empfang</option>
                                <option value="PHOTOS">Fotos</option>
                                <option value="DINNER">Dinner</option>
                                <option value="PARTY">Party</option>
                                <option value="OTHER">Sonstiges</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => { setShowModal(false); setEditingEvent(null); resetForm(); }}
                                style={{ flex: 1, padding: '0.75rem', background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={editingEvent ? updateEvent : addEvent}
                                style={{ flex: 1, padding: '0.75rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                            >
                                {editingEvent ? 'Speichern' : 'Hinzufügen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
