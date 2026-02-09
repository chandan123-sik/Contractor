import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, Briefcase } from 'lucide-react';

const ContractorManagement = () => {
    const [contractors, setContractors] = useState([
        { id: 1, name: 'Sagar Chauhan', company: 'Appzeto Const.', phone: '9000000001', status: 'Active' },
        { id: 2, name: 'Amit Verma', company: 'Build-it Ltd', phone: '9000000002', status: 'Pending' },
        { id: 3, name: 'Rajesh Mehra', company: 'Urban Devs', phone: '9000000003', status: 'Active' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContractor, setCurrentContractor] = useState(null);
    const [formData, setFormData] = useState({ name: '', company: '', phone: '', status: 'Active' });

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

export default ContractorManagement;
