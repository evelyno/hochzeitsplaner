'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import styles from '../client-dashboard.module.css'

interface Table {
    id: string
    name: string
    shape: string
    capacity: number
    x: number
    y: number
    rotation: number
    guests: any[]
}

interface Guest {
    id: string
    name: string
    tableId: string | null
}

export default function SeatingPage() {
    const [tables, setTables] = useState<Table[]>([])
    const [guests, setGuests] = useState<Guest[]>([])
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [usersEventId, setUsersEventId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const eventRes = await fetch('/api/user-event')
            if (!eventRes.ok) return
            const event = await eventRes.json()
            setUsersEventId(event.id)

            const [tablesRes, guestsRes] = await Promise.all([
                fetch(`/api/tables?eventId=${event.id}`),
                fetch(`/api/guests?eventId=${event.id}`)
            ])

            if (tablesRes.ok) setTables(await tablesRes.json())
            if (guestsRes.ok) setGuests(await guestsRes.json())
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addTable = async () => {
        if (!usersEventId) return

        const newTable = {
            eventId: usersEventId,
            name: `Tisch ${tables.length + 1}`,
            shape: 'RECTANGLE',
            capacity: 8,
            x: 100,
            y: 100,
            rotation: 0
        }

        try {
            const res = await fetch('/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTable)
            })
            if (res.ok) {
                const created = await res.json()
                setTables([...tables, created])
            }
        } catch (error) {
            console.error('Error creating table:', error)
        }
    }

    const deleteTable = async (id: string) => {
        if (!confirm('Tisch löschen?')) return

        try {
            await fetch(`/api/tables?id=${id}`, { method: 'DELETE' })
            setTables(tables.filter(t => t.id !== id))
            if (selectedTable?.id === id) setSelectedTable(null)
        } catch (error) {
            console.error('Error deleting table:', error)
        }
    }

    const unassignedGuests = guests.filter(g => !g.tableId)

    return (
        <div className={styles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 className={styles.title}>Sitzplan</h1>
                <button onClick={addTable} style={{ padding: '0.75rem 1.5rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Tisch hinzufügen
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <div style={{ background: '#f9f9f9', borderRadius: 16, padding: '2rem', minHeight: 600, position: 'relative' }}>
                    {tables.map(table => (
                        <div
                            key={table.id}
                            onClick={() => setSelectedTable(table)}
                            style={{
                                position: 'absolute',
                                left: table.x,
                                top: table.y,
                                width: table.shape === 'ROUND' ? 100 : 120,
                                height: table.shape === 'ROUND' ? 100 : 80,
                                background: selectedTable?.id === table.id ? '#d4a373' : 'white',
                                border: '2px solid #ddd',
                                borderRadius: table.shape === 'ROUND' ? '50%' : 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                color: selectedTable?.id === table.id ? 'white' : '#333'
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 600 }}>{table.name}</div>
                                <div style={{ fontSize: '0.75rem' }}>{table.guests?.length || 0}/{table.capacity}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    {selectedTable ? (
                        <>
                            <h3 style={{ marginTop: 0 }}>{selectedTable.name}</h3>
                            <button onClick={() => deleteTable(selectedTable.id)} style={{ padding: '0.5rem 1rem', background: '#ff7675', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: '1rem' }}>
                                <Trash2 size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Löschen
                            </button>
                            <div>
                                <p><strong>Kapazität:</strong> {selectedTable.capacity}</p>
                                <p><strong>Form:</strong> {selectedTable.shape === 'ROUND' ? 'Rund' : 'Rechteckig'}</p>
                                <p><strong>Gäste:</strong> {selectedTable.guests?.length || 0}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 style={{ marginTop: 0 }}>Nicht zugewiesen ({unassignedGuests.length})</h3>
                            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                {unassignedGuests.map(guest => (
                                    <div key={guest.id} style={{ padding: '0.75rem', background: '#f9f9f9', borderRadius: 8, marginBottom: '0.5rem' }}>
                                        {guest.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
