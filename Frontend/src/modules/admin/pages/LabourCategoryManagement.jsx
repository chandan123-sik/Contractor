import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LabourCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Category Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');

    useEffect(() => {
        // Load categories from storage
        const storedCategories = localStorage.getItem('labourCategories');
        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        } else {
            // Default categories if storage is empty
            const defaultCategories = [
                { id: 1, name: 'Plumber', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966334.png' },
                { id: 2, name: 'Electrician', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png' },
                { id: 3, name: 'Mason', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966470.png' },
                { id: 4, name: 'Carpenter', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966442.png' },
                { id: 5, name: 'Painter', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966367.png' },
                { id: 6, name: 'Welder', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966453.png' },
                { id: 7, name: 'Daily Wager', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966497.png' }
            ];
            setCategories(defaultCategories);
            localStorage.setItem('labourCategories', JSON.stringify(defaultCategories));
        }
    }, []);

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) {
            toast.error('Category Name is required');
            return;
        }

        const newCategory = {
            id: Date.now(),
            name: newCategoryName,
            image: newCategoryImage || 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png' // Default image
        };

        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        localStorage.setItem('labourCategories', JSON.stringify(updatedCategories));

        // Reset form
        setNewCategoryName('');
        setNewCategoryImage('');
        setIsAddModalOpen(false);
        toast.success('Category added successfully');
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = categories.filter(cat => cat.id !== id);
            setCategories(updatedCategories);
            localStorage.setItem('labourCategories', JSON.stringify(updatedCategories));
            toast.success('Category deleted');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center hover:shadow-md transition-shadow relative group">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                            {category.image ? (
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                            ) : (
                                <Image size={32} className="text-gray-400" />
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>

                        <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Category"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

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
