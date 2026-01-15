'use client'

import styles from '../client-dashboard.module.css'
import { CheckCircle2, Circle } from 'lucide-react'

const checklistData = [
    {
        category: '12 Months Before',
        items: [
            { id: 1, text: 'Determine budget', completed: true },
            { id: 2, text: 'Start guest list', completed: true },
            { id: 3, text: 'Hire wedding planner', completed: true },
            { id: 4, text: 'Reserve date and venues', completed: false },
        ]
    },
    {
        category: '9 Months Before',
        items: [
            { id: 5, text: 'Book photographer', completed: false },
            { id: 6, text: 'Book entertainment (band/DJ)', completed: false },
            { id: 7, text: 'Meet with caterers', completed: false },
        ]
    },
    {
        category: '6 Months Before',
        items: [
            { id: 8, text: 'Send Save the Dates', completed: false },
            { id: 9, text: 'Purchase dress', completed: false },
            { id: 10, text: 'Reserve block of hotel rooms', completed: false },
        ]
    }
]

export default function ChecklistPage() {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Planning Checklist</h1>
                <p style={{ color: '#666' }}>Stay on track with your wedding to-dos.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {checklistData.map((section, idx) => (
                    <div key={idx} className={styles.card}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#d4a373' }}>{section.category}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {section.items.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem',
                                    borderRadius: 8,
                                    transition: 'background 0.2s',
                                    cursor: 'pointer',
                                    background: item.completed ? '#fcfcfc' : 'transparent'
                                }}>
                                    {item.completed ?
                                        <CheckCircle2 size={24} color="#4caf50" /> :
                                        <Circle size={24} color="#e0e0e0" />
                                    }
                                    <span style={{
                                        textDecoration: item.completed ? 'line-through' : 'none',
                                        color: item.completed ? '#999' : '#333',
                                        fontSize: '1rem'
                                    }}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
