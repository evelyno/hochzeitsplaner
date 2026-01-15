'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Search,
    Bell,
    DollarSign,
    Briefcase,
    UserCheck
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

    const isActive = (path: string) => pathname === path ? styles.activeNavItem : ''

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div style={{ width: 24, height: 24, background: '#d4a373', borderRadius: 4 }}></div>
                    WeddingPlanner
                </div>

                <nav className={styles.navGroup}>
                    <div className={styles.groupLabel}>Main</div>
                    <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/clients" className={`${styles.navItem} ${isActive('/dashboard/clients')}`}>
                        <Users size={18} />
                        Clients
                    </Link>
                    <Link href="/dashboard/budget" className={`${styles.navItem} ${isActive('/dashboard/budget')}`}>
                        <DollarSign size={18} />
                        Budget
                    </Link>
                    <Link href="/dashboard/guests" className={`${styles.navItem} ${isActive('/dashboard/guests')}`}>
                        <UserCheck size={18} />
                        Guests
                    </Link>
                    <Link href="/dashboard/vendors" className={`${styles.navItem} ${isActive('/dashboard/vendors')}`}>
                        <Briefcase size={18} />
                        Vendors
                    </Link>
                    <Link href="/dashboard/calendar" className={`${styles.navItem} ${isActive('/dashboard/calendar')}`}>
                        <Calendar size={18} />
                        Calendar
                    </Link>
                </nav>

                <nav className={styles.navGroup} style={{ marginTop: 'auto' }}>
                    <div className={styles.groupLabel}>Settings</div>
                    <Link href="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings')}`}>
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
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="#999" />
                        <input type="text" placeholder="Search..." className={styles.searchInput} />
                    </div>

                    <div className={styles.userProfile}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Bell size={20} color="#666" />
                        </button>
                        <div className={styles.avatar}>
                            {/* Placeholder Avatar */}
                            <div style={{ width: '100%', height: '100%', background: '#ddd' }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            {session?.user?.name || 'Venue Operator'}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className={styles.pageContent}>
                    {children}
                </main>
            </div>
        </div>
    )
}
