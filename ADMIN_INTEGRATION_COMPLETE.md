# Admin Module Integration - Complete Guide

## ✅ What's Been Created

### Backend (Complete)
```
backend/modules/admin/
├── models/ (6 models)
│   ├── Admin.model.js
│   ├── LabourCategory.model.js
│   ├── VerificationRequest.model.js
│   ├── Request.model.js
│   ├── Feedback.model.js
│   └── CMSContent.model.js
├── controllers/ (8 controllers)
│   ├── auth.admin.controller.js
│   ├── user.admin.controller.js
│   ├── labour.admin.controller.js
│   ├── contractor.admin.controller.js
│   ├── category.admin.controller.js
│   ├── verification.admin.controller.js
│   ├── cms.admin.controller.js
│   └── dashboard.admin.controller.js
├── routes/ (9 route files)
│   ├── admin.routes.js (main router)
│   ├── auth.admin.routes.js
│   ├── user.admin.routes.js
│   ├── labour.admin.routes.js
│   ├── contractor.admin.routes.js
│   ├── category.admin.routes.js
│   ├── verification.admin.routes.js
│   ├── cms.admin.routes.js
│   └── dashboard.admin.routes.js
├── middleware/
│   └── admin.auth.middleware.js
└── seeds/
    └── admin.seed.js
```

### Frontend (API Service Created)
```
Frontend/src/services/
└── admin.api.js (Complete API integration)
```

### Documentation
- `backend/modules/admin/README.md` - Complete backend documentation
- `backend/test-admin.ps1` - PowerShell testing script
- `ADMIN_MODULE_DEEP_ANALYSIS.md` - Detailed analysis

---

## 🚀 Setup Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install bcryptjs
```

### Step 2: Seed Database

```bash
node backend/modules/admin/seeds/admin.seed.js
```

**Output:**
```
✅ MongoDB Connected for seeding
🗑️  Cleared existing admins
✅ Admin users seeded successfully

📋 Default Admin Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 SUPER_ADMIN
   Username: admin
   Password: admin123
   Email: admin@rajghar.com

👤 ADMIN_USER
   Username: user_admin
   Password: admin123
   Email: useradmin@rajghar.com

👤 ADMIN_LABOUR
   Username: labour_admin
   Password: admin123
   Email: labouradmin@rajghar.com

👤 ADMIN_CONTRACTOR
   Username: contractor_admin
   Password: admin123
   Email: contractoradmin@rajghar.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗑️  Cleared existing labour categories
✅ Labour categories seeded successfully
🗑️  Cleared existing CMS content
✅ CMS content seeded successfully

✅ All data seeded successfully!
```

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

Server should start on `http://localhost:5000`

### Step 4: Test Backend APIs

```bash
# Run test script
./backend/test-admin.ps1

# Or test manually
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Step 5: Update Frontend Environment

Make sure `Frontend/.env` has:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend should start on `http://localhost:5173`

---

## 🔐 Admin Login Flow

### 1. Frontend Login (AdminLogin.jsx)
```javascript
import { adminAuthAPI } from '../../../services/admin.api';

const response = await adminAuthAPI.login(username, password);

// Store auth data
localStorage.setItem('adminAuth', 'true');
localStorage.setItem('adminToken', response.data.token);
localStorage.setItem('adminRole', response.data.admin.role);
```

### 2. Backend Authentication
```javascript
// POST /api/admin/auth/login
- Validates credentials
- Checks password with bcrypt
- Generates JWT token
- Returns admin data + token
```

### 3. Protected Routes
```javascript
// All admin routes use protectAdmin middleware
- Verifies JWT token
- Checks admin role
- Allows/denies access based on permissions
```

---

## 📡 API Integration Examples

### Example 1: Get All Users

**Frontend:**
```javascript
import { userManagementAPI } from '../../../services/admin.api';

const fetchUsers = async () => {
    try {
        const response = await userManagementAPI.getAllUsers({
            page: 1,
            limit: 10,
            status: 'Active'
        });
        
        setUsers(response.data.users);
        setTotal(response.data.total);
    } catch (error) {
        toast.error('Failed to fetch users');
    }
};
```

**Backend Response:**
```json
{
    "success": true,
    "data": {
        "users": [...],
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5
    }
}
```

### Example 2: Create Labour Category

**Frontend:**
```javascript
import { labourCategoryAPI } from '../../../services/admin.api';

const createCategory = async (name, image) => {
    try {
        const response = await labourCategoryAPI.createCategory({
            name,
            image
        });
        
        toast.success('Category created successfully');
        fetchCategories(); // Refresh list
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create category');
    }
};
```

### Example 3: Approve Verification

**Frontend:**
```javascript
import { verificationAPI } from '../../../services/admin.api';

const approveVerification = async (requestId) => {
    try {
        const response = await verificationAPI.approveRequest(requestId);
        toast.success('Verification approved');
        fetchRequests(); // Refresh list
    } catch (error) {
        toast.error('Failed to approve verification');
    }
};
```

---

## 🔄 Next Steps to Make Frontend Dynamic

### 1. Update UserManagement.jsx

Replace static data with API calls:

```javascript
import { userManagementAPI } from '../../../services/admin.api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userManagementAPI.getAllUsers(pagination);
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (userData) => {
        try {
            await userManagementAPI.createUser(userData);
            toast.success('User created successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleUpdate = async (id, userData) => {
        try {
            await userManagementAPI.updateUser(id, userData);
            toast.success('User updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await userManagementAPI.deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    // ... rest of component
};
```

### 2. Update LabourManagement.jsx

Similar pattern:

```javascript
import { labourManagementAPI } from '../../../services/admin.api';

const LabourManagement = () => {
    const [labours, setLabours] = useState([]);
    
    useEffect(() => {
        fetchLabours();
    }, []);

    const fetchLabours = async () => {
        try {
            const response = await labourManagementAPI.getAllLabours();
            setLabours(response.data.labours);
        } catch (error) {
            toast.error('Failed to fetch labours');
        }
    };

    // CRUD operations similar to UserManagement
};
```

### 3. Update ContractorManagement.jsx

```javascript
import { contractorManagementAPI } from '../../../services/admin.api';

const ContractorManagement = () => {
    const [contractors, setContractors] = useState([]);
    
    useEffect(() => {
        fetchContractors();
    }, []);

    const fetchContractors = async () => {
        try {
            const response = await contractorManagementAPI.getAllContractors();
            setContractors(response.data.contractors);
        } catch (error) {
            toast.error('Failed to fetch contractors');
        }
    };

    // CRUD operations
};
```

### 4. Update LabourCategoryManagement.jsx

```javascript
import { labourCategoryAPI } from '../../../services/admin.api';

const LabourCategoryManagement = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await labourCategoryAPI.getAllCategories();
            setCategories(response.data.categories);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const handleAddCategory = async () => {
        try {
            await labourCategoryAPI.createCategory({
                name: newCategoryName,
                image: newCategoryImage
            });
            toast.success('Category added successfully');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to add category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await labourCategoryAPI.deleteCategory(id);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };
};
```

### 5. Update DashboardHome.jsx

```javascript
import { dashboardAPI } from '../../../services/admin.api';

export function DashboardHome() {
    const [analytics, setAnalytics] = useState(null);
    const [interactions, setInteractions] = useState([]);

    useEffect(() => {
        fetchAnalytics();
        fetchInteractions();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await dashboardAPI.getAnalytics();
            setAnalytics(response.data.analytics);
        } catch (error) {
            toast.error('Failed to fetch analytics');
        }
    };

    const fetchInteractions = async () => {
        try {
            const response = await dashboardAPI.getInteractions({ limit: 10 });
            setInteractions(response.data.interactions);
        } catch (error) {
            toast.error('Failed to fetch interactions');
        }
    };

    return (
        <>
            <div className="analytics-grid">
                <AnalyticsCard 
                    icon={<Users color="#3b82f6" />} 
                    title="Total Users" 
                    value={analytics?.totalUsers || 0} 
                    bg="#eff6ff" 
                />
                <AnalyticsCard 
                    icon={<HardHat color="#f97316" />} 
                    title="Total Labours" 
                    value={analytics?.totalLabours || 0} 
                    bg="#fff7ed" 
                />
                {/* ... more cards */}
            </div>
            {/* ... rest of dashboard */}
        </>
    );
}
```

### 6. Update VerificationManagement.jsx

```javascript
import { verificationAPI } from '../../../services/admin.api';

const VerificationManagement = () => {
    const [verificationRequests, setVerificationRequests] = useState({
        users: [],
        labours: [],
        contractors: []
    });

    useEffect(() => {
        fetchVerificationRequests();
    }, [activeCategory]);

    const fetchVerificationRequests = async () => {
        try {
            const response = await verificationAPI.getAllRequests({
                category: activeCategory,
                status: 'Pending'
            });
            
            setVerificationRequests(prev => ({
                ...prev,
                [activeCategory]: response.data.requests
            }));
        } catch (error) {
            toast.error('Failed to fetch verification requests');
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'Approved') {
                await verificationAPI.approveRequest(id);
            } else {
                await verificationAPI.rejectRequest(id, 'Documents not valid');
            }
            toast.success(`Request ${action.toLowerCase()}`);
            fetchVerificationRequests();
        } catch (error) {
            toast.error(`Failed to ${action.toLowerCase()} request`);
        }
    };
};
```

### 7. Update AdminSettings.jsx

```javascript
import { adminAuthAPI, cmsAPI } from '../../../services/admin.api';

const AdminSettings = () => {
    const [adminProfile, setAdminProfile] = useState(null);
    const [cmsContent, setCmsContent] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchCMSContent();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await adminAuthAPI.getProfile();
            setAdminProfile(response.data.profile);
        } catch (error) {
            toast.error('Failed to fetch profile');
        }
    };

    const fetchCMSContent = async () => {
        try {
            const response = await cmsAPI.getAllContent();
            setCmsContent(response.data.content);
        } catch (error) {
            toast.error('Failed to fetch CMS content');
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        
        try {
            // Update profile
            await adminAuthAPI.updateProfile({
                name: adminProfile.name,
                email: adminProfile.email,
                phone: adminProfile.phone
            });

            // Change password if provided
            if (adminProfile.newPassword) {
                await adminAuthAPI.changePassword(
                    adminProfile.currentPassword,
                    adminProfile.newPassword
                );
            }

            toast.success('Profile updated successfully');
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleCmsSave = async (e) => {
        e.preventDefault();
        
        try {
            await cmsAPI.updateAllContent(cmsContent);
            toast.success('Content updated successfully');
        } catch (error) {
            toast.error('Failed to update content');
        }
    };
};
```

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Seed database successfully
- [ ] Admin login works
- [ ] Token verification works
- [ ] Get all users
- [ ] Get all labours
- [ ] Get all contractors
- [ ] Get labour categories
- [ ] Get dashboard analytics
- [ ] Get CMS content
- [ ] Get verification requests

### Frontend Tests
- [ ] Admin login page works
- [ ] Token stored in localStorage
- [ ] Dashboard loads
- [ ] User management CRUD
- [ ] Labour management CRUD
- [ ] Contractor management CRUD
- [ ] Category management CRUD
- [ ] Verification approval/rejection
- [ ] CMS content update
- [ ] Profile update
- [ ] Password change
- [ ] Logout works

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
cd backend
npm install bcryptjs
```

### Issue 2: "Admin not found" after seeding
**Solution:**
```bash
# Re-run seed script
node backend/modules/admin/seeds/admin.seed.js
```

### Issue 3: CORS errors in frontend
**Solution:** Check `backend/server.js`:
```javascript
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
```

### Issue 4: Token expired
**Solution:** Login again to get new token

### Issue 5: "Access denied" errors
**Solution:** Check admin role has permission for that endpoint

---

## 📊 Database Collections Created

After seeding, you'll have:

1. **admins** - 4 admin users
2. **labourcategories** - 7 default categories
3. **cmscontents** - 4 CMS sections
4. **users** - Existing users (from your app)
5. **labours** - Existing labours
6. **contractors** - Existing contractors
7. **verificationrequests** - Empty (will be populated)
8. **requests** - Empty (will be populated)
9. **feedbacks** - Empty (will be populated)

---

## 🎯 Summary

### ✅ Completed
- Backend models (6)
- Backend controllers (8)
- Backend routes (9)
- Backend middleware (RBAC)
- Frontend API service (complete)
- Database seeding script
- Testing script
- Documentation

### 🔄 Next Steps
1. Run seed script
2. Test backend APIs
3. Update frontend components to use API
4. Test full integration
5. Deploy

---

**Total APIs Created:** 43+
**Total Files Created:** 25+
**Estimated Integration Time:** 2-3 hours

---

*Created: February 10, 2026*
*Status: Ready for Integration*
