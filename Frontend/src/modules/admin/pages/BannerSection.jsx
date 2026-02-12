import React, { useState } from 'react';
import { Image, Plus, Save } from 'lucide-react';
import './AdminDashboard.css';

const BannerSection = () => {
    const [formData, setFormData] = useState({
        badgeText: '',
        title: '',
        subtitle: '',
        description: '',
        price: '',
        priceUnit: '',
        discount: '',
        backgroundImage: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Banner Data:', formData);
        alert('Banner preview updated! This is frontend only - no backend changes.');
    };

    return (
        <div className="broadcast-management-container">
            {/* Page Header */}
            <div className="broadcast-page-header">
                <div className="header-content">
                    <h2 className="page-title">Banner Section</h2>
                    <p className="page-subtitle">Create and manage promotional banners for user home page</p>
                </div>
                <button 
                    className="create-broadcast-btn"
                    onClick={() => alert('Upload Banner feature coming soon!')}
                >
                    <Plus size={20} />
                    Upload Banner
                </button>
            </div>

            {/* Banner Form */}
            <div className="settings-content">
                <div className="settings-section">
                    <div className="section-info" style={{ marginBottom: '24px' }}>
                        <h3>Add New Banner</h3>
                        <p>Fill in the details below to create a promotional banner</p>
                    </div>

                    <form onSubmit={handleSubmit} className="settings-form">
                        {/* Badge Text (Offer Type) */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Badge Text (Offer Type) <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        name="badgeText"
                                        value={formData.badgeText}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 🔥 Limited Time Offer"
                                        required
                                    />
                                </div>
                                <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                    Example: "🔥 Limited Time Offer", "⚡ Best Quality"
                                </small>
                            </div>

                            {/* Background Image URL */}
                            <div className="form-group">
                                <label>Background Image URL <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <Image size={18} />
                                    <input
                                        type="url"
                                        name="backgroundImage"
                                        value={formData.backgroundImage}
                                        onChange={handleInputChange}
                                        placeholder="https://images.unsplash.com/..."
                                        required
                                    />
                                </div>
                                <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                    Use high-quality construction material images
                                </small>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label>Banner Title <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Build Strong Foundations"
                                    required
                                />
                            </div>
                        </div>

                        {/* Subtitle */}
                        <div className="form-group">
                            <label>Subtitle <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Premium Quality Cement"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Description <span className="required">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="e.g., High-grade cement for all construction needs"
                                rows="3"
                                required
                            />
                        </div>

                        {/* Price and Unit */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Price <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g., ₹350"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Price Unit <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        name="priceUnit"
                                        value={formData.priceUnit}
                                        onChange={handleInputChange}
                                        placeholder="e.g., per bag, per kg"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Discount Offer */}
                        <div className="form-group">
                            <label>Discount/Offer Text <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Up to 20% Off"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button type="submit" className="save-btn">
                                <Save size={20} />
                                Update Preview
                            </button>
                            <button 
                                type="button" 
                                className="save-btn" 
                                style={{ background: '#6b7280' }}
                                onClick={() => setFormData({
                                    badgeText: '',
                                    title: '',
                                    subtitle: '',
                                    description: '',
                                    price: '',
                                    priceUnit: '',
                                    discount: '',
                                    backgroundImage: ''
                                })}
                            >
                                Reset Form
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Live Preview Section */}
            <div className="settings-content" style={{ marginTop: '24px' }}>
                <div className="settings-section">
                    <div className="section-info" style={{ marginBottom: '24px' }}>
                        <h3>Live Banner Preview</h3>
                        <p>Real-time preview of how your banner will look on the frontend</p>
                    </div>

                    <div style={{ 
                        background: '#f3f4f6', 
                        padding: '24px', 
                        borderRadius: '16px',
                        minHeight: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {formData.title ? (
                            <div style={{
                                background: formData.backgroundImage ? `url(${formData.backgroundImage})` : '#1f2937',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '16px',
                                padding: '32px',
                                color: 'white',
                                width: '100%',
                                minHeight: '250px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Dark Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.6))'
                                }}></div>
                                
                                {/* Content */}
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {/* Badge */}
                                    {formData.badgeText && (
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '12px',
                                            animation: 'pulse 2s infinite'
                                        }}>
                                            {formData.badgeText}
                                        </div>
                                    )}
                                    
                                    {/* Title */}
                                    <h2 style={{ 
                                        fontSize: '32px', 
                                        fontWeight: 'bold', 
                                        margin: '0 0 8px 0',
                                        lineHeight: '1.2'
                                    }}>
                                        {formData.title}
                                    </h2>
                                    
                                    {/* Subtitle */}
                                    <p style={{ 
                                        color: '#fbbf24', 
                                        fontSize: '18px', 
                                        fontWeight: '600', 
                                        margin: '0 0 8px 0' 
                                    }}>
                                        {formData.subtitle}
                                    </p>
                                    
                                    {/* Description */}
                                    <p style={{ 
                                        color: '#d1d5db', 
                                        fontSize: '14px', 
                                        margin: '0 0 16px 0',
                                        maxWidth: '600px'
                                    }}>
                                        {formData.description}
                                    </p>
                                    
                                    {/* Price */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'baseline', 
                                        gap: '8px', 
                                        marginBottom: '12px' 
                                    }}>
                                        <span style={{ 
                                            fontSize: '40px', 
                                            fontWeight: 'bold', 
                                            color: '#fbbf24' 
                                        }}>
                                            {formData.price.startsWith('₹') ? formData.price : `₹${formData.price}`}
                                        </span>
                                        <span style={{ fontSize: '16px', color: 'white' }}>
                                            {formData.priceUnit}
                                        </span>
                                    </div>
                                    
                                    {/* Discount Badge */}
                                    {formData.discount && (
                                        <div style={{
                                            display: 'inline-block',
                                            background: '#fbbf24',
                                            color: '#111827',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginBottom: '16px'
                                        }}>
                                            {formData.discount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Image size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: '#9ca3af', fontSize: '16px', margin: 0 }}>
                                    Fill the form above to see live banner preview
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerSection;
