'use client'

import styles from '../dashboard.module.css'
import { Briefcase, TrendingUp } from 'lucide-react'

export default function VenueVendorsPage() {
    // Mock data
    const events = [
        { id: '1', coupleName: 'Jonathan & Jane', date: 'Aug 12, 2024', vendors: 8, booked: 6, totalCost: 25000 },
        { id: '2', coupleName: 'Michael & Sarah', date: 'Sep 05, 2024', vendors: 6, booked: 3, totalCost: 18000 },
        { id: '3', coupleName: 'David & Emma', date: 'Oct 20, 2024', vendors: 10, booked: 8, totalCost: 35000 },
    ]

    const totalVendors = events.reduce((sum, e) => sum + e.vendors, 0)
    const totalBooked = events.reduce((sum, e) => sum + e.booked, 0)
    const totalRevenue = events.reduce((sum, e) => sum + e.totalCost, 0)

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>Dienstleister-Übersicht</h1>
                <p style={{ color: '#666' }}>Verwaltung aller Dienstleister für kommende Hochzeiten</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gesamt Dienstleister</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{totalVendors}</div>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gebucht</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4caf50' }}>{totalBooked}</div>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Gesamtwert</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a373' }}>€{totalRevenue.toLocaleString('de-DE')}</div>
                </div>
            </div>

            {/* Events Table */}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.85rem', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>PAAR</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>DATUM</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>DIENSTLEISTER</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>GEBUCHT</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>GESAMTKOSTEN</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>STATUS</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>AKTIONEN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => {
                            const bookingRate = (event.booked / event.vendors) * 100

                            return (
                                <tr key={event.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{event.coupleName}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{event.date}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{event.vendors}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#4caf50', fontWeight: 500 }}>{event.booked}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>€{event.totalCost.toLocaleString('de-DE')}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ width: '100%', maxWidth: 120 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 4 }}>
                                                {bookingRate.toFixed(0)}% gebucht
                                            </div>
                                            <div style={{ width: '100%', height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${bookingRate}%`,
                                                    height: '100%',
                                                    background: bookingRate === 100 ? '#4caf50' : '#d4a373'
                                                }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
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
                                            <Briefcase size={14} /> Details
                                        </button>
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
