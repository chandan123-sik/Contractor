import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';
import PromotionalBanner from '../../../components/shared/PromotionalBanner';
import { categoryAPI } from '../../../services/api';

const UserHome = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Fetch categories from backend
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryAPI.getAll();
            if (response.data.success) {
                setCategories(response.data.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to default categories if API fails
            setCategories([
                { _id: 'fallback-1', name: 'Electrician', icon: '👷' },
                { _id: 'fallback-2', name: 'Plumber', icon: '🔧' },
                { _id: 'fallback-3', name: 'Carpenter', icon: '🪚' },
                { _id: 'fallback-4', name: 'Painter', icon: '🎨' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Filter categories based on search query
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Show limited or all categories
    const displayedCategories = showAllCategories ? filteredCategories : filteredCategories.slice(0, 8);

    const handleCategoryClick = (categoryName) => {
        navigate('/user/hire-workers', { state: { selectedCategory: categoryName } });
    };

    const handleSeeAllClick = () => {
        setShowAllCategories(!showAllCategories);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <UserHeader />

            {/* Search Bar */}
            <div className="bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Find categories"
                        className="flex-1 bg-transparent text-gray-600 outline-none placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Promotional Banners */}
            <PromotionalBanner />

            {/* Categories Section */}
            <div className="px-4 mt-2 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No categories found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {displayedCategories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => handleCategoryClick(category.name)}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                                    {category.icon ? (
                                        category.icon.startsWith('http') ? (
                                            <img src={category.icon} alt={category.name} className="w-8 h-8 object-contain" />
                                        ) : (
                                            <span>{category.icon}</span>
                                        )
                                    ) : (
                                        <span>🔧</span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <UserBottomNav />
        </div>
    );
};

export default UserHome;
