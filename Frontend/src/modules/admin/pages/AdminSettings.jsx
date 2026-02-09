import React, { useState, useEffect } from 'react';
import { Save, User, FileText, Mail, Phone, Lock, MapPin, Clock } from 'lucide-react';
import './AdminDashboard.css';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [adminProfile, setAdminProfile] = useState({
        name: 'Sagar Chauhan',
        email: 'admin@rajghar.com',
        phone: '+91 9876543210',
        role: 'Super Admin'
    });

    const [cmsContent, setCmsContent] = useState({
        aboutUs: {
            title: 'Welcome to Our Platform',
            description: 'This platform helps skilled labours find genuine work opportunities from verified users and contractors in their local area.',
            vision: 'Provide regular work opportunities and financial stability to skilled labours.',
            mission: 'Connect labours directly with users and contractors through a trusted digital platform.'
        },
        contactUs: {
            email: 'support@yourapp.com',
            phone: '+91 1800-123-4567',
            address: 'Indore, Madhya Pradesh, India - 452001',
            workingHours: 'Monday - Saturday: 9:00 AM - 6:00 PM'
        }
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem('adminProfile');
        if (savedProfile) setAdminProfile(JSON.parse(savedProfile));

        const savedCms = localStorage.getItem('cmsContent');
        if (savedCms) setCmsContent(JSON.parse(savedCms));
    }, []);

    const handleProfileSave = (e) => {
        e.preventDefault();
        localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
        alert('Profile updated successfully!');
    };

    const handleCmsSave = (e) => {
        e.preventDefault();
        localStorage.setItem('cmsContent', JSON.stringify(cmsContent));
        alert('Content updated successfully!');
    };

    return (
        <div className="admin-settings-container">
            <div className="admin-settings-header">
                <h2>Settings</h2>
                <div className="settings-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={18} /> Edit Profile
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'cms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cms')}
                    >
                        <FileText size={18} /> Manage Content
                    </button>
                </div>
            </div>

            <div className="settings-content">
                {activeTab === 'profile' ? (
                    <div className="settings-section">
                        <div className="section-info">
                            <h3>Admin Profile</h3>
                            <p>Update your personal information and contact details.</p>
                        </div>
                        <form className="settings-form" onSubmit={handleProfileSave}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <div className="input-with-icon">
                                        <User size={18} />
                                        <input
                                            type="text"
                                            value={adminProfile.name}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            value={adminProfile.email}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                                            placeholder="Enter email"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={18} />
                                        <input
                                            type="text"
                                            value={adminProfile.phone}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <div className="input-with-icon disabled">
                                        <Lock size={18} />
                                        <input type="text" value={adminProfile.role} disabled />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="save-btn">
                                <Save size={18} /> Save Profile Changes
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="settings-section">
                        <div className="section-info">
                            <h3>CMS Management</h3>
                            <p>Manage the content displayed on About Us and Contact Us pages.</p>
                        </div>
                        <form className="settings-form" onSubmit={handleCmsSave}>
                            <div className="cms-section">
                                <h4 className="cms-subtitle"><FileText size={18} /> About Us Page</h4>
                                <div className="form-group">
                                    <label>Welcome Title</label>
                                    <input
                                        type="text"
                                        value={cmsContent.aboutUs.title}
                                        onChange={(e) => setCmsContent({
                                            ...cmsContent,
                                            aboutUs: { ...cmsContent.aboutUs, title: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Introduction Description</label>
                                    <textarea
                                        rows="4"
                                        value={cmsContent.aboutUs.description}
                                        onChange={(e) => setCmsContent({
                                            ...cmsContent,
                                            aboutUs: { ...cmsContent.aboutUs, description: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Our Vision</label>
                                        <textarea
                                            rows="2"
                                            value={cmsContent.aboutUs.vision}
                                            onChange={(e) => setCmsContent({
                                                ...cmsContent,
                                                aboutUs: { ...cmsContent.aboutUs, vision: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Our Mission</label>
                                        <textarea
                                            rows="2"
                                            value={cmsContent.aboutUs.mission}
                                            onChange={(e) => setCmsContent({
                                                ...cmsContent,
                                                aboutUs: { ...cmsContent.aboutUs, mission: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="cms-section" style={{ marginTop: '40px' }}>
                                <h4 className="cms-subtitle"><Mail size={18} /> Contact Us Page</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Support Email</label>
                                        <div className="input-with-icon">
                                            <Mail size={16} />
                                            <input
                                                type="email"
                                                value={cmsContent.contactUs.email}
                                                onChange={(e) => setCmsContent({
                                                    ...cmsContent,
                                                    contactUs: { ...cmsContent.contactUs, email: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Helpline Number</label>
                                        <div className="input-with-icon">
                                            <Phone size={16} />
                                            <input
                                                type="text"
                                                value={cmsContent.contactUs.phone}
                                                onChange={(e) => setCmsContent({
                                                    ...cmsContent,
                                                    contactUs: { ...cmsContent.contactUs, phone: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Office Address</label>
                                        <div className="input-with-icon">
                                            <MapPin size={16} />
                                            <input
                                                type="text"
                                                value={cmsContent.contactUs.address}
                                                onChange={(e) => setCmsContent({
                                                    ...cmsContent,
                                                    contactUs: { ...cmsContent.contactUs, address: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Working Hours</label>
                                        <div className="input-with-icon">
                                            <Clock size={16} />
                                            <input
                                                type="text"
                                                value={cmsContent.contactUs.workingHours}
                                                onChange={(e) => setCmsContent({
                                                    ...cmsContent,
                                                    contactUs: { ...cmsContent.contactUs, workingHours: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="save-btn" style={{ marginTop: '20px' }}>
                                <Save size={18} /> Update Content
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
