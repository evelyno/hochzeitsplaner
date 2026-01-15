'use client'

import styles from './dashboard.module.css'
import RevenueChart from './components/RevenueChart'
import { ArrowUpRight, DollarSign, ShoppingBag, Users as UsersIcon } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 300 }}>
                Dashboard
            </h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Welcome back, here's what's happening today.
            </p>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.statLabel}>Total Earnings</span>
                        <div style={{ padding: 8, background: '#fff5eb', borderRadius: '50%' }}>
                            <DollarSign size={20} color="#d4a373" />
                        </div>
                    </div>
                    <div className={styles.statValue}>$12,500</div>
                    <div style={{ fontSize: '0.8rem', color: '#4caf50', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ArrowUpRight size={14} /> +12% from last month
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.statLabel}>Active Weddings</span>
                        <div style={{ padding: 8, background: '#e3f2fd', borderRadius: '50%' }}>
                            <UsersIcon size={20} color="#2196f3" />
                        </div>
                    </div>
                    <div className={styles.statValue}>8</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        3 upcoming this month
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.statLabel}>Pending Orders</span>
                        <div style={{ padding: 8, background: '#f3e5f5', borderRadius: '50%' }}>
                            <ShoppingBag size={20} color="#9c27b0" />
                        </div>
                    </div>
                    <div className={styles.statValue}>12</div>
                    <div style={{ fontSize: '0.8rem', color: '#f44336' }}>
                        2 require attention
                    </div>
                </div>
            </div>

            {/* Main Sections Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Revenue Chart Section */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Monthly Revenue</h3>
                        <select style={{ border: '1px solid #eee', padding: '0.25rem 0.5rem', borderRadius: 6, fontSize: '0.85rem', color: '#666' }}>
                            <option>2023</option>
                            <option>2022</option>
                        </select>
                    </div>
                    <RevenueChart />
                </div>

                {/* Recent Activity / New Arrivals */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Users</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: i < 4 ? '1px solid #f5f5f5' : 'none' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee' }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Jonathan Doe</div>
                                    <div style={{ fontSize: '0.75rem', color: '#999' }}>2 hours ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
