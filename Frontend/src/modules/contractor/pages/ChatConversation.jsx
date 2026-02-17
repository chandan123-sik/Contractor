import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, MoreVertical, Trash2, Ban } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const ChatConversation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    
    const contact = location.state?.contact || { name: 'User', avatar: '👤', online: false };
    
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi, I need help with construction work", sender: 'other', time: '08:00' },
        { id: 2, text: "Sure! I can help you. What kind of work do you need?", sender: 'user', time: '08:12' },
        { id: 3, text: "I need a carpenter for furniture work", sender: 'other', time: '08:14' }
    ]);

    const emojis = [
        '😊', '😂', '🤣', '😍', '😘', '😎', '🥰', '😇', '🤗', '🤔',
        '😢', '😭', '😡', '🤬', '😱', '😨', '🥺', '😳', '🙄', '😴',
        '❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤',
        '👍', '👎', '👏', '🙏', '💪', '👌', '✌️', '🤝', '👋', '🤚',
        '👷', '🔧', '🔨', '🪚', '🏗️', '🏠', '🚧', '⚠️', '✅', '❌',
        '🎉', '🎊', '🔥', '💯', '⭐', '✨', '💫', '🌟', '☀️', '🌙',
        '📞', '📱', '💼', '📋', '📝', '💰', '💵', '💳', '🏆', '🎯'
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        const handleScroll = () => showMenu && setShowMenu(false);
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [showMenu]);

    const handleSendMessage = useCallback(() => {
        if (message.trim()) {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: message,
                sender: 'user',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            }]);
            setMessage('');
            setShowEmojiPicker(false);
        }
    }, [message]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
            <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate('/contractor/chat')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xl shadow-md">
                    {contact.avatar}
                </div>
                <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">{contact.name}</h2>
                    <p className={`text-xs ${contact.online ? 'text-green-600' : 'text-gray-500'}`}>
                        {contact.online ? 'Online' : 'Offline'}
                    </p>
                </div>
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-700" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                            <button onClick={() => { if (window.confirm('Clear chat?')) { setMessages([]); setShowMenu(false); }}} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700">
                                <Trash2 className="w-4 h-4" />
                                <span>Clear Chat</span>
                            </button>
                            <button onClick={() => { if (window.confirm(`Block ${contact.name}?`)) { setShowMenu(false); navigate('/contractor/chat'); }}} className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600">
                                <Ban className="w-4 h-4" />
                                <span>Block</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No messages yet</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md'}`}>
                                <p className="text-sm break-words">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {showEmojiPicker && (
                <div className="bg-white border-t border-gray-200 p-3">
                    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                        {emojis.map((emoji, i) => (
                            <button key={i} onClick={() => setMessage(prev => prev + emoji)} className="text-2xl hover:bg-gray-100 rounded p-2 transition-colors flex-shrink-0">
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files[0] && setMessages(prev => [...prev, { id: prev.length + 1, text: '📎 Image sent', sender: 'user', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), isFile: true }])} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-xl">😊</button>
                    <button onClick={handleSendMessage} disabled={!message.trim()} className={`p-3 rounded-full transition-all shadow-md ${message.trim() ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatConversation;
