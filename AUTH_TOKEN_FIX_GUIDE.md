# Authentication Token Issue - Fix Guide

## समस्या (Problem)

Error message: `{"success": false,"message": "TOKEN_MISSING","error": "No authentication token provided"}`

Ye error tab aata hai jab:
1. Frontend se koi protected API call ho rahi hai without authentication token
2. Ya public API call protected middleware se pass ho rahi hai

## Solution Steps

### Step 1: Verify Backend Server is Running

```bash
cd contractor-main/backend
node server.js
```

Server should show:
```
🚀 Server running on port 5000
```

### Step 2: Test Login Endpoint

```bash
node test-login-endpoint.js
```

Expected output:
```
✅ TEST PASSED: Login endpoint works without token
```

### Step 3: Check Frontend API Calls

Public endpoints (NO token required):
- `POST /api/auth/login` - Login
- `GET /api/admin/cms/:section` - Get CMS content (aboutUs, contactUs, etc.)
- `GET /api/categories` - Get categories
- `GET /api/admin/broadcasts/active` - Get active broadcasts

Protected endpoints (Token REQUIRED):
- `PUT /api/users/profile` - Update user profile
- `POST /api/labour/create-profile` - Create labour profile
- `POST /api/contractor/profile` - Create contractor profile
- All other user/labour/contractor APIs

### Step 4: Fix Frontend API Service

The `api.js` file already has token interceptor configured:

```javascript
// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);
```

**Important:** Use the `api` instance from `api.js` for protected routes, NOT direct `fetch()`.

### Step 5: Common Issues and Fixes

#### Issue 1: Using fetch() instead of api instance

❌ **Wrong:**
```javascript
const response = await fetch('http://localhost:5000/api/users/profile', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
        // Missing Authorization header!
    },
    body: JSON.stringify(data)
});
```

✅ **Correct:**
```javascript
import { userAPI } from '../services/api.js';

const response = await userAPI.updateProfile(data);
// Token automatically added by interceptor
```

#### Issue 2: Token not saved in localStorage

Make sure after login, token is saved:

```javascript
// After successful OTP verification
localStorage.setItem('access_token', data.data.accessToken);
localStorage.setItem('refresh_token', data.data.refreshToken);
```

#### Issue 3: Calling protected API before login

```javascript
// Check if user is logged in before calling protected APIs
const token = localStorage.getItem('access_token');
if (!token) {
    navigate('/mobile-input');
    return;
}

// Now safe to call protected APIs
const profile = await userAPI.getProfile();
```

### Step 6: Debugging Steps

1. **Check if token exists:**
```javascript
console.log('Token:', localStorage.getItem('access_token'));
```

2. **Check API call headers:**
```javascript
// In browser DevTools > Network tab
// Look for Authorization header in request
```

3. **Check backend logs:**
```
📨 PUT /api/users/profile
Headers: { authorization: 'Bearer eyJhbGc...' }
```

### Step 7: Fix Specific Pages

#### MobileInput.jsx
```javascript
// ✅ Correct - Login is public, no token needed
const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, requestedUserType })
});
```

#### CompleteProfile.jsx
```javascript
// ✅ Correct - Profile update needs token
const token = localStorage.getItem('access_token');
if (token) {
    const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Token added
        },
        body: JSON.stringify(profileData)
    });
}
```

#### AboutUs.jsx (Any page loading CMS content)
```javascript
// ✅ Correct - CMS content is public
import { cmsAPI } from '../services/api.js';

useEffect(() => {
    const fetchContent = async () => {
        try {
            const response = await cmsAPI.getAboutUs();
            setContent(response.data.content);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    fetchContent();
}, []);
```

## Quick Fix Checklist

- [ ] Backend server is running
- [ ] Login endpoint works without token (test with test-login-endpoint.js)
- [ ] Token is saved in localStorage after login
- [ ] Protected APIs use token from localStorage
- [ ] Public APIs (login, CMS) don't require token
- [ ] Using `api` instance from api.js for protected routes
- [ ] Browser DevTools shows Authorization header in protected requests

## Testing

### Test 1: Login Flow
1. Open app → Mobile Input page
2. Select user type
3. Enter mobile: `9999999999`
4. Click Continue
5. ✅ Should go to OTP page (no token error)

### Test 2: Profile Update
1. Complete login and OTP
2. Fill profile details
3. Click Continue
4. ✅ Should update profile (token automatically added)

### Test 3: CMS Content
1. Go to About Us page
2. ✅ Should load content (no token required)

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `TOKEN_MISSING` | No token in request | Add token to Authorization header |
| `TOKEN_EXPIRED` | Token has expired | Use refresh token to get new access token |
| `TOKEN_INVALID` | Invalid/corrupted token | Clear localStorage and login again |
| `ADMIN_NOT_FOUND` | Using admin token for user API | Use correct token for user type |

## API Service Usage

Always use the API service methods instead of direct fetch:

```javascript
import { authAPI, userAPI, labourAPI, contractorAPI, cmsAPI } from '../services/api.js';

// Auth (public)
await authAPI.login(mobileNumber);
await authAPI.register(userData);

// User (protected)
await userAPI.getProfile();
await userAPI.updateProfile(data);

// Labour (protected)
await labourAPI.createLabourCard(cardData);
await labourAPI.getLabourProfile();

// Contractor (protected)
await contractorAPI.updateBusinessDetails(data);
await contractorAPI.getContractorProfile();

// CMS (public)
await cmsAPI.getAboutUs();
await cmsAPI.getContactUs();
```

---

**Note:** If error persists, check browser console and backend terminal for detailed error messages.
