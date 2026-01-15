'use client'

import React, { useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from 'date-fns'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'
import styles from '../dashboard.module.css'

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Calendar logic
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    // Dummy events
    const events = [
        { date: new Date(2024, 7, 12), title: 'Doe Wedding', time: '14:00', type: 'wedding' },
        { date: new Date(2024, 7, 15), title: 'Tasting: Smith', time: '11:00', type: 'meeting' },
        { date: new Date(), title: 'Venue Tour', time: '16:00', type: 'tour' },
    ]

    const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(event.date, day))
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>Calendar</h1>
                    <p style={{ color: '#666' }}>Schedule and upcoming events.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <button onClick={prevMonth} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}><ChevronLeft size={20} /></button>
                    <span style={{ fontWeight: 600, minWidth: 120, textAlign: 'center' }}>{format(currentDate, 'MMMM yyyy')}</span>
                    <button onClick={nextMonth} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}><ChevronRight size={20} /></button>
                </div>
            </div>

            <div style={{ flex: 1, background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>

                {/* Days Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '1rem' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, borderTop: '1px solid #eee', borderLeft: '1px solid #eee' }}>
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getEventsForDay(day)
                        const isSelected = isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, currentDate)

                        return (
                            <div
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                style={{
                                    minHeight: 100,
                                    borderRight: '1px solid #eee',
                                    borderBottom: '1px solid #eee',
                                    padding: '0.5rem',
                                    backgroundColor: !isCurrentMonth ? '#fdfdfd' : 'white',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'background 0.2s'
                                }}
                            // hover effect normally done in css, inline for simplicity here
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    background: isSelected ? '#d4a373' : 'transparent',
                                    color: isSelected ? 'white' : !isCurrentMonth ? '#ccc' : '#333',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    marginBottom: '0.5rem'
                                }}>
                                    {format(day, 'd')}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {dayEvents.map((event, i) => (
                                        <div key={i} style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            background: event.type === 'wedding' ? '#fff3e0' : '#e3f2fd',
                                            color: event.type === 'wedding' ? '#ef6c00' : '#1976d2',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
