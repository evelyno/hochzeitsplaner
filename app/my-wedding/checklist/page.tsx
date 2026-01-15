'use client'

import { useState, useEffect } from 'react'
import styles from '../client-dashboard.module.css'
import { Plus, Check, Trash2, Edit2, X } from 'lucide-react'

interface Task {
    id: string
    description: string
    isCompleted: boolean
}

export default function ChecklistPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newTask, setNewTask] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [eventId, setEventId] = useState<string | null>(null)

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
                const data = await res.json()
                setTasks(data)
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addTask = async () => {
        if (!newTask.trim() || !eventId) return

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, description: newTask })
            })

            if (res.ok) {
                const task = await res.json()
                setTasks([...tasks, task])
                setNewTask('')
            }
        } catch (error) {
            console.error('Failed to add task:', error)
        }
    }

    const toggleTask = async (id: string, isCompleted: boolean) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isCompleted: !isCompleted })
            })

            if (res.ok) {
                setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !isCompleted } : t))
            }
        } catch (error) {
            console.error('Failed to toggle task:', error)
        }
    }

    const deleteTask = async (id: string) => {
        try {
            const res = await fetch(`/api/tasks?id=${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
        }
    }

    const startEdit = (task: Task) => {
        setEditingId(task.id)
        setEditText(task.description)
    }

    const saveEdit = async (id: string) => {
        if (!editText.trim()) return

        try {
            const res = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, description: editText })
            })

            if (res.ok) {
                setTasks(tasks.map(t => t.id === id ? { ...t, description: editText } : t))
                setEditingId(null)
                setEditText('')
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditText('')
    }

    const completedCount = tasks.filter(t => t.isCompleted).length
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Checkliste</h1>
                <p style={{ color: '#666' }}>Behalten Sie den Überblick über alle Aufgaben</p>
            </div>

            {/* Progress */}
            <div className={styles.card} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Fortschritt</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{completedCount} von {tasks.length} erledigt</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a373' }}>{progress.toFixed(0)}%</div>
                </div>
                <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #d4a373, #c89563)',
                        transition: 'width 0.3s'
                    }}></div>
                </div>
            </div>

            {/* Add New Task */}
            <div className={styles.card} style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Neue Aufgabe hinzufügen..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            border: '1px solid #eee',
                            borderRadius: 8,
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={addTask}
                        style={{
                            background: '#d4a373',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500
                        }}
                    >
                        <Plus size={18} /> Hinzufügen
                    </button>
                </div>
            </div>

            {/* Tasks List */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Lädt...</div>
                ) : tasks.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                        Noch keine Aufgaben. Fügen Sie Ihre erste Aufgabe hinzu!
                    </div>
                ) : (
                    <div>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                style={{
                                    padding: '1rem 1.5rem',
                                    borderBottom: '1px solid #f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: task.isCompleted ? '#f9f9f9' : 'white',
                                    transition: 'background 0.2s'
                                }}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleTask(task.id, task.isCompleted)}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 6,
                                        border: task.isCompleted ? 'none' : '2px solid #ddd',
                                        background: task.isCompleted ? '#4caf50' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    {task.isCompleted && <Check size={16} color="white" />}
                                </button>

                                {/* Task Text */}
                                {editingId === task.id ? (
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            border: '1px solid #d4a373',
                                            borderRadius: 4,
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        style={{
                                            flex: 1,
                                            fontSize: '0.95rem',
                                            textDecoration: task.isCompleted ? 'line-through' : 'none',
                                            color: task.isCompleted ? '#999' : '#333'
                                        }}
                                    >
                                        {task.description}
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {editingId === task.id ? (
                                        <>
                                            <button
                                                onClick={() => saveEdit(task.id)}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4caf50', padding: '0.25rem' }}
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', padding: '0.25rem' }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEdit(task)}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666', padding: '0.25rem' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f44336', padding: '0.25rem' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
