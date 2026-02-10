import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorHeader from '../components/ContractorHeader';

const ContractorHome = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 1, name: 'Electrician', icon: '👷', color: 'bg-gray-100' },
        { id: 2, name: 'Plumber', icon: '🔧', color: 'bg-pink-100' },
        { id: 3, name: 'Carpenter', icon: '🪚', color: 'bg-yellow-100' },
        { id: 4, name: 'Painter', icon: '🎨', color: 'bg-blue-100' },
        { id: 5, name: 'Mechanic', icon: '🔩', color: 'bg-purple-100' },
        { id: 6, name: 'Electronics Repair', icon: '📱', color: 'bg-green-100' },
        { id: 7, name: 'Room Shifting', icon: '📦', color: 'bg-orange-100' },
        { id: 8, name: 'Welder', icon: '👨‍🏭', color: 'bg-indigo-100' },
        { id: 9, name: 'News Paper Ads', icon: '📰', color: 'bg-gray-100' },
        { id: 10, name: 'Cleaner', icon: '🧹', color: 'bg-blue-100' },
        { id: 11, name: "Women's Parlour", icon: '💇‍♀️', color: 'bg-pink-100' },
        { id: 12, name: 'Mistri', icon: '🔨', color: 'bg-green-100' }
    ];

    // Filter categories based on search query
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategoryClick = (categoryName) => {
        navigate('/contractor/hire-workers', { state: { selectedCategory: categoryName } });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <ContractorHeader />

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

            {/* Categories Section */}
            <div className="px-4 mt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                    <button className="text-sm text-blue-500 font-medium hover:text-blue-600">
                        See All
                    </button>
                </div>

                {filteredCategories.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No categories found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {filteredCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.name)}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center text-2xl`}>
                                    {category.icon}
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
            <ContractorBottomNav />
        </div>
    );
};

export default ContractorHome;
