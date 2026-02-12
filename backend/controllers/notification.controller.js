import Notification from '../models/Notification.model.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, isRead, userType } = req.query;

        const query = { user: req.user._id };
        
        // Determine userType from query parameter or default to USER
        const notificationUserType = userType || 'USER';
        query.userType = notificationUserType;
        
        if (isRead !== undefined) {
            query.isRead = isRead === 'true';
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ 
            user: req.user._id,
            userType: notificationUserType,
            isRead: false 
        });

        res.status(200).json({
            success: true,
            data: {
                notifications,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                },
                unreadCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const { userType } = req.body;
        const notificationUserType = userType || 'USER';
        
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id,
            userType: notificationUserType
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: { notification }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
    try {
        const { userType } = req.body;
        const notificationUserType = userType || 'USER';
        
        await Notification.updateMany(
            { user: req.user._id, userType: notificationUserType, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
    try {
        const { userType } = req.query;
        const notificationUserType = userType || 'USER';
        
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id,
            userType: notificationUserType
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
    try {
        const { userType } = req.query;
        const notificationUserType = userType || 'USER';
        
        const count = await Notification.countDocuments({
            user: req.user._id,
            userType: notificationUserType,
            isRead: false
        });

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        next(error);
    }
};
