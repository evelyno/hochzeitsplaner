'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './client-dashboard.module.css'
import { Users, CheckSquare, Euro, Briefcase, Calendar, Music, Gift, Grid3x3, TrendingUp, AlertCircle } from 'lucide-react'

interface DashboardStats {
    guests: {
        total: number
        confirmed: number
        pending: number
    }
    tasks: {
        total: number
        completed: number
        upcoming: any[]
    }
    budget: {
        total: number
        spent: number
        remaining: number
    }
    vendors: {
        total: number
        confirmed: number
        pending: number
    }
    timeline: {
        nextEvent: any
        totalEvents: number
    }
}

export default function ClientDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [eventId, setEventId] = useState<string | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Get user's event
            const eventRes = await fetch('/api/user-event')
            if (!eventRes.ok) {
                setIsLoading(false)
                return
            }
            const event = await eventRes.json()
            setEventId(event.id)

            // Fetch all data in parallel
            const [guestsRes, tasksRes, budgetRes, vendorsRes, timelineRes] = await Promise.all([
                fetch(`/api/guests?eventId=${event.id}`),
                fetch(`/api/tasks?eventId=${event.id}`),
                fetch(`/api/budget?eventId=${event.id}`),
                fetch(`/api/vendors?eventId=${event.id}`),
                fetch(`/api/timeline?eventId=${event.id}`)
            ])

            const guests = guestsRes.ok ? await guestsRes.json() : []
            const tasks = tasksRes.ok ? await tasksRes.json() : []
            const budgetData = budgetRes.ok ? await budgetRes.json() : null
            const vendors = vendorsRes.ok ? await vendorsRes.json() : []
            const timeline = timelineRes.ok ? await timelineRes.json() : []

            // Calculate stats
            const guestStats = {
                total: guests.length,
                confirmed: guests.filter((g: any) => g.rsvpStatus === 'CONFIRMED').length,
                pending: guests.filter((g: any) => g.rsvpStatus === 'PENDING').length
            }

            const taskStats = {
                total: tasks.length,
                completed: tasks.filter((t: any) => t.isCompleted).length,
                upcoming: tasks
                    .filter((t: any) => !t.isCompleted)
                    .sort((a: any, b: any) => {
                        // Sort by due date if available
                        if (a.dueDate && b.dueDate) {
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                        }
                        return 0
                    })
                    .slice(0, 5)
            }

            const budgetStats = budgetData ? {
                total: budgetData.totalBudget || 0,
                spent: budgetData.items?.reduce((sum: number, item: any) => sum + (item.actualCost || 0), 0) || 0,
                remaining: 0
            } : { total: 0, spent: 0, remaining: 0 }
            budgetStats.remaining = budgetStats.total - budgetStats.spent

            const vendorStats = {
                total: vendors.length,
                confirmed: vendors.filter((v: any) => v.status === 'CONFIRMED').length,
                pending: vendors.filter((v: any) => v.status === 'PENDING').length
            }

            const now = new Date()
            const upcomingEvents = timeline.filter((e: any) => new Date(e.dateTime) > now).sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

            const timelineStats = {
                nextEvent: upcomingEvents[0] || null,
                totalEvents: timeline.length
            }

            setStats({
                guests: guestStats,
                tasks: taskStats,
                budget: budgetStats,
                vendors: vendorStats,
                timeline: timelineStats
            })

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className={styles.main}>
                <h1 className={styles.title}>Lädt...</h1>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className={styles.main}>
                <h1 className={styles.title}>Übersicht</h1>
                <p>Keine Daten verfügbar. Bitte erstellen Sie zuerst eine Hochzeit.</p>
            </div>
        )
    }

    const progressPercentage = stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0
    const budgetPercentage = stats.budget.total > 0 ? Math.round((stats.budget.spent / stats.budget.total) * 100) : 0

    return (
        <div className={styles.main}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className={styles.title}>Übersicht</h1>
                <p style={{ opacity: 0.7 }}>Ihr Hochzeitsplaner auf einen Blick</p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Link href="/my-wedding/guests" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid transparent' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#d4a373'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{stats.guests.total}</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Gäste</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                            <span style={{ color: '#27ae60' }}>✓ {stats.guests.confirmed} Zugesagt</span>
                            <span style={{ color: '#f39c12' }}>⏳ {stats.guests.pending} Ausstehend</span>
                        </div>
                    </div>
                </Link>

                <Link href="/my-wedding/budget" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid transparent' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#d4a373'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Euro size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>€{stats.budget.total.toLocaleString()}</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Budget</div>
                            </div>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${budgetPercentage}%`, background: budgetPercentage > 90 ? '#e74c3c' : '#d4a373', transition: 'width 0.3s' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                            €{stats.budget.spent.toLocaleString()} ausgegeben · €{stats.budget.remaining.toLocaleString()} übrig
                        </div>
                    </div>
                </Link>

                <Link href="/my-wedding/vendors" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid transparent' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#d4a373'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{stats.vendors.total}</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Dienstleister</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                            <span style={{ color: '#27ae60' }}>✓ {stats.vendors.confirmed} Bestätigt</span>
                            <span style={{ color: '#f39c12' }}>⏳ {stats.vendors.pending} Ausstehend</span>
                        </div>
                    </div>
                </Link>

                <Link href="/my-wedding/checklist" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid transparent' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#d4a373'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckSquare size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{progressPercentage}%</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Fortschritt</div>
                            </div>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${progressPercentage}%`, background: '#27ae60', transition: 'width 0.3s' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                            {stats.tasks.completed} von {stats.tasks.total} Aufgaben erledigt
                        </div>
                    </div>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '2fr 1fr' : '1fr', gap: '2rem' }}>
                {/* Upcoming Tasks */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Nächste Aufgaben</h2>
                        <Link href="/my-wedding/checklist" style={{ color: '#d4a373', textDecoration: 'none', fontSize: '0.9rem' }}>Alle anzeigen →</Link>
                    </div>
                    {stats.tasks.upcoming.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats.tasks.upcoming.map((task: any) => (
                                <div key={task.id} style={{ padding: '1rem', background: '#f9f9f9', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid #d4a373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{task.description}</div>
                                        {task.dueDate && (() => {
                                            const due = new Date(task.dueDate)
                                            const now = new Date()
                                            const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                                            let dateText = ''
                                            let dateColor = '#666'

                                            if (diffDays < 0) {
                                                dateText = `Überfällig (${Math.abs(diffDays)} Tage)`
                                                dateColor = '#e74c3c'
                                            } else if (diffDays === 0) {
                                                dateText = 'Heute fällig'
                                                dateColor = '#f39c12'
                                            } else if (diffDays === 1) {
                                                dateText = 'Morgen fällig'
                                                dateColor = '#f39c12'
                                            } else if (diffDays <= 7) {
                                                dateText = `In ${diffDays} Tagen`
                                                dateColor = '#f39c12'
                                            } else if (diffDays <= 14) {
                                                dateText = `In ${diffDays} Tagen`
                                                dateColor = '#3498db'
                                            } else {
                                                const weeks = Math.floor(diffDays / 7)
                                                dateText = `In ${weeks} Wochen`
                                                dateColor = '#95a5a6'
                                            }

                                            return <div style={{ fontSize: '0.85rem', color: dateColor }}>{dateText}</div>
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>Alle Aufgaben erledigt! 🎉</p>
                    )}
                </div>

                {/* Timeline & Quick Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Next Timeline Event */}
                    {stats.timeline.nextEvent && (
                        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', borderRadius: 16, color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', opacity: 0.9 }}>
                                <Calendar size={20} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nächster Termin</span>
                            </div>
                            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.25rem' }}>{stats.timeline.nextEvent.title}</h3>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                                {new Date(stats.timeline.nextEvent.dateTime).toLocaleDateString('de-DE', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Quick Links */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Schnellzugriff</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link href="/my-wedding/seating" style={{ padding: '1rem', background: '#f9f9f9', borderRadius: 8, textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#d4a373'} onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}>
                                <Grid3x3 size={20} />
                                <span>Sitzplan</span>
                            </Link>
                            <Link href="/my-wedding/playlist" style={{ padding: '1rem', background: '#f9f9f9', borderRadius: 8, textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#d4a373'} onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}>
                                <Music size={20} />
                                <span>Playlist</span>
                            </Link>
                            <Link href="/my-wedding/gifts" style={{ padding: '1rem', background: '#f9f9f9', borderRadius: 8, textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#d4a373'} onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}>
                                <Gift size={20} />
                                <span>Geschenkliste</span>
                            </Link>
                            <Link href="/my-wedding/moodboard" style={{ padding: '1rem', background: '#f9f9f9', borderRadius: 8, textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#d4a373'} onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}>
                                <TrendingUp size={20} />
                                <span>Moodboard</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
