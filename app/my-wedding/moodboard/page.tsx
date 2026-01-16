'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import styles from '../client-dashboard.module.css'

interface MoodboardItem {
    id: string
    imageUrl: string
    notes: string | null
    category: string
}

const CATEGORIES = ['GENERAL', 'DECOR', 'DRESS', 'FLOWERS', 'CAKE', 'LOCATION', 'STATIONERY', 'OTHER']

export default function MoodboardPage() {
    const [items, setItems] = useState<MoodboardItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [filter, setFilter] = useState('ALL')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [usersEventId, setUsersEventId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const eventRes = await fetch('/api/user-event')
            if (!eventRes.ok) return
            const event = await eventRes.json()
            setUsersEventId(event.id)

            const moodboardRes = await fetch(`/api/moodboard?eventId=${event.id}`)
            if (moodboardRes.ok) {
                const data = await moodboardRes.json()
                setItems(data)
            }
        } catch (error) {
            console.error('Error fetching moodboard:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0 || !usersEventId) return

        setIsUploading(true)
        const file = files[0]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('eventId', usersEventId)
        formData.append('category', filter === 'ALL' ? 'GENERAL' : filter)
        formData.append('notes', '')

        try {
            const res = await fetch('/api/moodboard', {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                const newItem = await res.json()
                setItems([newItem, ...items])
            }
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Upload fehlgeschlagen')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bild löschen?')) return

        setItems(items.filter(i => i.id !== id))
        try {
            await fetch(`/api/moodboard?id=${id}`, { method: 'DELETE' })
        } catch (error) {
            console.error('Error deleting:', error)
        }
    }

    const filteredItems = filter === 'ALL' ? items : items.filter(i => i.category === filter)

    return (
        <div className={styles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className={styles.title}>Moodboard</h1>
                    <p style={{ opacity: 0.7 }}>Sammeln Sie Inspirationen für Ihren großen Tag</p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{ padding: '0.75rem 1.5rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                >
                    {isUploading ? 'Lädt hoch...' : <><Upload size={18} /> Bild hochladen</>}
                </button>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <button onClick={() => setFilter('ALL')} style={{ padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid #eee', background: filter === 'ALL' ? '#1a1a1a' : 'white', color: filter === 'ALL' ? 'white' : '#666', cursor: 'pointer', whiteSpace: 'nowrap' }}>Alle</button>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid #eee', background: filter === cat ? '#1a1a1a' : 'white', color: filter === cat ? 'white' : '#666', cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{cat.toLowerCase()}</button>
                ))}
            </div>

            <div style={{ columnCount: 3, columnGap: '1.5rem' }}>
                {filteredItems.map(item => (
                    <div key={item.id} style={{ breakInside: 'avoid', marginBottom: '1.5rem', background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative' }}>
                        <img src={item.imageUrl} alt={item.category} style={{ width: '100%', display: 'block' }} />
                        <div style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#d4a373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>{item.category}</div>
                            {item.notes && <p style={{ fontSize: '0.9rem', color: '#444', margin: 0 }}>{item.notes}</p>}
                        </div>
                        <button onClick={() => handleDelete(item.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <Trash2 size={16} color="#ff7675" />
                        </button>
                    </div>
                ))}
            </div>

            {!isLoading && filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
                    <ImageIcon size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                    <h3>Noch keine Inspirationen</h3>
                    <p>Laden Sie Bilder hoch, um Ihr Moodboard zu füllen.</p>
                </div>
            )}
        </div>
    )
}
