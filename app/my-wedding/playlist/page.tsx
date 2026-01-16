'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Music, Edit2 } from 'lucide-react'
import styles from '../client-dashboard.module.css'

interface PlaylistSong {
    id: string
    title: string
    artist: string
    category: string
    notes: string | null
    requestedBy: string | null
}

const CATEGORIES = ['GENERAL', 'CEREMONY', 'RECEPTION', 'DANCE', 'DINNER']

export default function PlaylistPage() {
    const [songs, setSongs] = useState<PlaylistSong[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingSong, setEditingSong] = useState<PlaylistSong | null>(null)
    const [usersEventId, setUsersEventId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        category: 'GENERAL',
        notes: '',
        requestedBy: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const eventRes = await fetch('/api/user-event')
            if (!eventRes.ok) return
            const event = await eventRes.json()
            setUsersEventId(event.id)

            const playlistRes = await fetch(`/api/playlist?eventId=${event.id}`)
            if (playlistRes.ok) {
                const data = await playlistRes.json()
                setSongs(data)
            }
        } catch (error) {
            console.error('Error fetching playlist:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!usersEventId) return

        const data = editingSong
            ? { id: editingSong.id, ...formData }
            : { eventId: usersEventId, ...formData }

        try {
            const res = await fetch('/api/playlist', {
                method: editingSong ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                fetchData()
                setShowModal(false)
                resetForm()
            }
        } catch (error) {
            console.error('Error saving song:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Song löschen?')) return

        try {
            await fetch(`/api/playlist?id=${id}`, { method: 'DELETE' })
            setSongs(songs.filter(s => s.id !== id))
        } catch (error) {
            console.error('Error deleting song:', error)
        }
    }

    const openModal = (song?: PlaylistSong) => {
        if (song) {
            setEditingSong(song)
            setFormData({
                title: song.title,
                artist: song.artist,
                category: song.category,
                notes: song.notes || '',
                requestedBy: song.requestedBy || ''
            })
        }
        setShowModal(true)
    }

    const resetForm = () => {
        setFormData({ title: '', artist: '', category: 'GENERAL', notes: '', requestedBy: '' })
        setEditingSong(null)
    }

    const groupedSongs = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = songs.filter(s => s.category === cat)
        return acc
    }, {} as Record<string, PlaylistSong[]>)

    return (
        <div className={styles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className={styles.title}>Playlist</h1>
                    <p style={{ opacity: 0.7 }}>Musik für Ihren großen Tag</p>
                </div>
                <button onClick={() => openModal()} style={{ padding: '0.75rem 1.5rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Song hinzufügen
                </button>
            </div>

            {CATEGORIES.map(category => (
                groupedSongs[category].length > 0 && (
                    <div key={category} style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{category.toLowerCase()}</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {groupedSongs[category].map(song => (
                                <div key={song.id} style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                                        <Music size={24} color="#d4a373" />
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{song.title}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>{song.artist}</div>
                                            {song.requestedBy && <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>Gewünscht von: {song.requestedBy}</div>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openModal(song)} style={{ padding: '0.5rem', background: '#f0f0f0', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(song.id)} style={{ padding: '0.5rem', background: '#ffe5e5', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                            <Trash2 size={16} color="#ff7675" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowModal(false); resetForm(); }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 16, width: '90%', maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>{editingSong ? 'Song bearbeiten' : 'Song hinzufügen'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titel *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Künstler *</label>
                                <input type="text" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Kategorie</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gewünscht von</label>
                                <input type="text" value={formData.requestedBy} onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={{ flex: 1, padding: '0.75rem', background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Abbrechen</button>
                                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Speichern</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
