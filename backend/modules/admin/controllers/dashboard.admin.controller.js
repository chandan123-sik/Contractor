import User from '../../user/models/User.model.js';
import Labour from '../../labour/models/Labour.model.js';
import Contractor from '../../contractor/models/Contractor.model.js';
import Request from '../models/Request.model.js';
import VerificationRequest from '../models/VerificationRequest.model.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard/analytics
// @access  Private
export const getDashboardAnalytics = async (req, res) => {
    try {
        // Get counts - Count all users from users collection
        const totalUsers = await User.countDocuments();
        const totalLabours = await Labour.countDocuments();
        const totalContractors = await Contractor.countDocuments();
        const activeRequests = await Request.countDocuments({ status: 'PENDING' });

        // Get verification queue
        const verificationQueue = await VerificationRequest.find({ 
            status: 'Pending' 
        })
        .limit(5)
        .sort({ createdAt: -1 });

        // Get disputes (mock data for now)
        const disputes = {
            openCases: 5
        };

        // Get revenue (mock data for now)
        const revenue = {
            total: 150000,
            weeklyData: [10000, 20000, 15000, 40000, 70000]
        };

        res.status(200).json({
            success: true,
            data: {
                analytics: {
                    totalUsers,
                    totalLabours,
                    totalContractors,
                    activeRequests,
                    verificationQueue: verificationQueue.length,
                    disputes,
                    revenue
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard analytics',
            error: error.message
        });
    }
};

// @desc    Get all interactions/requests
// @route   GET /api/admin/dashboard/interactions
// @access  Private
export const getAllInteractions = async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;

        const query = {};

        if (type) {
            query.requestType = type;
        }

        const interactions = await Request.find(query)
            .populate('senderId', 'firstName lastName mobileNumber')
            .populate('receiverId', 'firstName lastName mobileNumber')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Request.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                interactions,
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching interactions',
            error: error.message
        });
    }
};

// @desc    Get verification queue
// @route   GET /api/admin/dashboard/verification-queue
// @access  Private
export const getVerificationQueue = async (req, res) => {
    try {
        const queue = await VerificationRequest.find({ 
            status: 'Pending' 
        })
        .populate('entityId', 'firstName lastName mobileNumber')
        .sort({ createdAt: -1 })
        .limit(10);

        res.status(200).json({
            success: true,
            data: { queue }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching verification queue',
            error: error.message
        });
    }
};

// @desc    Get disputes
// @route   GET /api/admin/dashboard/disputes
// @access  Private
export const getDisputes = async (req, res) => {
    try {
        // Mock data for now - implement actual dispute model later
        const disputes = {
            openCases: 5,
            disputes: []
        };

        res.status(200).json({
            success: true,
            data: { disputes }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching disputes',
            error: error.message
        });
    }
};

// @desc    Get revenue data
// @route   GET /api/admin/dashboard/revenue
// @access  Private
export const getRevenue = async (req, res) => {
    try {
        const { period = 'week' } = req.query;

        // Mock data for now - implement actual revenue tracking later
        let revenue = {
            total: 150000,
            data: []
        };

        if (period === 'week') {
            revenue.data = [10000, 20000, 15000, 40000, 70000];
        } else if (period === 'month') {
            revenue.data = [50000, 60000, 70000, 80000];
        }

        res.status(200).json({
            success: true,
            data: { revenue }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching revenue',
            error: error.message
        });
    }
};

// @desc    Get audio logs statistics
// @route   GET /api/admin/dashboard/audio-logs
// @access  Private
export const getAudioLogs = async (req, res) => {
    try {
        // Count requests with audio
        const audioRequests = await Request.countDocuments({ 
            requestContext: 'Audio',
            audioUrl: { $ne: null }
        });

        // Mock total hours calculation
        const totalHours = (audioRequests * 2.5).toFixed(2); // Assuming avg 2.5 min per audio

        res.status(200).json({
            success: true,
            data: {
                audioLogs: {
                    totalRequests: audioRequests,
                    totalHours: `${totalHours} hours`
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching audio logs',
            error: error.message
        });
    }
};
