import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Eye,
    User,
    HardHat,
    Briefcase,
    Search,
    Filter,
    FileText,
    ShieldCheck
} from 'lucide-react';
import './AdminDashboard.css';

const VerificationManagement = () => {
    const [activeCategory, setActiveCategory] = useState('labours');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data for verification queries
    const [verificationRequests, setVerificationRequests] = useState({
        users: [
            { id: 'V-U-001', name: 'Rahul Sharma', phone: '9876543210', date: '2026-02-05', status: 'Pending', aadhaar: '4562 8901 2345' },
            { id: 'V-U-002', name: 'Anita Devi', phone: '8765432109', date: '2026-02-04', status: 'Approved', aadhaar: '1234 5678 9012' }
        ],
        labours: [
            { id: 'V-L-001', name: 'Vikram Singh', phone: '9988776655', date: '2026-02-06', status: 'Pending', trade: 'Mason', aadhaar: '9001 2233 4455' },
            { id: 'V-L-002', name: 'Sunil Dutt', phone: '8877665544', date: '2026-02-05', status: 'Pending', trade: 'Electrician', aadhaar: '8877 6655 4433' }
        ],
        contractors: [
            { id: 'V-C-001', name: 'Sagar Chauhan', phone: '9000000001', date: '2026-02-06', status: 'Pending', company: 'Appzeto Const.', aadhaar: '1122 3344 5566' }
        ]
    });

    const handleAction = (category, id, newStatus) => {
        setVerificationRequests(prev => ({
            ...prev,
            [category]: prev[category].map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            )
        }));
        if (selectedRequest && selectedRequest.id === id) {
            setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
    };

    const openDetails = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    return (
        <div className="management-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck color="#f97316" size={28} />
                    Verification Management
                </h2>
                <div className="admin-search-bar" style={{ width: '250px' }}>
                    <Search size={18} color="#6b7280" />
                    <input type="text" placeholder="Search requests..." className="admin-search-input" />
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                background: 'rgba(0,0,0,0.03)',
                padding: '6px',
                borderRadius: '12px',
                width: 'fit-content'
            }}>
                <button
                    onClick={() => setActiveCategory('users')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeCategory === 'users' ? 'white' : 'transparent',
                        color: activeCategory === 'users' ? '#1a233a' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeCategory === 'users' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <User size={18} /> Users
                </button>
                <button
                    onClick={() => setActiveCategory('labours')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeCategory === 'labours' ? 'white' : 'transparent',
                        color: activeCategory === 'labours' ? '#1a233a' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeCategory === 'labours' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <HardHat size={18} /> Labours
                </button>
                <button
                    onClick={() => setActiveCategory('contractors')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeCategory === 'contractors' ? 'white' : 'transparent',
                        color: activeCategory === 'contractors' ? '#1a233a' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeCategory === 'contractors' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <Briefcase size={18} /> Contractors
                </button>
            </div>

            {/* Verification Table */}
            <div className="interaction-monitor">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            {activeCategory === 'labours' && <th>Trade</th>}
                            {activeCategory === 'contractors' && <th>Company</th>}
                            <th>Submission Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {verificationRequests[activeCategory].map(req => (
                            <tr key={req.id}>
                                <td style={{ fontWeight: 600, color: '#f97316' }}>{req.id}</td>
                                <td>{req.name}</td>
                                <td>{req.phone}</td>
                                {activeCategory === 'labours' && <td>{req.trade}</td>}
                                {activeCategory === 'contractors' && <td>{req.company}</td>}
                                <td>{req.date}</td>
                                <td>
                                    <span className={`status-badge ${req.status === 'Approved' ? 'status-completed' :
                                            req.status === 'Rejected' ? 'status-pending' : ''
                                        }`} style={{
                                            background: req.status === 'Rejected' ? '#fee2e2' : '',
                                            color: req.status === 'Rejected' ? '#b91c1c' : ''
                                        }}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="crud-btn btn-edit"
                                            title="View Details"
                                            onClick={() => openDetails(req)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {req.status === 'Pending' && (
                                            <>
                                                <button
                                                    className="crud-btn"
                                                    style={{ background: '#d1fae5', color: '#065f46' }}
                                                    onClick={() => handleAction(activeCategory, req.id, 'Approved')}
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    className="crud-btn"
                                                    style={{ background: '#fee2e2', color: '#b91c1c' }}
                                                    onClick={() => handleAction(activeCategory, req.id, 'Rejected')}
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Document Details Modal */}
            {isModalOpen && selectedRequest && (
                <div className="modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '500px', width: '90%' }}>
                        <div className="chat-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={20} />
                                <span>Legal Verification Details</span>
                            </div>
                            <XCircle size={24} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '48px', height: '48px',
                                    background: '#e2e8f0', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User color="#64748b" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{selectedRequest.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{selectedRequest.id} | {selectedRequest.phone}</p>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span className={`status-badge ${selectedRequest.status === 'Approved' ? 'status-completed' :
                                            selectedRequest.status === 'Rejected' ? 'status-pending' : ''
                                        }`} style={{
                                            background: selectedRequest.status === 'Rejected' ? '#fee2e2' : '',
                                            color: selectedRequest.status === 'Rejected' ? '#b91c1c' : ''
                                        }}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Aadhaar Number (12 Digit)</label>
                                <div style={{
                                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
                                    padding: '12px', display: 'flex', alignItems: 'center', gap: '12px'
                                }}>
                                    <ShieldCheck size={18} color="#64748b" />
                                    <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{selectedRequest.aadhaar}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Uploaded Document Photos</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{
                                        aspectRatio: '16/10', background: '#f1f5f9', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px dashed #cbd5e1', overflow: 'hidden'
                                    }}>
                                        <img src={`https://placehold.co/400x250/1a233a/ffffff?text=Aadhaar+Front+${selectedRequest.id}`} alt="Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{
                                        aspectRatio: '16/10', background: '#f1f5f9', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px dashed #cbd5e1', overflow: 'hidden'
                                    }}>
                                        <img src={`https://placehold.co/400x250/1a233a/ffffff?text=Aadhaar+Back+${selectedRequest.id}`} alt="Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.status === 'Pending' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button
                                        onClick={() => handleAction(activeCategory, selectedRequest.id, 'Approved')}
                                        className="crud-btn btn-add" style={{ margin: 0, background: '#10b981' }}>
                                        Approve Verification
                                    </button>
                                    <button
                                        onClick={() => handleAction(activeCategory, selectedRequest.id, 'Rejected')}
                                        className="crud-btn" style={{ margin: 0, background: '#ef4444', color: 'white' }}>
                                        Reject Request
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 2000;
                }
                .admin-modal {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    animation: zoomIn 0.3s ease-out;
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default VerificationManagement;
