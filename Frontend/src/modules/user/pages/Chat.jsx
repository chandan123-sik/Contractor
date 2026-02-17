import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Dummy chat contacts
    const [contacts] = useState([
        {
            id: 1,
            name: 'Rajesh Kumar',
            lastMessage: 'Thanks for the help!',
            time: 'Online',
            online: true,
            unread: 0
        },
        {
            id: 2,
            name: 'Amit Singh',
            lastMessage: 'When can you start?',
            time: 'Online',
            online: true,
            unread: 2
        },
        {
            id: 3,
            name: 'Priya Sharma',
            lastMessage: 'Payment completed',
            time: 'Last seen 5 minutes ago',
            online: false,
            unread: 0
        },
        {
            id: 4,
            name: 'Vikram Patel',
            lastMessage: 'Job is done',
            time: 'Last seen 10 minutes ago',
            online: false,
            unread: 1
        },
        {
            id: 5,
            name: 'Support Team',
            lastMessage: 'How can we help?',
            time: 'Last seen 1 hour ago',
            online: false,
            unread: 0
        }
    ]);

    // Get color based on name
    const getAvatarColor = (name) => {
        const colors = [
            'from-blue-400 to-blue-600',
            'from-green-400 to-green-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-orange-400 to-orange-600',
            'from-teal-400 to-teal-600'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Get initials from name
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Filter contacts based on search
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/user/settings')} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
                </div>

                {/* Search Bar */}
                <div className="px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Contact List */}
            <div className="pb-20">
                {filteredContacts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No contacts found
                    </div>
                ) : (
                    filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => navigate(`/user/chat/${contact.id}`, { state: { contact } })}
                            className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarColor(contact.name)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                    {getInitials(contact.name)}
                                </div>
                                {contact.online && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-gray-800 truncate">{contact.name}</h3>
                                    {contact.unread > 0 && (
                                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{contact.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Chat;
