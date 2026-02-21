import React, { useState, useEffect } from 'react';
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
import toast from 'react-hot-toast';
import { verificationAPI } from '../../../services/admin.api';
import './AdminDashboard.css';

const VerificationManagement = () => {
    const [activeCategory, setActiveCategory] = useState('labour');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVerificationRequests();
    }, [activeCategory]);

    const fetchVerificationRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            
            if (!token) {
                toast.error('Please login as admin');
                setLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`}/admin/verification/requests?category=${activeCategory}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setVerificationRequests(data.data.requests || []);
            } else {
                toast.error(data.message || 'Failed to load requests');
            }
        } catch (error) {
            console.error('Error fetching verification requests:', error);
            toast.error('Failed to load verification requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('adminToken');
            
            const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`}/admin/verification/requests/${id}/${action}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reason: action === 'reject' ? 'Documents not valid' : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Request ${action}d successfully`);
                fetchVerificationRequests();
                if (selectedRequest && selectedRequest._id === id) {
                    setIsModalOpen(false);
                    setSelectedRequest(null);
                }
            } else {
                toast.error(data.message || `Failed to ${action} request`);
            }
        } catch (error) {
            console.error('Error updating verification:', error);
            toast.error(`Failed to ${action} request`);
        }
    };

    const openDetails = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    const filteredRequests = verificationRequests.filter(req => {
        const searchLower = searchTerm.toLowerCase();
        return (
            req.name?.toLowerCase().includes(searchLower) ||
            req.phone?.toLowerCase().includes(searchLower) ||
            req.aadhaarNumber?.toLowerCase().includes(searchLower) ||
            req.requestId?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="management-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck color="#f97316" size={28} />
                    Verification Management
                </h2>
                <div className="admin-search-bar" style={{ width: '250px' }}>
                    <Search size={18} color="#6b7280" />
                    <input 
                        type="text" 
                        placeholder="Search requests..." 
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                    onClick={() => setActiveCategory('user')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeCategory === 'user' ? 'white' : 'transparent',
                        color: activeCategory === 'user' ? '#1a233a' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeCategory === 'user' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <User size={18} /> Users
                </button>
                <button
                    onClick={() => setActiveCategory('labour')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeCategory === 'labour' ? 'white' : 'transparent',
                        color: activeCategory === 'labour' ? '#1a233a' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeCategory === 'labour' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <HardHat size={18} /> Labours
                </button>
                <button
                    onClick={() => setActiveCategory('contractor')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeCategory === 'contractor' ? 'white' : 'transparent',
                        color: activeCategory === 'contractor' ? '#1a233a' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeCategory === 'contractor' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <Briefcase size={18} /> Contractors
                </button>
            </div>

            {/* Verification Table */}
            <div className="interaction-monitor">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No verification requests found</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Trade</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req._id}>
                                    <td style={{ fontWeight: 600, color: '#f97316' }}>{req.requestId || req._id.slice(-8).toUpperCase()}</td>
                                    <td>{req.name || 'N/A'}</td>
                                    <td>{req.phone || 'N/A'}</td>
                                    <td>{req.trade || activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${
                                            req.status === 'Approved' ? 'status-completed' :
                                            req.status === 'Rejected' ? 'status-pending' : ''
                                        }`} style={{
                                            background: req.status === 'Rejected' ? '#fee2e2' : 
                                                       req.status === 'Pending' ? '#fef3c7' : '',
                                            color: req.status === 'Rejected' ? '#b91c1c' : 
                                                  req.status === 'Pending' ? '#92400e' : ''
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
                                                        onClick={() => handleAction(req._id, 'approve')}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button
                                                        className="crud-btn"
                                                        style={{ background: '#fee2e2', color: '#b91c1c' }}
                                                        onClick={() => handleAction(req._id, 'reject')}
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
                )}
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
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{selectedRequest.name || 'N/A'}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{selectedRequest.requestId || selectedRequest._id.slice(-8).toUpperCase()} | {selectedRequest.phone || 'N/A'}</p>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span className={`status-badge ${
                                        selectedRequest.status === 'Approved' ? 'status-completed' :
                                        selectedRequest.status === 'Rejected' ? 'status-pending' : ''
                                    }`} style={{
                                        background: selectedRequest.status === 'Rejected' ? '#fee2e2' : 
                                                   selectedRequest.status === 'Pending' ? '#fef3c7' : '',
                                        color: selectedRequest.status === 'Rejected' ? '#b91c1c' : 
                                              selectedRequest.status === 'Pending' ? '#92400e' : ''
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
                                    <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{selectedRequest.aadhaarNumber}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Uploaded Document Photos</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{
                                        aspectRatio: '16/10', background: '#1e293b', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid #334155', overflow: 'hidden', position: 'relative'
                                    }}>
                                        {selectedRequest.aadhaarFrontUrl ? (
                                            <img src={selectedRequest.aadhaarFrontUrl} alt="Aadhaar Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'white' }}>
                                                <FileText size={32} />
                                                <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>Aadhaar Front {selectedRequest.requestId}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        aspectRatio: '16/10', background: '#1e293b', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid #334155', overflow: 'hidden', position: 'relative'
                                    }}>
                                        {selectedRequest.aadhaarBackUrl ? (
                                            <img src={selectedRequest.aadhaarBackUrl} alt="Aadhaar Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'white' }}>
                                                <FileText size={32} />
                                                <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>Aadhaar Back {selectedRequest.requestId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.status === 'Pending' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button
                                        onClick={() => handleAction(selectedRequest._id, 'approve')}
                                        className="crud-btn btn-add" style={{ margin: 0, background: '#10b981' }}>
                                        Approve Verification
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedRequest._id, 'reject')}
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
