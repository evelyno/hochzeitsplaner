'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './client-dashboard.module.css'
import { Home, Users, CheckSquare, Clock, Euro, Briefcase, Calendar, LogOut, Menu, X, User, Image, Grid3x3, Music, Gift } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navItems = [
        { href: '/my-wedding', label: 'Übersicht', icon: Home },
        { href: '/my-wedding/checklist', label: 'Checkliste', icon: CheckSquare },
        { href: '/my-wedding/timeline', label: 'Ablaufplan', icon: Clock },
        { href: '/my-wedding/budget', label: 'Budget', icon: Euro },
        { href: '/my-wedding/guests', label: 'Gäste', icon: Users },
        { href: '/my-wedding/seating', label: 'Sitzplan', icon: Grid3x3 },
        { href: '/my-wedding/vendors', label: 'Dienstleister', icon: Briefcase },
        { href: '/my-wedding/calendar', label: 'Kalender', icon: Calendar },
        { href: '/my-wedding/playlist', label: 'Playlist', icon: Music },
        { href: '/my-wedding/moodboard', label: 'Moodboard', icon: Image },
        { href: '/my-wedding/gifts', label: 'Geschenke', icon: Gift },
        { href: '/my-wedding/profile', label: 'Profil', icon: User },
    ]

    const closeMobileMenu = () => setMobileMenuOpen(false)

    return (
        <div className={styles.layout}>
            {/* Mobile Menu Toggle */}
            <button
                className={styles.mobileMenuToggle}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            <div
                className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.show : ''}`}
                onClick={closeMobileMenu}
            />

            <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ''}`}>
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
                                onClick={closeMobileMenu}
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
