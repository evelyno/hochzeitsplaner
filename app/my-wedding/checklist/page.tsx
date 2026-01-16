'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Edit2, Trash2, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/default-checklist'

interface Task {
    id: string
    description: string
    isCompleted: boolean
    category: string
    order: number
    dueDate: string | null
}

interface GroupedTasks {
    [category: string]: Task[]
}

export default function ChecklistPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)
    const [newTaskDescription, setNewTaskDescription] = useState('')
    const [newTaskCategory, setNewTaskCategory] = useState('GENERAL')
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchUserEvent()
    }, [])

    const fetchUserEvent = async () => {
        try {
            const res = await fetch('/api/user-event')
            if (res.ok) {
                const event = await res.json()
                setEventId(event.id)
                fetchTasks(event.id)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Failed to fetch user event:', error)
            setIsLoading(false)
        }
    }

    const fetchTasks = async (evtId: string) => {
        try {
            const res = await fetch(`/api/tasks?eventId=${evtId}`)
            if (res.ok) {
                setTasks(await res.json())
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addTask = async () => {
        if (!eventId || !newTaskDescription.trim()) return

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    description: newTaskDescription,
                    category: newTaskCategory
                })
            })

            if (res.ok) {
                fetchTasks(eventId)
                setNewTaskDescription('')
                setNewTaskCategory('GENERAL')
                setShowModal(false)
            }
        } catch (error) {
            console.error('Failed to add task:', error)
        }
    }

    const toggleTask = async (task: Task) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: task.id,
                    isCompleted: !task.isCompleted
                })
            })

            if (res.ok && eventId) {
                fetchTasks(eventId)
            }
        } catch (error) {
            console.error('Failed to toggle task:', error)
        }
    }

    const updateTask = async (task: Task, newDescription: string) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: task.id,
                    description: newDescription
                })
            })

            if (res.ok && eventId) {
                fetchTasks(eventId)
                setEditingTask(null)
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const deleteTask = async (taskId: string) => {
        if (!confirm('Möchten Sie diese Aufgabe wirklich löschen?')) return

        try {
            const res = await fetch(`/api/tasks?id=${taskId}`, {
                method: 'DELETE'
            })

            if (res.ok && eventId) {
                fetchTasks(eventId)
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
        }
    }

    const toggleCategory = (category: string) => {
        const newCollapsed = new Set(collapsedCategories)
        if (newCollapsed.has(category)) {
            newCollapsed.delete(category)
        } else {
            newCollapsed.add(category)
        }
        setCollapsedCategories(newCollapsed)
    }

    // Group tasks by category
    const getRelativeDate = (dueDate: string | null) => {
        if (!dueDate) return null

        const due = new Date(dueDate)
        const now = new Date()
        const diffTime = due.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { text: `Überfällig (${Math.abs(diffDays)} Tage)`, color: '#e74c3c', urgent: true }
        if (diffDays === 0) return { text: 'Heute fällig', color: '#f39c12', urgent: true }
        if (diffDays === 1) return { text: 'Morgen fällig', color: '#f39c12', urgent: true }
        if (diffDays <= 7) return { text: `In ${diffDays} Tagen`, color: '#f39c12', urgent: false }
        if (diffDays <= 14) return { text: `In ${diffDays} Tagen`, color: '#3498db', urgent: false }
        if (diffDays <= 30) return { text: `In ${diffDays} Tagen`, color: '#95a5a6', urgent: false }

        const weeks = Math.floor(diffDays / 7)
        if (weeks <= 8) return { text: `In ${weeks} Wochen`, color: '#95a5a6', urgent: false }

        const months = Math.floor(diffDays / 30)
        return { text: `In ${months} Monaten`, color: '#95a5a6', urgent: false }
    }

    const groupedTasks: GroupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = []
        }
        acc[task.category].push(task)
        return acc
    }, {} as GroupedTasks)

    // Sort tasks within each category by order
    Object.keys(groupedTasks).forEach(category => {
        groupedTasks[category].sort((a, b) => a.order - b.order)
    })

    // Calculate progress
    const completedCount = tasks.filter(t => t.isCompleted).length
    const totalCount = tasks.length
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Category order
    const categoryOrder = [
        "12_10_MONTHS", "9_7_MONTHS", "6_5_MONTHS", "4_3_MONTHS",
        "2_MONTHS", "4_2_WEEKS", "1_WEEK", "1_DAY",
        "WEDDING_DAY", "AFTER_WEDDING", "GENERAL"
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Checkliste</h1>
                    <p style={{ color: '#666' }}>Behalten Sie den Überblick über alle Aufgaben</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ background: '#d4a373', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                >
                    <Plus size={18} /> Neue Aufgabe
                </button>
            </div>

            {/* Progress */}
            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Fortschritt</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{progress}%</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Erledigt</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{completedCount} / {totalCount}</div>
                    </div>
                </div>
                <div style={{ width: '100%', height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #d4a373, #a9845b)', transition: 'width 0.3s' }}></div>
                </div>
            </div>

            {/* Categorized Tasks */}
            {isLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {categoryOrder.map(category => {
                        const categoryTasks = groupedTasks[category] || []
                        if (categoryTasks.length === 0) return null

                        const isCollapsed = collapsedCategories.has(category)
                        const categoryCompleted = categoryTasks.filter(t => t.isCompleted).length
                        const categoryTotal = categoryTasks.length
                        const categoryProgress = Math.round((categoryCompleted / categoryTotal) * 100)

                        return (
                            <div key={category} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Category Header */}
                                <div
                                    onClick={() => toggleCategory(category)}
                                    style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', borderBottom: isCollapsed ? 'none' : '1px solid #eee' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                                            {CATEGORY_LABELS[category] || category}
                                        </h3>
                                        <div style={{ fontSize: '0.85rem', color: '#999' }}>
                                            {categoryCompleted} / {categoryTotal} ({categoryProgress}%)
                                        </div>
                                    </div>
                                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                </div>

                                {/* Category Tasks */}
                                {!isCollapsed && (
                                    <div style={{ padding: '1rem' }}>
                                        {categoryTasks.map((task, index) => (
                                            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderBottom: index < categoryTasks.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={task.isCompleted}
                                                    onChange={() => toggleTask(task)}
                                                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#d4a373' }}
                                                />
                                                {editingTask?.id === task.id ? (
                                                    <input
                                                        autoFocus
                                                        value={editingTask.description}
                                                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                                        onBlur={() => updateTask(task, editingTask.description)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') updateTask(task, editingTask.description)
                                                            if (e.key === 'Escape') setEditingTask(null)
                                                        }}
                                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #d4a373', borderRadius: 4, outline: 'none' }}
                                                    />
                                                ) : (
                                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ textDecoration: task.isCompleted ? 'line-through' : 'none', color: task.isCompleted ? '#999' : '#333' }}>
                                                            {task.description}
                                                        </span>
                                                        {task.dueDate && (() => {
                                                            const dateInfo = getRelativeDate(task.dueDate)
                                                            return dateInfo && (
                                                                <span style={{
                                                                    fontSize: '0.75rem',
                                                                    padding: '0.25rem 0.5rem',
                                                                    background: dateInfo.urgent ? dateInfo.color + '20' : '#f0f0f0',
                                                                    color: dateInfo.color,
                                                                    borderRadius: 4,
                                                                    fontWeight: dateInfo.urgent ? 600 : 400
                                                                }}>
                                                                    {dateInfo.text}
                                                                </span>
                                                            )
                                                        })()}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => setEditingTask(task)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666', padding: '0.25rem' }}><Edit2 size={16} /></button>
                                                    <button onClick={() => deleteTask(task.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f44336', padding: '0.25rem' }}><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Add Task Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Neue Aufgabe</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Beschreibung</label>
                            <input
                                autoFocus
                                type="text"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                placeholder="z.B. Fotograf buchen"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8, outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kategorie</label>
                            <select
                                value={newTaskCategory}
                                onChange={(e) => setNewTaskCategory(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8, outline: 'none' }}
                            >
                                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, background: '#f5f6fa', border: '1px solid #eee', padding: '0.75rem', borderRadius: 8, cursor: 'pointer' }}>Abbrechen</button>
                            <button onClick={addTask} style={{ flex: 1, background: '#d4a373', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 8, cursor: 'pointer' }}>Hinzufügen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
