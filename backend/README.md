# Rajghar Backend API

Backend API for Rajghar platform - Connecting Users, Labour, and Contractors.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage

## Features

- ✅ User authentication (Login/Register)
- ✅ User, Labour, and Contractor profiles
- ✅ Job posting and management
- ✅ Labour card creation
- ✅ Contractor job postings
- ✅ Public browse endpoints
- ✅ JWT-based authentication
- ✅ Image upload support

## Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start server
npm start

# Development mode
npm run dev
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rajghar
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh token

### User
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/jobs` - Create job
- `GET /api/users/jobs` - Get user's jobs
- `PUT /api/users/jobs/:id` - Update job
- `DELETE /api/users/jobs/:id` - Delete job

### Jobs (Public)
- `GET /api/jobs/browse` - Browse all jobs

### Labour
- `PUT /api/labour/work-details` - Update work details
- `POST /api/labour/card` - Create labour card
- `GET /api/labour/profile` - Get profile
- `GET /api/labour/browse` - Browse labour cards (public)
- `GET /api/labour/:id` - Get labour by ID (public)

### Contractor
- `PUT /api/contractor/business-details` - Update business details
- `GET /api/contractor/profile` - Get profile
- `GET /api/contractor/browse` - Browse contractors (public)
- `POST /api/contractor/jobs` - Create contractor job
- `GET /api/contractor/jobs` - Get contractor's jobs
- `GET /api/contractor/jobs/browse` - Browse contractor jobs (public)
- `PUT /api/contractor/jobs/:id` - Update contractor job
- `DELETE /api/contractor/jobs/:id` - Delete contractor job

## Database Collections

- **users** - User profiles
- **jobs** - Job postings by users
- **labours** - Labour profiles and cards
- **contractors** - Contractor profiles
- **contractorjobs** - Job postings by contractors
- **subscriptions** - User subscriptions
- **notifications** - User notifications

## Project Structure

```
Backend/
├── config/
│   └── database.js
├── controllers/
│   └── auth.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── errorHandler.js
│   └── validator.js
├── models/
│   ├── Notification.model.js
│   └── Subscription.model.js
├── modules/
│   ├── user/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── routes/
│   ├── labour/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── routes/
│   └── contractor/
│       ├── models/
│       ├── controllers/
│       └── routes/
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── job.routes.js
├── utils/
│   ├── jwt.utils.js
│   └── cloudinary.utils.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## License

ISC
