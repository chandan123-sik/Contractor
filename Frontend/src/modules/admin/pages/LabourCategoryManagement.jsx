import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { labourCategoryAPI } from '../../../services/admin.api';

const LabourCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // New Category Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');

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

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category Name is required');
            return;
        }

        try {
            const categoryData = {
                name: newCategoryName,
                icon: newCategoryImage || 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png'
            };

            await labourCategoryAPI.create(categoryData);
            toast.success('Category added successfully');
            
            // Reset form and refresh
            setNewCategoryName('');
            setNewCategoryImage('');
            setIsAddModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(error.response?.data?.message || 'Failed to add category');
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
                    <Image size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No categories found. Add your first category!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div key={category._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center hover:shadow-md transition-shadow relative group">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                                {category.icon ? (
                                    <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Image size={32} className="text-gray-400" />
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>

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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Tile Installer"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategoryImage}
                                        onChange={(e) => setNewCategoryImage(e.target.value)}
                                        placeholder="https://example.com/image.png"
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Leave empty for default icon</p>
                            </div>

                            <button
                                onClick={handleAddCategory}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                <span>Save Category</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabourCategoryManagement;
