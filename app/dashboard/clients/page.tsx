'use client'

import styles from '../dashboard.module.css'
import { Plus, Search, MoreHorizontal } from 'lucide-react'

// Placeholder data
const clients = [
    { id: 1, name1: 'Jonathan Doe', name2: 'Jane Smith', date: 'Aug 12, 2024', status: 'Active', budget: '$12,000' },
    { id: 2, name1: 'Michael Brown', name2: 'Sarah Wilson', date: 'Sep 05, 2024', status: 'Pending', budget: '$8,500' },
    { id: 3, name1: 'David Lee', name2: 'Emma Davis', date: 'Oct 20, 2024', status: 'Active', budget: '$15,000' },
    { id: 4, name1: 'James Miller', name2: 'Olivia Taylor', date: 'Nov 15, 2024', status: 'Completed', budget: '$10,000' },
]

export default function ClientsPage() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>My Clients</h1>
                    <p style={{ color: '#666' }}>Manage your couples and their wedding details.</p>
                </div>
                <button className={styles.navItem} style={{ background: '#d4a373', color: 'white', border: 'none', cursor: 'pointer' }}>
                    <Plus size={18} /> Add New Client
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className={styles.searchBar} style={{ width: 250, background: '#f5f6fa', padding: '0.5rem 1rem' }}>
                        <Search size={16} color="#999" />
                        <input type="text" placeholder="Search clients..." className={styles.searchInput} style={{ background: 'transparent' }} />
                    </div>
                    {/* Filters placeholder */}
                    <select style={{ border: 'none', background: 'transparent', color: '#666', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Pending</option>
                    </select>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#999', fontSize: '0.85rem', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>COUPLE</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>WEDDING DATE</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>STATUS</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>BUDGET</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eee' }} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{client.name1} & {client.name2}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{client.date}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 50,
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        background: client.status === 'Active' ? '#e8f5e9' : client.status === 'Pending' ? '#fff3e0' : '#f5f5f5',
                                        color: client.status === 'Active' ? '#2e7d32' : client.status === 'Pending' ? '#ef6c00' : '#757575'
                                    }}>
                                        {client.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{client.budget}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}>
                                        <MoreHorizontal size={18} />
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
