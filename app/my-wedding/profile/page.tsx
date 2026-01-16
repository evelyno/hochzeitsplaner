'use client'

import React, { useState, useEffect } from 'react'
import { User, Upload } from 'lucide-react'
import styles from '../client-dashboard.module.css'

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        partnerName: '',
        phone: '',
        weddingDate: ''
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile')
            if (res.ok) {
                const data = await res.json()
                setProfile(data)
                setFormData({
                    name: data.name || '',
                    partnerName: data.partnerName || '',
                    phone: data.phone || '',
                    weddingDate: data.weddingDate ? data.weddingDate.split('T')[0] : ''
                })
                setImagePreview(data.image)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        const data = new FormData()
        data.append('name', formData.name)
        data.append('partnerName', formData.partnerName)
        data.append('phone', formData.phone)
        data.append('weddingDate', formData.weddingDate)
        if (imageFile) data.append('image', imageFile)

        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                body: data
            })
            if (res.ok) {
                alert('Profil erfolgreich aktualisiert!')
                fetchProfile()
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Fehler beim Aktualisieren')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className={styles.main}><p>Lädt...</p></div>

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Mein Profil</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: 600, background: 'white', padding: '2rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#f0f0f0', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <User size={48} color="#ccc" />
                            </div>
                        )}
                    </div>
                    <label style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#d4a373', color: 'white', borderRadius: 8, cursor: 'pointer' }}>
                        <Upload size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        Foto hochladen
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Partner Name</label>
                    <input
                        type="text"
                        value={formData.partnerName}
                        onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Telefon</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hochzeitsdatum</label>
                    <input
                        type="date"
                        value={formData.weddingDate}
                        onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    style={{ width: '100%', padding: '0.75rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}
                >
                    {isSaving ? 'Speichert...' : 'Speichern'}
                </button>
            </form>
        </div>
    )
}
