'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    DollarSign,
    Briefcase,
    UserCheck,
    Menu,
    X
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import styles from './dashboard.module.css'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isActive = (path: string) => pathname === path ? styles.activeNavItem : ''

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

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.brand}>
                    <div style={{ width: 24, height: 24, background: '#d4a373', borderRadius: 4 }}></div>
                    WeddingPlanner
                </div>

                <nav className={styles.navGroup}>
                    <div className={styles.groupLabel}>Main</div>
                    <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard')}`} onClick={closeMobileMenu}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/clients" className={`${styles.navItem} ${isActive('/dashboard/clients')}`} onClick={closeMobileMenu}>
                        <Users size={18} />
                        Clients
                    </Link>
                    <Link href="/dashboard/budget" className={`${styles.navItem} ${isActive('/dashboard/budget')}`} onClick={closeMobileMenu}>
                        <DollarSign size={18} />
                        Budget
                    </Link>
                    <Link href="/dashboard/guests" className={`${styles.navItem} ${isActive('/dashboard/guests')}`} onClick={closeMobileMenu}>
                        <UserCheck size={18} />
                        Guests
                    </Link>
                    <Link href="/dashboard/vendors" className={`${styles.navItem} ${isActive('/dashboard/vendors')}`} onClick={closeMobileMenu}>
                        <Briefcase size={18} />
                        Vendors
                    </Link>
                    <Link href="/dashboard/calendar" className={`${styles.navItem} ${isActive('/dashboard/calendar')}`} onClick={closeMobileMenu}>
                        <Calendar size={18} />
                        Calendar
                    </Link>
                </nav>

                <nav className={styles.navGroup} style={{ marginTop: 'auto' }}>
                    <div className={styles.groupLabel}>Settings</div>
                    <Link href="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings')}`} onClick={closeMobileMenu}>
                        <Settings size={18} />
                        Settings
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className={styles.navItem}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                            {pathname === '/dashboard' && 'Dashboard'}
                            {pathname === '/dashboard/clients' && 'Clients'}
                            {pathname === '/dashboard/budget' && 'Budget'}
                            {pathname === '/dashboard/guests' && 'Guests'}
                            {pathname === '/dashboard/vendors' && 'Vendors'}
                            {pathname === '/dashboard/calendar' && 'Calendar'}
                            {pathname === '/dashboard/settings' && 'Settings'}
                        </h1>
                    </div>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>
                            <div style={{ width: '100%', height: '100%', background: '#d4a373', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                                {session?.user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{session?.user?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>{session?.user?.role}</div>
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
