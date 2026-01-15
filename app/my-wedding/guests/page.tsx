'use client'

import styles from '../client-dashboard.module.css'
import { Plus, Search, Mail } from 'lucide-react'

// Placeholder data
const guests = [
    { id: 1, name: 'Uncle Bob', email: 'bob@example.com', rsvp: 'Attending', meal: 'Steak', group: 'Family' },
    { id: 2, name: 'Aunt Alice', email: 'alice@example.com', rsvp: 'Attending', meal: 'Chicken', group: 'Family' },
    { id: 3, name: 'Cousin Joe', email: 'joe@example.com', rsvp: 'Declined', meal: '-', group: 'Family' },
    { id: 4, name: 'Best Friend Sarah', email: 'sarah@example.com', rsvp: 'Pending', meal: '?', group: 'Bridal Party' },
    { id: 5, name: 'Colleague Mike', email: 'mike@company.com', rsvp: 'Pending', meal: '?', group: 'Work' },
]

export default function GuestListPage() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Guest List</h1>
                    <p style={{ color: '#666' }}>Manage RSVPs and meal preferences.</p>
                </div>
                <button className={styles.navItem} style={{
                    background: '#d4a373',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    flexDirection: 'row',
                    gap: '0.5rem',
                    width: 'auto',
                    padding: '0 1.5rem',
                    height: '48px'
                }}>
                    <Plus size={20} /> Add Guest
                </button>
            </div>

            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5f6fa', padding: '0.75rem 1rem', borderRadius: 8, flex: 1, maxWidth: 300 }}>
                            <Search size={18} color="#999" />
                            <input type="text" placeholder="Search guests..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>85</div>
                            <div style={{ color: '#999', fontSize: '0.75rem' }}>Invited</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4caf50' }}>42</div>
                            <div style={{ color: '#999', fontSize: '0.75rem' }}>Attending</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f44336' }}>12</div>
                            <div style={{ color: '#999', fontSize: '0.75rem' }}>Declined</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.8rem', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: 1 }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Guest Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Group</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>RSVP Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Meal</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 600 }}>{guest.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#999' }}>{guest.email}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{guest.group}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 50,
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        background: guest.rsvp === 'Attending' ? '#e8f5e9' : guest.rsvp === 'Pending' ? '#fff3e0' : '#ffebee',
                                        color: guest.rsvp === 'Attending' ? '#2e7d32' : guest.rsvp === 'Pending' ? '#ef6c00' : '#c62828'
                                    }}>
                                        {guest.rsvp}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{guest.meal}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}>
                                        <Mail size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
