import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, HardHat, Briefcase, MessageSquare, Star, Users } from 'lucide-react';

const LabourManagement = () => {
    const [labours, setLabours] = useState([
        { id: 1, name: 'Vikram Singh', phone: '9988776655', trade: 'Mason', status: 'Active' },
        { id: 2, name: 'Sunil Dutt', phone: '8877665544', trade: 'Electrician', status: 'Verified' },
        { id: 3, name: 'Pappu Lal', phone: '7766554433', trade: 'Plumber', status: 'Active' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLabour, setCurrentLabour] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', trade: '', status: 'Active' });

    // Mock data for labour actions (Lists of contractors and users requested by this worker)
    const labourActionData = {
        1: {
            contractors: [
                { id: 'C1', name: 'Krishna', city: 'Indore', work: 'Construction', phone: '5555555555', status: 'Open', color: '#facc15', date: '2024-02-09', time: '11:00 AM', reqType: 'JOIN_TEAM', reqContext: 'Audio' },
                { id: 'C2', name: 'Sohan', city: 'Bhopal', work: 'Plumbing', phone: '9998887776', status: 'Unavailable', color: '#fb923c', date: '2024-02-08', time: '01:45 PM', reqType: 'INQUIRY', reqContext: 'Text' }
            ],
            users: [
                { id: 'U1', name: 'Rahul Sharma', phone: '9876543210', status: 'Active', date: '2024-02-09', time: '10:00 AM', reqType: 'HIRE', reqContext: 'Audio' }
            ]
        },
        2: { contractors: [], users: [] },
        3: {
            contractors: [
                { id: 'C3', name: 'Ramesh', city: 'Gwalior', work: 'Electrical', phone: '8887776665', status: 'Open', color: '#60a5fa', date: '2024-02-05', time: '03:15 PM', reqType: 'HIRE', reqContext: 'HIRE' }
            ],
            users: []
        }
    };

    // Mock data for feedbacks
    const labourFeedbacks = {
        1: [
            { id: 1, rating: 5, comment: "Hardworking and punctual.", date: "2024-02-05" },
            { id: 2, rating: 5, comment: "Very skilled mason.", date: "2024-01-20" }
        ],
        2: [
            { id: 3, rating: 4, comment: "Did a great job with the wiring.", date: "2024-02-01" }
        ],
        3: []
    };

    // New modal states
    const [actionModal, setActionModal] = useState({ type: null, userId: null });

    const openActionModal = (type, labour) => setActionModal({ type, userId: labour.id });
    const closeActionModal = () => setActionModal({ type: null, userId: null });

    const handleOpenModal = (labour = null) => {
        setCurrentLabour(labour);
        setFormData(labour ? { ...labour } : { name: '', phone: '', trade: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this labour record?')) {
            setLabours(labours.filter(l => l.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentLabour) {
            setLabours(labours.map(l => (l.id === currentLabour.id ? { ...l, ...formData } : l)));
        } else {
            setLabours([...labours, { id: Date.now(), ...formData }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="management-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><HardHat color="#f97316" /> Labour Management</h2>
                <button className="crud-btn btn-add" onClick={() => handleOpenModal()}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Add Labour
                </button>
            </div>

            <div className="interaction-monitor">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Trade</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Labour Action</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labours.map(labour => (
                            <tr key={labour.id}>
                                <td>{labour.id}</td>
                                <td>{labour.name}</td>
                                <td>{labour.trade}</td>
                                <td>{labour.phone}</td>
                                <td>
                                    <span className={`status-badge ${labour.status === 'Verified' ? 'status-completed' : 'status-pending'}`}>
                                        {labour.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="action-icon-btn user" title="User Action" onClick={() => openActionModal('user', labour)}>
                                            <Users size={18} />
                                        </button>
                                        <button className="action-icon-btn contractor" title="Contractor Action" onClick={() => openActionModal('contractor', labour)}>
                                            <Briefcase size={18} />
                                        </button>
                                        <button className="action-icon-btn feedback" title="User Feedback" onClick={() => openActionModal('feedback', labour)}>
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <button className="crud-btn btn-edit" onClick={() => handleOpenModal(labour)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="crud-btn btn-delete" onClick={() => handleDelete(labour.id)}>
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
                        <div className="chat-header" style={{ background: '#f97316' }}>
                            <span>{currentLabour ? 'Edit Labour' : 'Add New Labour'}</span>
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
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Trade/Skill</label>
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
                                    value={formData.trade}
                                    placeholder="e.g. Mason, Plumber"
                                    onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
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
                                    <option value="Verified">Verified</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <button type="submit" className="crud-btn btn-add" style={{ width: '100%', margin: 0 }}>
                                {currentLabour ? 'Update Labour' : 'Create Labour'}
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
                            <span>Contractor Requests (Hire) - {labours.find(l => l.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {labourActionData[actionModal.userId]?.contractors?.length > 0 ? (
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
                                        {labourActionData[actionModal.userId].contractors.map((contractor, index) => (
                                            <tr key={contractor.id} className={contractor.status === 'Unavailable' ? 'row-unavailable' : ''}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="mini-avatar" style={{ background: contractor.color }}>{contractor.name[0]}</div>
                                                </td>
                                                <td>{contractor.name}</td>
                                                <td>{contractor.phone}</td>
                                                <td>{contractor.date}</td>
                                                <td>{contractor.time}</td>
                                                <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316' }}>{contractor.reqType}</span></td>
                                                <td><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{contractor.reqContext}</span></td>
                                                <td>
                                                    <button className="btn-status-badge" disabled={contractor.status === 'Unavailable'}>
                                                        {contractor.status === 'Unavailable' ? 'Unavailable' : 'Labour Requested Contractor'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">No contractor requests found for this worker.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* User Action Modal */}
            {actionModal.type === 'user' && (
                <div className="modal-overlay">
                    <div className="admin-modal mobile-style-modal large-modal">
                        <div className="chat-header" style={{ background: '#3b82f6' }}>
                            <span>User Requests - {labours.find(l => l.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {labourActionData[actionModal.userId]?.users?.length > 0 ? (
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
                                        {labourActionData[actionModal.userId].users.map((u, index) => (
                                            <tr key={u.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="mini-avatar" style={{ background: '#3b82f6', color: 'white' }}>{u.name[0]}</div>
                                                </td>
                                                <td>{u.name}</td>
                                                <td>{u.phone}</td>
                                                <td>{u.date}</td>
                                                <td>{u.time}</td>
                                                <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6' }}>{u.reqType}</span></td>
                                                <td><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.reqContext}</span></td>
                                                <td>
                                                    <button className="btn-status-badge" style={{ background: '#3b82f6', color: 'white' }}>Labour Requested User</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">No user requests found for this worker.</div>
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
                            <span>All Feedback - {labours.find(l => l.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {labourFeedbacks[actionModal.userId]?.length > 0 ? (
                                <div className="feedback-list">
                                    {labourFeedbacks[actionModal.userId].map((feedback) => (
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
                                <div className="empty-state">No feedback received for this worker yet.</div>
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
        .action-icon-btn.user { background: #f0f9ff; color: #0369a1; }
        .action-icon-btn.labour { background: #fff7ed; color: #f97316; }
        .action-icon-btn.feedback { background: #ecfdf5; color: #10b981; }
        .action-icon-btn:hover { transform: scale(1.1); filter: brightness(0.9); }
 
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #94a3b8;
            font-style: italic;
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

export default LabourManagement;
