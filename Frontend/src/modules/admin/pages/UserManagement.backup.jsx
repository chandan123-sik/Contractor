import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Briefcase, HardHat, MessageSquare, Star, MapPin, Calendar, IndianRupee, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { userManagementAPI } from '../../../services/admin.api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', mobileNumber: '', gender: 'Male', city: '', state: '', isActive: true });

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userManagementAPI.getAllUsers({
                page: pagination.page,
                limit: pagination.limit
            });
            
            if (response.success) {
                setUsers(response.data.users);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.total,
                    totalPages: response.data.totalPages
                }));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Mock data for user actions (Lists of contractors and labours)
    const userActionData = {
        1: {
            contractors: [
                { id: 'C1', name: 'Krishna', city: 'Indore', work: 'Construction', phone: '5555555555', status: 'Open', color: '#facc15', date: '2024-02-09', time: '10:30 AM', reqType: 'HIRE', reqContext: 'Audio' },
                { id: 'C2', name: 'Sohan', city: 'Bhopal', work: 'Plumbing', phone: '9998887776', status: 'Unavailable', color: '#fb923c', date: '2024-02-08', time: '02:15 PM', reqType: 'INQUIRY', reqContext: 'Text' },
                { id: 'C3', name: 'Ramesh', city: 'Gwalior', work: 'Electrical', phone: '8887776665', status: 'Open', color: '#60a5fa', date: '2024-02-07', time: '11:45 AM', reqType: 'HIRE', reqContext: 'HIRE' }
            ],
            labours: [
                { id: 'L1', name: 'Chandan', trade: 'Plumber', city: 'Indore', phone: '9999999999', date: '2024-02-09', time: '09:00 AM', reqType: 'HIRE', reqContext: 'Audio' },
                { id: 'L2', name: 'Deepak', trade: 'Mason', city: 'Ujjain', phone: '7776665554', date: '2024-02-08', time: '04:20 PM', reqType: 'JOIN_TEAM', reqContext: 'Text' }
            ]
        },
        2: {
            contractors: [
                { id: 'C4', name: 'Amit', city: 'Indore', work: 'Painting', phone: '1112223334', status: 'Open', color: '#facc15', date: '2024-02-05', time: '01:00 PM', reqType: 'HIRE', reqContext: 'HIRE' }
            ],
            labours: [
                { id: 'L3', name: 'Priya', trade: 'Helper', city: 'Indore', phone: '4445556667', date: '2024-02-04', time: '10:15 AM', reqType: 'INQUIRY', reqContext: 'Audio' }
            ]
        },
        3: {
            contractors: [],
            labours: [
                { id: 'L4', name: 'Ravi', trade: 'Electrician', city: 'Indore', phone: '8889990001', date: '2024-02-01', time: '12:30 PM', reqType: 'HIRE', reqContext: 'Text' }
            ]
        }
    };

    // Mock data for feedbacks
    const userFeedbacks = {
        1: [
            { id: 1, rating: 5, comment: "Excellent service!", date: "2024-02-01" },
            { id: 2, rating: 4, comment: "Very professional approach.", date: "2024-01-25" }
        ],
        2: [
            { id: 3, rating: 3, comment: "Average experience.", date: "2024-01-20" }
        ],
        3: []
    };

    // New modal states
    const [actionModal, setActionModal] = useState({ type: null, userId: null });

    const openActionModal = (type, user) => setActionModal({ type, userId: user.id });
    const closeActionModal = () => setActionModal({ type: null, userId: null });

    const handleOpenModal = (user = null) => {
        setCurrentUser(user);
        setFormData(user ? { ...user } : { name: '', phone: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentUser) {
            setUsers(users.map(u => (u.id === currentUser.id ? { ...u, ...formData } : u)));
        } else {
            setUsers([...users, { id: Date.now(), ...formData }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="management-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>User Management</h2>
                <button className="crud-btn btn-add" onClick={() => handleOpenModal()}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Add User
                </button>
            </div>

            <div className="interaction-monitor">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>User Action</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.phone}</td>
                                <td>
                                    <span className={`status-badge ${user.status === 'Active' ? 'status-completed' : 'status-pending'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="action-icon-btn contractor" title="Contractor Action" onClick={() => openActionModal('contractor', user)}>
                                            <Briefcase size={18} />
                                        </button>
                                        <button className="action-icon-btn labour" title="Labour Action" onClick={() => openActionModal('labour', user)}>
                                            <HardHat size={18} />
                                        </button>
                                        <button className="action-icon-btn feedback" title="User Feedback" onClick={() => openActionModal('feedback', user)}>
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <button className="crud-btn btn-edit" onClick={() => handleOpenModal(user)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="crud-btn btn-delete" onClick={() => handleDelete(user.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal">
                        <div className="chat-header">
                            <span>{currentUser ? 'Edit User' : 'Add New User'}</span>
                            <X size={18} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Phone Number</label>
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Status</label>
                                <select
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <button type="submit" className="crud-btn btn-add" style={{ width: '100%', margin: 0 }}>
                                {currentUser ? 'Update User' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Contractor Action Modal */}
            {actionModal.type === 'contractor' && (
                <div className="modal-overlay">
                    <div className="admin-modal mobile-style-modal large-modal">
                        <div className="chat-header">
                            <span>Contractor Requests (Hire) - {users.find(u => u.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {userActionData[actionModal.userId]?.contractors?.length > 0 ? (
                                <table className="admin-table mini-table">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Profile</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Request Type</th>
                                            <th>Request Context</th>
                                            <th>Contractor Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userActionData[actionModal.userId].contractors.map((contractor, index) => (
                                            <tr key={contractor.id} className={contractor.status === 'Unavailable' ? 'row-unavailable' : ''}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="mini-avatar" style={{ background: contractor.color }}>{contractor.name[0]}</div>
                                                </td>
                                                <td>{contractor.name}</td>
                                                <td>{contractor.phone}</td>
                                                <td>{contractor.date}</td>
                                                <td>{contractor.time}</td>
                                                <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1' }}>{contractor.reqType}</span></td>
                                                <td><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{contractor.reqContext}</span></td>
                                                <td>
                                                    <button className="btn-status-badge" disabled={contractor.status === 'Unavailable'}>
                                                        {contractor.status === 'Unavailable' ? 'Unavailable' : 'User Requested Contractor'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">No contractor requests found for this user.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Labour Action Modal */}
            {actionModal.type === 'labour' && (
                <div className="modal-overlay">
                    <div className="admin-modal mobile-style-modal large-modal">
                        <div className="chat-header" style={{ background: '#f97316' }}>
                            <span>Labour Requests (Hire) - {users.find(u => u.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {userActionData[actionModal.userId]?.labours?.length > 0 ? (
                                <table className="admin-table mini-table">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Profile</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Request Type</th>
                                            <th>Request Context</th>
                                            <th>Labour Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userActionData[actionModal.userId].labours.map((labour, index) => (
                                            <tr key={labour.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="mini-avatar">{labour.name[0]}</div>
                                                </td>
                                                <td>{labour.name}</td>
                                                <td>{labour.phone}</td>
                                                <td>{labour.date}</td>
                                                <td>{labour.time}</td>
                                                <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316' }}>{labour.reqType}</span></td>
                                                <td><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{labour.reqContext}</span></td>
                                                <td>
                                                    <button className="btn-status-badge">User Requested Labour</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">No workers hired by this user yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Action Modal */}
            {actionModal.type === 'feedback' && (
                <div className="modal-overlay">
                    <div className="admin-modal mobile-style-modal large-modal">
                        <div className="chat-header" style={{ background: '#10b981' }}>
                            <span>All Feedback - {users.find(u => u.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {userFeedbacks[actionModal.userId]?.length > 0 ? (
                                <div className="feedback-list">
                                    {userFeedbacks[actionModal.userId].map((feedback) => (
                                        <div key={feedback.id} className="feedback-item-card">
                                            <div className="feedback-item-header">
                                                <div className="stars-mini">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            fill={i < feedback.rating ? "#facc15" : "none"}
                                                            color={i < feedback.rating ? "#facc15" : "#cbd5e1"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="feedback-date">{feedback.date}</span>
                                            </div>
                                            <p className="feedback-comment">{feedback.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">No feedback received for this user yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
          z-index: 2000;
        }
        .admin-modal {
          background: white;
          width: 400px;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .admin-modal.large-modal {
            width: 900px;
            max-height: 85vh;
        }
        .action-icon-btn {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .action-icon-btn.contractor { background: #eff6ff; color: #3b82f6; }
        .action-icon-btn.labour { background: #fff7ed; color: #f97316; }
        .action-icon-btn.feedback { background: #ecfdf5; color: #10b981; }
        .action-icon-btn:hover { transform: scale(1.1); filter: brightness(0.9); }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #94a3b8;
            font-style: italic;
        }

        /* Feedback Modal Styles */
        .feedback-modal { width: 320px; border-radius: 12px; padding: 16px; }
        .feedback-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .feedback-body { text-align: center; }
        .star-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; }
        .feedback-text-area {
            border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 24px; min-height: 120px;
            text-align: left;
        }
        .feedback-text-area textarea {
            width: 100%; border: none; outline: none; resize: none; font-size: 0.9rem; color: #64748b;
            background: transparent;
        }
        .btn-submit-feedback {
            width: 100%; padding: 12px; border-radius: 12px; background: #6366f1; color: white;
            border: none; font-weight: 600; cursor: pointer;
        }

        /* Mini Table Styles in Modal */
        .modal-list-container {
            padding: 10px;
            background: #fff;
            overflow-y: auto;
            overflow-x: auto;
            flex: 1;
        }
        .mini-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px;
            font-size: 0.85rem;
            min-width: 800px;
        }
        .mini-table th {
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #f1f5f9;
            color: #64748b;
        }
        .mini-table tr {
            background: #f8fafc;
            border-radius: 8px;
        }
        .mini-table td {
            padding: 12px 10px;
        }
        .mini-avatar {
            width: 32px;
            height: 32px;
            background: #facc15;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #1e293b;
            font-size: 0.8rem;
        }
        .btn-status-badge {
            background: #facc15;
            color: #1e293b;
            border: none;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
        }
        .row-unavailable {
            opacity: 0.6;
            filter: grayscale(0.5);
        }
        .row-unavailable .btn-status-badge {
            background: #e2e8f0;
            color: #94a3b8;
        }

        /* Feedback List Styles */
        .feedback-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 10px;
        }
        .feedback-item-card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 14px;
            border: 1px solid #f1f5f9;
        }
        .feedback-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .stars-mini {
            display: flex;
            gap: 2px;
        }
        .feedback-date {
            font-size: 0.75rem;
            color: #94a3b8;
        }
        .feedback-comment {
            font-size: 0.9rem;
            color: #475569;
            margin: 0;
            line-height: 1.4;
        }
      `}</style>
        </div>
    );
};

export default UserManagement;
