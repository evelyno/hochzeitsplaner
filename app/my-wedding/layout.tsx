'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Heart,
    ListTodo,
    Users,
    LogOut,
    Settings
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import styles from './client-dashboard.module.css'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const isActive = (path: string) => pathname === path ? styles.activeNavItem : ''

    return (
        <div className={styles.layout}>
            {/* Slim Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Heart size={28} fill="#d4a373" />
                </div>

                <Link href="/my-wedding" className={`${styles.navItem} ${isActive('/my-wedding')}`} title="Dashboard">
                    <Heart size={20} />
                </Link>
                <Link href="/my-wedding/checklist" className={`${styles.navItem} ${isActive('/my-wedding/checklist')}`} title="Checklist">
                    <ListTodo size={20} />
                </Link>
                <Link href="/my-wedding/guests" className={`${styles.navItem} ${isActive('/my-wedding/guests')}`} title="Guests">
                    <Users size={20} />
                </Link>

                <div style={{ marginTop: 'auto' }}>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className={styles.navItem}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a' }}>
                        The Wedding of {session?.user?.name || 'Us'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>{session?.user?.email}</span>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                            {/* Avatar */}
                        </div>
                    </div>
                </header>

                <main className={styles.pageContent}>
                    {children}
                </main>
            </div>
        </div>
    )
}
