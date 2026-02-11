# Admin Module - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (30 seconds)
```bash
cd backend
npm install bcryptjs
```

### Step 2: Seed Database (1 minute)
```bash
node backend/modules/admin/seeds/admin.seed.js
```

You'll see:
```
✅ Admin users seeded successfully
✅ Labour categories seeded successfully
✅ CMS content seeded successfully
```

### Step 3: Start Backend (30 seconds)
```bash
cd backend
npm run dev
```

Server starts on: `http://localhost:5000`

### Step 4: Test Login (1 minute)
```bash
# Windows PowerShell
./backend/test-admin.ps1

# Or use curl
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Step 5: Start Frontend (30 seconds)
```bash
cd Frontend
npm run dev
```

Frontend starts on: `http://localhost:5173`

### Step 6: Login to Admin Panel (1 minute)
1. Go to: `http://localhost:5173/admin/login`
2. Username: `admin`
3. Password: `admin123`
4. Click "Sign In to Dashboard"

---

## 🎯 Default Admin Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `admin123` | Super Admin | Full Access |
| `user_admin` | `admin123` | User Admin | Users Only |
| `labour_admin` | `admin123` | Labour Admin | Labours & Categories |
| `contractor_admin` | `admin123` | Contractor Admin | Contractors Only |

---

## 📡 API Base URL

```javascript
http://localhost:5000/api/admin
```

### Quick API Test
```bash
# Login
POST /api/admin/auth/login
Body: {"username":"admin","password":"admin123"}

# Get Users (need token from login)
GET /api/admin/users
Header: Authorization: Bearer YOUR_TOKEN

# Get Dashboard
GET /api/admin/dashboard/analytics
Header: Authorization: Bearer YOUR_TOKEN
```

---

## 🔧 Frontend Integration

### Import API Service
```javascript
import { 
    adminAuthAPI,
    userManagementAPI,
    labourManagementAPI,
    contractorManagementAPI,
    labourCategoryAPI,
    verificationAPI,
    cmsAPI,
    dashboardAPI
} from '../../../services/admin.api';
```

### Example: Fetch Users
```javascript
const fetchUsers = async () => {
    try {
        const response = await userManagementAPI.getAllUsers({
            page: 1,
            limit: 10
        });
        setUsers(response.data.users);
    } catch (error) {
        console.error('Error:', error);
    }
};
```

---

## 📁 File Structure

```
backend/modules/admin/
├── models/          # 6 MongoDB models
├── controllers/     # 8 API controllers
├── routes/          # 9 route files
├── middleware/      # Auth & RBAC
└── seeds/           # Database seeding

Frontend/src/services/
└── admin.api.js     # Complete API integration
```

---

## ✅ Verification Checklist

- [ ] Backend dependencies installed
- [ ] Database seeded successfully
- [ ] Backend server running
- [ ] Test script passes
- [ ] Frontend server running
- [ ] Can login to admin panel
- [ ] Dashboard loads with data

---

## 🐛 Quick Troubleshooting

**Problem:** Seed script fails
```bash
# Make sure MongoDB is running
# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/your-database
```

**Problem:** Login fails
```bash
# Re-run seed script
node backend/modules/admin/seeds/admin.seed.js
```

**Problem:** CORS error
```javascript
// backend/server.js - Check CORS config
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
```

**Problem:** Token expired
```javascript
// Just login again - tokens expire after 7 days
```

---

## 📚 Full Documentation

- **Complete Guide:** `ADMIN_INTEGRATION_COMPLETE.md`
- **Backend Docs:** `backend/modules/admin/README.md`
- **Analysis:** `ADMIN_MODULE_DEEP_ANALYSIS.md`

---

## 🎉 You're Ready!

Admin module is now:
- ✅ Fully functional backend
- ✅ Database seeded
- ✅ API service ready
- ✅ Ready for frontend integration

**Next:** Update frontend components to use the API service instead of static data.

---

*Setup Time: ~5 minutes*
*Integration Time: ~2-3 hours*
