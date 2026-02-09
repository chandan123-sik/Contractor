import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, HardHat } from 'lucide-react';

const LabourManagement = () => {
    const [labours, setLabours] = useState([
        { id: 1, name: 'Vikram Singh', phone: '9988776655', trade: 'Mason', status: 'Active' },
        { id: 2, name: 'Sunil Dutt', phone: '8877665544', trade: 'Electrician', status: 'Verified' },
        { id: 3, name: 'Pappu Lal', phone: '7766554433', trade: 'Plumber', status: 'Active' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLabour, setCurrentLabour] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', trade: '', status: 'Active' });

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
        }
      `}</style>
        </div>
    );
};

export default LabourManagement;
