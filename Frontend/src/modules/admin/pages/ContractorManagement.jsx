import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, Briefcase, HardHat, MessageSquare, Star, Users } from 'lucide-react';

const ContractorManagement = () => {
    const [contractors, setContractors] = useState([
        { id: 1, name: 'Sagar Chauhan', company: 'Appzeto Const.', phone: '9000000001', status: 'Active' },
        { id: 2, name: 'Amit Verma', company: 'Build-it Ltd', phone: '9000000002', status: 'Pending' },
        { id: 3, name: 'Rajesh Mehra', company: 'Urban Devs', phone: '9000000003', status: 'Active' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContractor, setCurrentContractor] = useState(null);
    const [formData, setFormData] = useState({ name: '', company: '', phone: '', status: 'Active' });

    // Mock data for contractor actions (Lists of users and labours requested by this contractor)
    const contractorActionData = {
        1: {
            users: [
                { id: 'U1', name: 'Rahul Sharma', phone: '9876543210', status: 'Active', date: '2024-02-10', time: '09:30 AM', reqType: 'HIRE', reqContext: 'Audio' }
            ],
            labours: [
                { id: 'L1', name: 'Chandan', trade: 'Plumber', city: 'Indore', phone: '9999999999', status: 'Active', date: '2024-02-10', time: '11:15 AM', reqType: 'HIRE', reqContext: 'Text' }
            ]
        },
        2: { users: [], labours: [] },
        3: { users: [], labours: [] }
    };

    // Mock data for feedbacks
    const contractorFeedbacks = {
        1: [
            { id: 1, rating: 5, comment: "High quality construction work.", date: "2024-02-10" },
            { id: 2, rating: 4, comment: "Completed the project on time.", date: "2024-01-28" }
        ],
        2: [
            { id: 3, rating: 3, comment: "Communication could be better.", date: "2024-01-15" }
        ],
        3: []
    };

    // New modal states
    const [actionModal, setActionModal] = useState({ type: null, userId: null });

    const openActionModal = (type, contractor) => setActionModal({ type, userId: contractor.id });
    const closeActionModal = () => setActionModal({ type: null, userId: null });

    const handleOpenModal = (contractor = null) => {
        setCurrentContractor(contractor);
        setFormData(contractor ? { ...contractor } : { name: '', company: '', phone: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this contractor?')) {
            setContractors(contractors.filter(c => c.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentContractor) {
            setContractors(contractors.map(c => (c.id === currentContractor.id ? { ...c, ...formData } : c)));
        } else {
            setContractors([...contractors, { id: Date.now(), ...formData }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="management-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Briefcase color="#3b82f6" /> Contractor Management</h2>
                <button className="crud-btn btn-add" onClick={() => handleOpenModal()}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Add Contractor
                </button>
            </div>

            <div className="interaction-monitor">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Contractor Action</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contractors.map(contractor => (
                            <tr key={contractor.id}>
                                <td>{contractor.id}</td>
                                <td>{contractor.name}</td>
                                <td>{contractor.company}</td>
                                <td>{contractor.phone}</td>
                                <td>
                                    <span className={`status-badge ${contractor.status === 'Active' ? 'status-completed' : 'status-pending'}`}>
                                        {contractor.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="action-icon-btn user" title="User Action" onClick={() => openActionModal('user', contractor)}>
                                            <Users size={18} />
                                        </button>
                                        <button className="action-icon-btn labour" title="Labour Action" onClick={() => openActionModal('labour', contractor)}>
                                            <HardHat size={18} />
                                        </button>
                                        <button className="action-icon-btn feedback" title="User Feedback" onClick={() => openActionModal('feedback', contractor)}>
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <button className="crud-btn btn-edit" onClick={() => handleOpenModal(contractor)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="crud-btn btn-delete" onClick={() => handleDelete(contractor.id)}>
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
                        <div className="chat-header" style={{ background: '#3b82f6' }}>
                            <span>{currentContractor ? 'Edit Contractor' : 'Add New Contractor'}</span>
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
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Company Name</label>
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <button type="submit" className="crud-btn btn-add" style={{ width: '100%', margin: 0, background: '#3b82f6' }}>
                                {currentContractor ? 'Update Contractor' : 'Create Contractor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* User Action Modal */}
            {actionModal.type === 'user' && (
                <div className="modal-overlay">
                    <div className="admin-modal mobile-style-modal large-modal">
                        <div className="chat-header" style={{ background: '#3b82f6' }}>
                            <span>User Requests - {contractors.find(c => c.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {contractorActionData[actionModal.userId]?.users?.length > 0 ? (
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
                                        {contractorActionData[actionModal.userId].users.map((u, index) => (
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
                                                    <button className="btn-status-badge" style={{ background: '#3b82f6', color: 'white' }}>Contractor Requested User</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">No user requests found for this contractor.</div>
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
                            <span>Labour Requests (Hire) - {contractors.find(c => c.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {contractorActionData[actionModal.userId]?.labours?.length > 0 ? (
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
                                        {contractorActionData[actionModal.userId].labours.map((lab, index) => (
                                            <tr key={lab.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="mini-avatar">{lab.name[0]}</div>
                                                </td>
                                                <td>{lab.name}</td>
                                                <td>{lab.phone}</td>
                                                <td>{lab.date}</td>
                                                <td>{lab.time}</td>
                                                <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316' }}>{lab.reqType}</span></td>
                                                <td><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lab.reqContext}</span></td>
                                                <td>
                                                    <button className="btn-status-badge">Contractor Requested Labour</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">No workers requested by this contractor yet.</div>
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
                            <span>All Feedback - {contractors.find(c => c.id === actionModal.userId)?.name}</span>
                            <X size={18} onClick={closeActionModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-list-container">
                            {contractorFeedbacks[actionModal.userId]?.length > 0 ? (
                                <div className="feedback-list">
                                    {contractorFeedbacks[actionModal.userId].map((feedback) => (
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
                                <div className="empty-state">No feedback received for this contractor yet.</div>
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

export default ContractorManagement;
