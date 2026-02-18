import { MapPin, Star, Phone, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

const UserContractorCard = memo(({ card, onViewDetails, onApplyNow, index = 0, hiredStatus, hiredRequests = {} }) => {
    const navigate = useNavigate();
    
    // Get hire request details including chatId
    const hireRequest = hiredRequests[card.id];
    const chatId = hireRequest?.chatId;
    
    const handleChatClick = async () => {
        console.log('🔵 Chat button clicked (User Panel)');
        console.log('Current chatId:', chatId);
        console.log('Card ID:', card.id);
        console.log('Card Contractor Name:', card.contractorName);
        console.log('Hire Request:', hireRequest);
        
        try {
            // Import API modules
            const { contractorAPI, chatAPI } = await import('../../../services/api');
            
            // ALWAYS check for existing chats first (most reliable method)
            console.log('🔍 Checking for existing chats...');
            const chatsResponse = await chatAPI.getUserChats();
            console.log('📊 User Chats Response:', chatsResponse);
            
            if (chatsResponse.success && chatsResponse.data.chats && chatsResponse.data.chats.length > 0) {
                console.log('📋 Available chats:', chatsResponse.data.chats.map(c => ({
                    id: c._id,
                    name: c.otherParticipant?.name
                })));
                
                // Find chat with this contractor by name (case-insensitive, trimmed)
                const existingChat = chatsResponse.data.chats.find(chat => {
                    const otherName = (chat.otherParticipant?.name || '').toLowerCase().trim();
                    const cardName = (card.contractorName || '').toLowerCase().trim();
                    console.log(`Comparing: "${otherName}" === "${cardName}"`);
                    return otherName === cardName;
                });
                
                if (existingChat) {
                    console.log('✅ Found existing chat with contractor:', existingChat._id);
                    navigate(`/user/chat/${existingChat._id}`);
                    return;
                }
                
                console.log('⚠️ No existing chat found with this contractor name');
            } else {
                console.log('⚠️ No chats available or API failed');
            }
            
            // If chatId is available in hire request, use it
            if (chatId) {
                console.log('✅ ChatId available in hire request, navigating to:', `/user/chat/${chatId}`);
                navigate(`/user/chat/${chatId}`);
                return;
            }
            
            // Fetch latest hire request status to get chatId
            console.log('🔄 Fetching latest hire request status...');
            const response = await contractorAPI.getSentContractorHireRequests();
            console.log('📊 Hire Requests Response:', response);
            
            if (response.success && response.data.hireRequests) {
                const updatedRequest = response.data.hireRequests.find(req => req.contractorId === card.id);
                console.log('📋 Updated Request for card:', updatedRequest);
                
                if (updatedRequest?.chatId) {
                    console.log('✅ ChatId found in updated request, navigating to:', `/user/chat/${updatedRequest.chatId}`);
                    navigate(`/user/chat/${updatedRequest.chatId}`);
                    return;
                }
            }
            
            // If still no chat found, navigate to chat list page
            console.log('❌ No chat available through any method, redirecting to chat list');
            navigate('/user/chat');
            
        } catch (error) {
            console.error('❌ Failed to open chat:', error);
            // On error, still try to navigate to chat list
            navigate('/user/chat');
        }
    };
    
    return (
        <div className="premium-card card-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            {/* Header with Contractor Info and Status Badge */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-2xl font-bold text-gray-900">
                            {card.contractorName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{card.contractorName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{card.city}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    card.availabilityStatus === 'Available' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                }`}>
                    {card.availabilityStatus === 'Available' ? 'Open' : 'Closed'}
                </span>
            </div>

            {/* Primary Work Category */}
            <div className="mb-3">
                <p className="text-sm text-gray-500">Primary Work:</p>
                <p className="text-lg font-bold text-gray-900">{card.primaryWorkCategory}</p>
            </div>

            {/* Experience and Business Type */}
            <div className="flex gap-4 mb-3 flex-wrap text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <span className="font-medium">Exp:</span>
                    <span>{card.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium">📅</span>
                    <span>{card.businessType}</span>
                </div>
            </div>

            {/* Rating and Budget */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{card.rating || 0}.0/5</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>₹{card.budgetAmount}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{card.contactNo}</span>
                </div>
            </div>

            {/* Action Buttons */}
            {hiredStatus === 'approved' ? (
                <div className="space-y-2">
                    <button
                        onClick={() => onViewDetails(card)}
                        className="w-full btn-secondary py-2.5"
                    >
                        View Details
                    </button>
                    <div className="flex gap-2">
                        <button
                            disabled
                            className="flex-1 bg-green-500 text-white cursor-default shadow-md font-semibold py-2 rounded-lg text-sm"
                        >
                            ✓ Approved
                        </button>
                        <button
                            onClick={handleChatClick}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all active:scale-95 text-sm"
                        >
                            💬 Chat
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-3">
                    <button
                        onClick={() => onViewDetails(card)}
                        className="btn-secondary flex-1 py-2.5"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onApplyNow(card.id)}
                        disabled={hiredStatus}
                        className={`flex-1 font-bold py-2.5 rounded-lg transition-all active:scale-95 ${
                            hiredStatus === 'declined'
                                ? 'bg-gray-500 text-white cursor-not-allowed'
                                : hiredStatus === 'pending'
                                ? 'bg-red-500 text-white cursor-not-allowed'
                                : 'btn-primary'
                        }`}
                    >
                        {hiredStatus === 'declined'
                            ? 'Not Approved'
                            : hiredStatus === 'pending'
                            ? 'Request Sent'
                            : 'Hire Contractor'}
                    </button>
                </div>
            )}
        </div>
    );
});

UserContractorCard.displayName = 'UserContractorCard';

export default UserContractorCard;
