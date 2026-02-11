# Admin Module - Backend

Complete admin panel backend with authentication, role-based access control, and management APIs.

## 📁 Structure

```
backend/modules/admin/
├── models/
│   ├── Admin.model.js              # Admin user model
│   ├── LabourCategory.model.js     # Labour categories
│   ├── VerificationRequest.model.js # Verification requests
│   ├── Request.model.js            # User/Labour/Contractor requests
│   ├── Feedback.model.js           # Feedback system
│   └── CMSContent.model.js         # CMS content management
├── controllers/
│   ├── auth.admin.controller.js    # Authentication
│   ├── user.admin.controller.js    # User management
│   ├── labour.admin.controller.js  # Labour management
│   ├── contractor.admin.controller.js # Contractor management
│   ├── category.admin.controller.js # Category management
│   ├── verification.admin.controller.js # Verification
│   ├── cms.admin.controller.js     # CMS management
│   └── dashboard.admin.controller.js # Dashboard analytics
├── routes/
│   ├── admin.routes.js             # Main router
│   ├── auth.admin.routes.js        # Auth routes
│   ├── user.admin.routes.js        # User routes
│   ├── labour.admin.routes.js      # Labour routes
│   ├── contractor.admin.routes.js  # Contractor routes
│   ├── category.admin.routes.js    # Category routes
│   ├── verification.admin.routes.js # Verification routes
│   ├── cms.admin.routes.js         # CMS routes
│   └── dashboard.admin.routes.js   # Dashboard routes
├── middleware/
│   └── admin.auth.middleware.js    # Admin authentication & RBAC
└── seeds/
    └── admin.seed.js               # Database seeding script
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install bcryptjs
```

### 2. Seed Database

Run the seed script to create default admin users and initial data:

```bash
node backend/modules/admin/seeds/admin.seed.js
```

This will create:
- 4 default admin users with different roles
- 7 default labour categories
- Default CMS content

### 3. Default Admin Credentials

After seeding, you can login with:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| Super Admin | `admin` | `admin123` | admin@rajghar.com |
| User Admin | `user_admin` | `admin123` | useradmin@rajghar.com |
| Labour Admin | `labour_admin` | `admin123` | labouradmin@rajghar.com |
| Contractor Admin | `contractor_admin` | `admin123` | contractoradmin@rajghar.com |

## 🔐 Admin Roles & Permissions

### SUPER_ADMIN
- Full access to all features
- User, Labour, Contractor management
- Verification management
- CMS management
- Dashboard analytics

### ADMIN_USER
- User management only
- View user requests and feedbacks
- Dashboard access

### ADMIN_LABOUR
- Labour management
- Labour category management
- View labour requests and feedbacks
- Dashboard access

### ADMIN_CONTRACTOR
- Contractor management only
- View contractor requests and feedbacks
- Dashboard access

## 📡 API Endpoints

### Authentication
```
POST   /api/admin/auth/login              # Admin login
POST   /api/admin/auth/logout             # Admin logout
PUT    /api/admin/auth/change-password    # Change password
GET    /api/admin/auth/verify-token       # Verify JWT token
GET    /api/admin/auth/profile            # Get admin profile
PUT    /api/admin/auth/profile            # Update admin profile
```

### User Management (SUPER_ADMIN, ADMIN_USER)
```
GET    /api/admin/users                   # Get all users
POST   /api/admin/users                   # Create user
GET    /api/admin/users/:id               # Get user by ID
PUT    /api/admin/users/:id               # Update user
DELETE /api/admin/users/:id               # Delete user
GET    /api/admin/users/:id/contractor-requests
GET    /api/admin/users/:id/labour-requests
GET    /api/admin/users/:id/feedbacks
```

### Labour Management (SUPER_ADMIN, ADMIN_LABOUR)
```
GET    /api/admin/labours                 # Get all labours
POST   /api/admin/labours                 # Create labour
GET    /api/admin/labours/:id             # Get labour by ID
PUT    /api/admin/labours/:id             # Update labour
DELETE /api/admin/labours/:id             # Delete labour
GET    /api/admin/labours/:id/contractor-requests
GET    /api/admin/labours/:id/user-requests
GET    /api/admin/labours/:id/feedbacks
```

### Contractor Management (SUPER_ADMIN, ADMIN_CONTRACTOR)
```
GET    /api/admin/contractors             # Get all contractors
POST   /api/admin/contractors             # Create contractor
GET    /api/admin/contractors/:id         # Get contractor by ID
PUT    /api/admin/contractors/:id         # Update contractor
DELETE /api/admin/contractors/:id         # Delete contractor
GET    /api/admin/contractors/:id/user-requests
GET    /api/admin/contractors/:id/labour-requests
GET    /api/admin/contractors/:id/feedbacks
```

### Labour Categories (SUPER_ADMIN, ADMIN_LABOUR)
```
GET    /api/admin/labour-categories       # Get all categories
POST   /api/admin/labour-categories       # Create category
GET    /api/admin/labour-categories/:id   # Get category by ID
PUT    /api/admin/labour-categories/:id   # Update category
DELETE /api/admin/labour-categories/:id   # Delete category
```

### Verification (SUPER_ADMIN only)
```
GET    /api/admin/verification/requests   # Get all requests
POST   /api/admin/verification/requests   # Create request
GET    /api/admin/verification/requests/:id
PUT    /api/admin/verification/requests/:id/approve
PUT    /api/admin/verification/requests/:id/reject
POST   /api/admin/verification/upload-document
```

### CMS Management (All Admins)
```
GET    /api/admin/cms                     # Get all CMS content
GET    /api/admin/cms/:section            # Get section (Public)
PUT    /api/admin/cms                     # Update all content
PUT    /api/admin/cms/:section            # Update section
```

### Dashboard (All Admins)
```
GET    /api/admin/dashboard/analytics     # Get analytics
GET    /api/admin/dashboard/interactions  # Get interactions
GET    /api/admin/dashboard/verification-queue
GET    /api/admin/dashboard/disputes
GET    /api/admin/dashboard/revenue
GET    /api/admin/dashboard/audio-logs
```

## 🧪 Testing

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Get Users (with token)
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Role-Based Access Control**: Middleware for role checking
4. **Token Expiry**: Automatic token expiration
5. **Input Validation**: Request validation
6. **Error Handling**: Centralized error handling

## 📝 Usage Examples

### Login and Get Token
```javascript
const response = await fetch('http://localhost:5000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
    })
});

const { data } = await response.json();
const token = data.token;
```

### Use Token for Authenticated Requests
```javascript
const response = await fetch('http://localhost:5000/api/admin/users', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## 🐛 Troubleshooting

### Issue: "Admin not found" after seeding
**Solution**: Make sure MongoDB is running and seed script completed successfully

### Issue: "Token expired"
**Solution**: Login again to get a new token

### Issue: "Access denied"
**Solution**: Check if your admin role has permission for that endpoint

## 📚 Related Documentation

- [ADMIN_MODULE_DEEP_ANALYSIS.md](../../../ADMIN_MODULE_DEEP_ANALYSIS.md) - Complete analysis
- [Frontend Admin Module](../../../Frontend/src/modules/admin/) - Frontend implementation

## 🔄 Database Models

### Admin
- username, password (hashed), name, email, phone
- role (SUPER_ADMIN, ADMIN_USER, ADMIN_LABOUR, ADMIN_CONTRACTOR)
- isActive, lastLogin, timestamps

### LabourCategory
- name, image, isActive, createdBy

### VerificationRequest
- requestId, entityType, entityId, name, phone
- aadhaarNumber, aadhaarFrontUrl, aadhaarBackUrl
- status (Pending, Approved, Rejected)
- verifiedBy, verifiedAt

### Request
- senderId, senderType, receiverId, receiverType
- requestType (HIRE, INQUIRY, JOIN_TEAM)
- requestContext (Audio, Text, HIRE)
- content, audioUrl, status

### Feedback
- entityType, entityId, rating (1-5), comment
- givenBy, timestamps

### CMSContent
- section (aboutUs, contactUs, terms, privacy)
- content (JSON), updatedBy

## 🚀 Next Steps

1. Run seed script: `node backend/modules/admin/seeds/admin.seed.js`
2. Start server: `npm run dev`
3. Test login endpoint
4. Integrate with frontend
5. Test all CRUD operations

---

**Created**: February 10, 2026
**Last Updated**: February 10, 2026
