'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './client-dashboard.module.css'
import { Home, Users, CheckSquare, Clock, Euro, Briefcase, Calendar, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const navItems = [
        { href: '/my-wedding', label: 'Übersicht', icon: Home },
        { href: '/my-wedding/checklist', label: 'Checkliste', icon: CheckSquare },
        { href: '/my-wedding/timeline', label: 'Ablaufplan', icon: Clock },
        { href: '/my-wedding/budget', label: 'Budget', icon: Euro },
        { href: '/my-wedding/guests', label: 'Gäste', icon: Users },
        { href: '/my-wedding/vendors', label: 'Dienstleister', icon: Briefcase },
        { href: '/my-wedding/calendar', label: 'Kalender', icon: Calendar },
    ]

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Meine Hochzeit</h2>
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
                <div style={{ marginTop: 'auto', padding: '1rem' }}>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: '1px solid #eee',
                            padding: '0.75rem',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#666'
                        }}
                    >
                        <LogOut size={18} />
                        <span>Abmelden</span>
                    </button>
                    {session?.user && (
                        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
                            {session.user.name || session.user.email}
                        </div>
                    )}
                </div>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
