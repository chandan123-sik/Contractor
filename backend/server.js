import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userJobRoutes from './modules/user/routes/user.routes.js';
import labourRoutes from './modules/labour/routes/labour.routes.js';
import contractorRoutes from './modules/contractor/routes/contractor.routes.js';
import adminRoutes from './modules/admin/routes/admin.routes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Increase body size limit for image uploads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Body keys:', Object.keys(req.body));
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', userJobRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/categories', categoryRoutes); // Public categories route
app.use('/api/labour', labourRoutes);
app.use('/api/contractor', contractorRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
