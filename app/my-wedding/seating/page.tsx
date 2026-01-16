'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Users as UsersIcon } from 'lucide-react'
import styles from '../client-dashboard.module.css'

interface Table {
    id: string
    name: string
    shape: string
    capacity: number
    x: number
    y: number
    rotation: number
    guests: Guest[]
}

interface Guest {
    id: string
    name: string
    tableId: string | null
    seatNumber: number | null
}

export default function SeatingPage() {
    const [tables, setTables] = useState<Table[]>([])
    const [guests, setGuests] = useState<Guest[]>([])
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [usersEventId, setUsersEventId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [draggingTable, setDraggingTable] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [showEditModal, setShowEditModal] = useState(false)
    const [editFormData, setEditFormData] = useState({ name: '', capacity: 8, shape: 'ROUND' })
    const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

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
            shape: 'ROUND',
            capacity: 8,
            x: 200 + (tables.length * 30),
            y: 200 + (tables.length * 30),
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

    const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
        e.stopPropagation()
        const table = tables.find(t => t.id === tableId)
        if (!table || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        setDraggingTable(tableId)
        setDragOffset({
            x: e.clientX - rect.left - table.x,
            y: e.clientY - rect.top - table.y
        })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingTable || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const newX = e.clientX - rect.left - dragOffset.x
        const newY = e.clientY - rect.top - dragOffset.y

        setTables(tables.map(t =>
            t.id === draggingTable
                ? { ...t, x: Math.max(0, Math.min(newX, rect.width - 150)), y: Math.max(0, Math.min(newY, rect.height - 150)) }
                : t
        ))
    }

    const handleMouseUp = async () => {
        if (!draggingTable) return

        const table = tables.find(t => t.id === draggingTable)
        if (table) {
            try {
                await fetch('/api/tables', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: table.id, x: table.x, y: table.y })
                })
            } catch (error) {
                console.error('Error updating table position:', error)
            }
        }

        setDraggingTable(null)
    }

    const assignGuestToSeat = async (guestId: string, tableId: string, seatNumber: number) => {
        try {
            const res = await fetch('/api/guests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: guestId, tableId, seatNumber })
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error assigning guest:', error)
        }
    }

    const unassignGuest = async (guestId: string) => {
        try {
            const res = await fetch('/api/guests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: guestId, tableId: null, seatNumber: null })
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error unassigning guest:', error)
        }
    }

    const openEditModal = (table: Table) => {
        setSelectedTable(table)
        setEditFormData({ name: table.name, capacity: table.capacity, shape: table.shape })
        setShowEditModal(true)
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTable) return

        try {
            const res = await fetch('/api/tables', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedTable.id, ...editFormData })
            })
            if (res.ok) {
                fetchData()
                setShowEditModal(false)
            }
        } catch (error) {
            console.error('Error updating table:', error)
        }
    }

    const handleSeatDrop = (e: React.DragEvent, tableId: string, seatNumber: number) => {
        e.preventDefault()
        e.stopPropagation()

        if (draggedGuest) {
            assignGuestToSeat(draggedGuest.id, tableId, seatNumber)
            setDraggedGuest(null)
        }
    }

    const handleSeatDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const renderSeats = (table: Table) => {
        const seats = []
        const radius = table.shape === 'ROUND' ? 60 : 70
        const seatSize = 30

        for (let i = 0; i < table.capacity; i++) {
            const angle = (i / table.capacity) * 2 * Math.PI - Math.PI / 2
            const seatX = table.x + (table.shape === 'ROUND' ? 50 : 60) + Math.cos(angle) * radius - seatSize / 2
            const seatY = table.y + (table.shape === 'ROUND' ? 50 : 40) + Math.sin(angle) * radius - seatSize / 2

            const assignedGuest = table.guests?.find(g => g.seatNumber === i + 1)

            seats.push(
                <div
                    key={`${table.id}-seat-${i}`}
                    onDrop={(e) => handleSeatDrop(e, table.id, i + 1)}
                    onDragOver={handleSeatDragOver}
                    style={{
                        position: 'absolute',
                        left: seatX,
                        top: seatY,
                        width: seatSize,
                        height: seatSize,
                        background: assignedGuest ? '#d4a373' : '#e0e0e0',
                        border: '2px solid ' + (assignedGuest ? '#b8935f' : '#ccc'),
                        borderRadius: table.shape === 'ROUND' ? '50%' : 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: assignedGuest ? 'white' : '#666',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s'
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (assignedGuest) {
                            if (confirm(`${assignedGuest.name} entfernen?`)) {
                                unassignGuest(assignedGuest.id)
                            }
                        }
                    }}
                    title={assignedGuest ? assignedGuest.name : `Platz ${i + 1}`}
                >
                    {assignedGuest ? assignedGuest.name.split(' ').map(n => n[0]).join('').slice(0, 2) : i + 1}
                </div>
            )
        }

        return seats
    }

    const unassignedGuests = guests.filter(g => !g.tableId)

    return (
        <div className={styles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className={styles.title}>Sitzplan</h1>
                    <p style={{ opacity: 0.7 }}>Ziehen Sie Tische und weisen Sie Gäste Plätzen zu</p>
                </div>
                <button onClick={addTable} style={{ padding: '0.75rem 1.5rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Tisch hinzufügen
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                <div
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ background: '#f9f9f9', borderRadius: 16, padding: '2rem', minHeight: 700, position: 'relative', cursor: draggingTable ? 'grabbing' : 'default', overflow: 'hidden' }}
                >
                    {tables.map(table => (
                        <React.Fragment key={table.id}>
                            <div
                                onMouseDown={(e) => handleMouseDown(e, table.id)}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedTable(table)
                                }}
                                style={{
                                    position: 'absolute',
                                    left: table.x,
                                    top: table.y,
                                    width: table.shape === 'ROUND' ? 100 : 120,
                                    height: table.shape === 'ROUND' ? 100 : 80,
                                    background: selectedTable?.id === table.id ? '#d4a373' : 'white',
                                    border: '3px solid ' + (selectedTable?.id === table.id ? '#b8935f' : '#ddd'),
                                    borderRadius: table.shape === 'ROUND' ? '50%' : 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: draggingTable === table.id ? 'grabbing' : 'grab',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    color: selectedTable?.id === table.id ? 'white' : '#333',
                                    userSelect: 'none',
                                    zIndex: draggingTable === table.id ? 100 : 20
                                }}
                            >
                                <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{table.name}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
                                        {table.guests?.length || 0}/{table.capacity}
                                    </div>
                                </div>
                            </div>
                            {renderSeats(table)}
                        </React.Fragment>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedTable && (
                        <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{selectedTable.name}</h3>
                            <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <p><strong>Form:</strong> {selectedTable.shape === 'ROUND' ? 'Rund' : 'Rechteckig'}</p>
                                <p><strong>Kapazität:</strong> {selectedTable.capacity} Plätze</p>
                                <p><strong>Belegt:</strong> {selectedTable.guests?.length || 0} Gäste</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => openEditModal(selectedTable)} style={{ flex: 1, padding: '0.5rem', background: '#f0f0f0', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Edit2 size={16} /> Bearbeiten
                                </button>
                                <button onClick={() => deleteTable(selectedTable.id)} style={{ flex: 1, padding: '0.5rem', background: '#ffe5e5', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ff7675' }}>
                                    <Trash2 size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Löschen
                                </button>
                            </div>

                            {selectedTable.guests && selectedTable.guests.length > 0 && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Zugewiesene Gäste:</h4>
                                    {selectedTable.guests.map(guest => (
                                        <div key={guest.id} style={{ padding: '0.5rem', background: '#f9f9f9', borderRadius: 6, marginBottom: '0.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{guest.name} (Platz {guest.seatNumber})</span>
                                            <button onClick={() => unassignGuest(guest.id)} style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', padding: 4 }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: 1 }}>
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UsersIcon size={20} /> Nicht zugewiesen ({unassignedGuests.length})
                        </h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>Ziehen Sie Gäste auf freie Plätze</p>
                        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                            {unassignedGuests.map(guest => (
                                <div
                                    key={guest.id}
                                    draggable
                                    onDragStart={(e) => {
                                        setDraggedGuest(guest)
                                        e.dataTransfer.effectAllowed = 'move'
                                    }}
                                    onDragEnd={() => setDraggedGuest(null)}
                                    style={{
                                        padding: '0.75rem',
                                        background: '#f9f9f9',
                                        borderRadius: 8,
                                        marginBottom: '0.5rem',
                                        cursor: 'grab',
                                        fontSize: '0.9rem',
                                        border: '2px dashed transparent',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4a373'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                >
                                    {guest.name}
                                </div>
                            ))}
                            {unassignedGuests.length === 0 && (
                                <p style={{ opacity: 0.5, fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>Alle Gäste sind zugewiesen</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && selectedTable && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowEditModal(false)}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 16, width: '90%', maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>Tisch bearbeiten</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Kapazität</label>
                                <input type="number" min="2" max="20" value={editFormData.capacity} onChange={(e) => setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) })} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Form</label>
                                <select value={editFormData.shape} onChange={(e) => setEditFormData({ ...editFormData, shape: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 8 }}>
                                    <option value="ROUND">Rund</option>
                                    <option value="RECTANGLE">Rechteckig</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Abbrechen</button>
                                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#d4a373', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Speichern</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
