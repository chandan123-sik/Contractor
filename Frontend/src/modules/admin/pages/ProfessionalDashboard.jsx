import React, { useState } from 'react';
import {
    BarChart3,
    Users,
    HardHat,
    Briefcase,
    LayoutDashboard,
    Settings,
    Bell,
    Search,
    MessageSquare,
    X,
    Send,
    Plus,
    Trash2,
    Edit,
    CheckCircle,
    AlertCircle,
    MoreVertical,
    LogOut,
    SlidersHorizontal
} from 'lucide-react';
import { Outlet, useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import './AdminDashboard.css';

// Internal Components
export function AnalyticsCard({ icon, title, value, bg }) {
    return (
        <div className="analytics-card">
            <div className="analytics-icon" style={{ backgroundColor: bg }}>
                {icon}
            </div>
            <div className="analytics-info">
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
        </div>
    );
}

export function ChatOverlay({ onClose }) {
    return (
        <div className="chat-overlay">
            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span>Vietusw Support</span>
                </div>
                <X size={18} style={{ cursor: 'pointer' }} onClick={onClose} />
            </div>
            <div className="chat-messages">
                <div className="message received">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Dlrawa (ID: 683)</div>
                    Hi, I need help with my verification.
                    <div className="waveform">
                        {[5, 12, 8, 15, 10, 18, 14, 20, 16, 12, 8, 10, 5, 12, 8].map((h, i) => (
                            <div key={i} className="waveform-bar" style={{ height: `${h}px` }}></div>
                        ))}
                    </div>
                </div>
                <div className="message sent">Please upload your Aadhar Card photo.</div>
                <div className="message received">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Dlrawa</div>
                    Okay, doing it now.
                </div>
            </div>
            <div className="chat-input" style={{ padding: '12px' }}>
                <div style={{ display: 'block', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Type to respond..."
                        className="admin-search-input"
                        style={{ width: '100%', marginBottom: '8px', border: '1px solid #eee', borderRadius: '8px', padding: '8px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button style={{ color: '#6b7280', background: 'none', border: 'none' }}><Plus size={18} /></button>
                        <button style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '0.85rem' }}>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DashboardHome() {
    return (
        <>
            <div className="analytics-grid">
                <AnalyticsCard icon={<Users color="#3b82f6" />} title="Total Users" value="12,450" bg="#eff6ff" />
                <AnalyticsCard icon={<HardHat color="#f97316" />} title="Total Labours" value="8,900" bg="#fff7ed" />
                <AnalyticsCard icon={<Briefcase color="#10b981" />} title="Total Contractors" value="2,100" bg="#ecfdf5" />
                <AnalyticsCard icon={<Bell color="#f43f5e" />} title="Active Requests" value="24" bg="#fff1f2" />
            </div>

            <div className="dashboard-content-grid">
                <div className="interaction-monitor">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Interaction Monitor</h2>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Request Type: All</div>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Request Type</th>
                                <th>Content</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>User (ID: 123)</td>
                                <td>Labour (ID: 456)</td>
                                <td>HIRE</td>
                                <td>HIRE</td>
                                <td><span className="status-badge status-pending">PENDING</span></td>
                            </tr>
                            <tr>
                                <td>Labour (ID: 456)</td>
                                <td>Contractor (ID: 789)</td>
                                <td>HIRE + Audio</td>
                                <td>Text + Audio</td>
                                <td><span className="status-badge status-pending">PENDING</span></td>
                            </tr>
                            <tr>
                                <td>Contractor (ID: 101)</td>
                                <td>Labour (ID: 101)</td>
                                <td>JOIN_TEAM</td>
                                <td>Audio</td>
                                <td><span className="status-badge status-pending">PENDING</span></td>
                            </tr>
                            <tr>
                                <td>Labour (ID: 101)</td>
                                <td>Contractor (ID: 789)</td>
                                <td>Audio</td>
                                <td>PENDING</td>
                                <td><span className="status-badge status-pending">PENDING</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="right-panel">
                    <div className="right-panel-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#1a233a', padding: '10px', borderRadius: '10px' }}>
                            <BarChart3 color="#fff" size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Total Audio Logs:</h3>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>5,123 hours</p>
                        </div>
                    </div>

                    <div className="right-panel-item">
                        <h3 style={{ marginBottom: '16px' }}>Verification Queue</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee' }}></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>New Labour (ID: 112)</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>New Contractor (ID: 115)</div>
                                </div>
                            </div>
                            <button className="crud-btn btn-add" style={{ padding: '6px 12px', margin: 0 }}>Verify</button>
                        </div>
                    </div>

                    <div className="right-panel-item">
                        <h3>Dispute Center</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <span style={{ fontSize: '0.9rem' }}>Open Cases: 5</span>
                            <button className="crud-btn btn-edit" style={{ background: '#3b82f6', color: 'white' }}>Review Disputes</button>
                        </div>
                    </div>

                    <div className="right-panel-item">
                        <h3>Revenue Tracking</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '10px 0' }}>₹1,50,000</p>
                        <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '16px' }}>
                            {[10, 20, 15, 40, 70].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginTop: '4px' }}>
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                        </div>
                    </div>

                    <div className="right-panel-item">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} color="#f97316" /> Broadcast Message</h3>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '10px 0' }}>Send to All Labours</p>
                        <button className="crud-btn" style={{ width: '100%', border: '1px solid #ddd', background: 'none' }}>Draft Message</button>
                    </div>
                </div>
            </div>
        </>
    );
}

const ProfessionalDashboard = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const adminRole = localStorage.getItem('adminRole');

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminRole');
        navigate('/admin/login');
    };

    const hasAccess = (allowedRoles) => {
        return allowedRoles.includes(adminRole);
    };

    const getRoleTitle = () => {
        switch (adminRole) {
            case 'SUPER_ADMIN': return 'Super Admin';
            case 'ADMIN_USER': return 'User Admin';
            case 'ADMIN_LABOUR': return 'Labour Admin';
            case 'ADMIN_CONTRACTOR': return 'Contractor Admin';
            default: return 'Admin';
        }
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <HardHat size={32} color="#f97316" />
                    <span>Rajghar</span>
                </div>
                <nav className="admin-sidebar-nav">
                    <NavLink
                        to="/admin/dashboard/home"
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    {hasAccess(['SUPER_ADMIN', 'ADMIN_USER']) && (
                        <NavLink
                            to="/admin/dashboard/users"
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Users size={20} />
                            <span>User Options</span>
                        </NavLink>
                    )}

                    {hasAccess(['SUPER_ADMIN', 'ADMIN_LABOUR']) && (
                        <NavLink
                            to="/admin/dashboard/labours"
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <HardHat size={20} />
                            <span>Labour Options</span>
                        </NavLink>
                    )}

                    {hasAccess(['SUPER_ADMIN', 'ADMIN_LABOUR']) && (
                        <NavLink
                            to="/admin/dashboard/categories"
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <SlidersHorizontal size={20} />
                            <span>Labour Category</span>
                        </NavLink>
                    )}

                    {hasAccess(['SUPER_ADMIN', 'ADMIN_CONTRACTOR']) && (
                        <NavLink
                            to="/admin/dashboard/contractors"
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Briefcase size={20} />
                            <span>Contractor Options</span>
                        </NavLink>
                    )}

                    {hasAccess(['SUPER_ADMIN']) && (
                        <NavLink
                            to="/admin/dashboard/verification"
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <CheckCircle size={20} />
                            <span>Verification</span>
                        </NavLink>
                    )}
                    <div className="admin-nav-item">
                        <Bell size={20} />
                        <span>Broadcast</span>
                    </div>
                    <NavLink
                        to="/admin/dashboard/settings"
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>

                    <div
                        className="admin-nav-item"
                        style={{ marginTop: 'auto', color: '#ef4444' }}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-search-bar">
                        <Search size={18} color="#6b7280" />
                        <input type="text" placeholder="User rajsisgn" className="admin-search-input" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Bell size={24} color="#6b7280" style={{ cursor: 'pointer' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', overflow: 'hidden' }}>
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=f97316&color=fff" alt="Admin" style={{ width: '100%' }} />
                            </div>
                            <div style={{ cursor: 'default' }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Sagar Chauhan</p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{getRoleTitle()}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-tab-content">
                    <Outlet />
                </div>
            </main>

            {/* Chat Trigger */}
            <div
                className="chat-trigger"
                onClick={() => setIsChatOpen(!isChatOpen)}
                style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: '#f97316', color: 'white', padding: '16px',
                    borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 1001
                }}
            >
                {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </div>

            {isChatOpen && <ChatOverlay onClose={() => setIsChatOpen(false)} />}
        </div >
    );
};

export default ProfessionalDashboard;
