'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Gift, Edit2, Check } from 'lucide-react'
import styles from '../client-dashboard.module.css'

interface GiftItem {
    id: string
    name: string
    description: string | null
    price: number | null
    url: string | null
    imageUrl: string | null
    category: string
    isPurchased: boolean
    purchasedBy: string | null
}

const CATEGORIES = ['GENERAL', 'HOME', 'KITCHEN', 'EXPERIENCE', 'CASH']

export default function GiftsPage() {
    const [gifts, setGifts] = useState<GiftItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingGift, setEditingGift] = useState<GiftItem | null>(null)
    const [usersEventId, setUsersEventId] = useState<string | null>(null)
    const [filter, setFilter] = useState('ALL')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        url: '',
        category: 'GENERAL'
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

            const giftsRes = await fetch(`/api/gifts?eventId=${event.id}`)
            if (giftsRes.ok) {
                const data = await giftsRes.json()
                setGifts(data)
            }
        } catch (error) {
            console.error('Error fetching gifts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!usersEventId) return

        const data = editingGift
            ? { id: editingGift.id, ...formData }
            : { eventId: usersEventId, ...formData }

        try {
            const res = await fetch('/api/gifts', {
                method: editingGift ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                fetchData()
                setShowModal(false)
                resetForm()
            }
        } catch (error) {
            console.error('Error saving gift:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Geschenk löschen?')) return

        try {
            await fetch(`/api/gifts?id=${id}`, { method: 'DELETE' })
            setGifts(gifts.filter(g => g.id !== id))
        } catch (error) {
            console.error('Error deleting gift:', error)
        }
    }

    const togglePurchased = async (gift: GiftItem) => {
        try {
            const res = await fetch('/api/gifts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: gift.id, isPurchased: !gift.isPurchased })
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error toggling purchased:', error)
        }
    }

    const openModal = (gift?: GiftItem) => {
        if (gift) {
            setEditingGift(gift)
            setFormData({
                name: gift.name,
                description: gift.description || '',
                price: gift.price?.toString() || '',
                url: gift.url || '',
                category: gift.category
            })
        }
        setShowModal(true)
    }

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', url: '', category: 'GENERAL' })
        setEditingGift(null)
    }

    const filteredGifts = filter === 'ALL' ? gifts : gifts.filter(g => g.category === filter)

    return (
        <div className={styles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className={styles.title}>Geschenkliste</h1>
                    <p style={{ opacity: 0.7 }}>Wünsche für Ihren besonderen Tag</p>
                </div>
                <button onClick={() => openModal()} style={{ padding: '0.75rem 1.5rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Geschenk hinzufügen
                </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
                <button onClick={() => setFilter('ALL')} style={{ padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid #eee', background: filter === 'ALL' ? '#1a1a1a' : 'white', color: filter === 'ALL' ? 'white' : '#666', cursor: 'pointer', whiteSpace: 'nowrap' }}>Alle</button>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid #eee', background: filter === cat ? '#1a1a1a' : 'white', color: filter === cat ? 'white' : '#666', cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{cat.toLowerCase()}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredGifts.map(gift => (
                    <div key={gift.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative', opacity: gift.isPurchased ? 0.6 : 1 }}>
                        {gift.isPurchased && (
                            <div style={{ position: 'absolute', top: 10, left: 10, background: '#27ae60', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={14} /> Gekauft
                            </div>
                        )}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <Gift size={32} color="#d4a373" />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{gift.name}</h3>
                                    <div style={{ fontSize: '0.75rem', color: '#d4a373', textTransform: 'uppercase', letterSpacing: 1 }}>{gift.category}</div>
                                </div>
                            </div>
                            {gift.description && <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{gift.description}</p>}
                            {gift.price && <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#d4a373', marginBottom: '1rem' }}>€{gift.price.toFixed(2)}</div>}
                            {gift.url && <a href={gift.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#3498db', textDecoration: 'none' }}>Link anzeigen →</a>}
                        </div>
                        <div style={{ padding: '1rem 1.5rem', background: '#f9f9f9', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => togglePurchased(gift)} style={{ flex: 1, padding: '0.5rem', background: gift.isPurchased ? '#27ae60' : '#e0e0e0', color: gift.isPurchased ? 'white' : '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
                                {gift.isPurchased ? 'Gekauft' : 'Als gekauft markieren'}
                            </button>
                            <button onClick={() => openModal(gift)} style={{ padding: '0.5rem 0.75rem', background: 'white', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}>
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(gift.id)} style={{ padding: '0.5rem 0.75rem', background: '#ffe5e5', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                <Trash2 size={16} color="#ff7675" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowModal(false); resetForm(); }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 16, width: '90%', maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>{editingGift ? 'Geschenk bearbeiten' : 'Geschenk hinzufügen'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Beschreibung</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Preis (€)</label>
                                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Link</label>
                                <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Kategorie</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
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
