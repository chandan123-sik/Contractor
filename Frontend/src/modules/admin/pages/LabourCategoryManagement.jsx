import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Save, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { labourCategoryAPI } from '../../../services/admin.api';

const LabourCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // New Category Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await labourCategoryAPI.getAll();
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setNewCategoryImage(base64String);
            setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category Name is required');
            return;
        }

        try {
            setUploading(true);
            
            console.log('📤 Uploading category:', {
                name: newCategoryName,
                hasImage: !!newCategoryImage,
                imageType: newCategoryImage ? (newCategoryImage.startsWith('data:') ? 'base64' : 'url') : 'none',
                imageSize: newCategoryImage ? `${(newCategoryImage.length / 1024).toFixed(2)} KB` : '0 KB'
            });

            const categoryData = {
                name: newCategoryName.trim(),
                image: newCategoryImage || undefined // Don't send empty string
            };

            console.log('🚀 Sending request to backend...');
            const response = await labourCategoryAPI.create(categoryData);
            
            console.log('✅ Category created:', response);
            
            toast.success('Category added successfully');
            
            // Reset form and refresh
            setNewCategoryName('');
            setNewCategoryImage('');
            setImagePreview('');
            setIsAddModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('❌ Error adding category:', error);
            console.error('Error response:', error.response);
            
            // Extract error message
            let errorMessage = 'Failed to add category';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Show specific error or generic message
            if (errorMessage.includes('already exists')) {
                toast.error('Category with this name already exists');
            } else if (errorMessage.includes('upload')) {
                toast.error('Image upload failed. Category created with default icon.');
                // Still refresh to show the category
                fetchCategories();
                setIsAddModalOpen(false);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await labourCategoryAPI.delete(id);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error(error.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setNewCategoryName('');
        setNewCategoryImage('');
        setImagePreview('');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Labour Categories</h1>
                    <p className="text-gray-500 text-sm">Manage types of labourers available in the system</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20">
                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No categories found. Add your first category!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div key={category._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center hover:shadow-md transition-shadow relative group">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                                {category.image ? (
                                    <img 
                                        src={category.image} 
                                        alt={category.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png';
                                        }}
                                    />
                                ) : (
                                    <ImageIcon size={32} className="text-gray-400" />
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg text-center">{category.name}</h3>

                            <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Category"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Category Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Tile Installer"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={newCategoryImage && !newCategoryImage.startsWith('data:') ? newCategoryImage : ''}
                                    onChange={(e) => {
                                        setNewCategoryImage(e.target.value);
                                        setImagePreview(e.target.value);
                                    }}
                                    placeholder="https://example.com/image.png"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none mb-2"
                                />
                                
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 border-t border-gray-300"></div>
                                    <span className="text-xs text-gray-500">OR</span>
                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>

                                <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                                    <Upload size={20} className="text-gray-400" />
                                    <span className="text-sm text-gray-600">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported: JPG, PNG, GIF</p>
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                                    <div className="flex justify-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAddCategory}
                                disabled={uploading}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Save Category</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabourCategoryManagement;
