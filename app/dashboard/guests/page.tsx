'use client'

import styles from '../dashboard.module.css'
import { Users, Download } from 'lucide-react'

export default function VenueGuestsPage() {
    // Mock data for all events
    const events = [
        { id: '1', coupleName: 'Jonathan & Jane', date: 'Aug 12, 2024', totalGuests: 120, confirmed: 95, pending: 15, declined: 10 },
        { id: '2', coupleName: 'Michael & Sarah', date: 'Sep 05, 2024', totalGuests: 80, confirmed: 60, pending: 20, declined: 0 },
        { id: '3', coupleName: 'David & Emma', date: 'Oct 20, 2024', totalGuests: 150, confirmed: 120, pending: 25, declined: 5 },
    ]

    const totalGuests = events.reduce((sum, e) => sum + e.totalGuests, 0)
    const totalConfirmed = events.reduce((sum, e) => sum + e.confirmed, 0)

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>Gästeverwaltung</h1>
                <p style={{ color: '#666' }}>Übersicht aller Gäste für kommende Hochzeiten</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gesamt Gäste</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{totalGuests}</div>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Bestätigt</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4caf50' }}>{totalConfirmed}</div>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Aktive Events</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a373' }}>{events.length}</div>
                </div>
            </div>

            {/* Events Table */}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.85rem', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>PAAR</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>DATUM</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>GESAMT</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>BESTÄTIGT</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>AUSSTEHEND</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ABGESAGT</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>AKTIONEN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => {
                            const confirmRate = (event.confirmed / event.totalGuests) * 100

                            return (
                                <tr key={event.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{event.coupleName}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{event.date}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{event.totalGuests}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#4caf50', fontWeight: 500 }}>{event.confirmed}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#ef6c00' }}>{event.pending}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#f44336' }}>{event.declined}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={{
                                                border: '1px solid #d4a373',
                                                background: 'white',
                                                color: '#d4a373',
                                                padding: '0.5rem 1rem',
                                                borderRadius: 6,
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <Users size={14} /> Details
                                            </button>
                                            <button style={{
                                                border: '1px solid #eee',
                                                background: 'white',
                                                color: '#666',
                                                padding: '0.5rem 1rem',
                                                borderRadius: 6,
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <Download size={14} /> Export
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
