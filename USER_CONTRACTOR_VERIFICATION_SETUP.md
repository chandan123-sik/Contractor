# User & Contractor Verification Setup

## Task
User aur Contractor ke liye bhi legal verification pages banana hai jo labour jaisa kaam kare.

## Implementation Steps

### 1. User Verification

#### A. Replace Legal.jsx
File: `Frontend/src/modules/user/pages/Legal.jsx`

**Changes Needed:**
1. Add `fetchVerificationStatus()` - fetches from `GET /api/users/verification-status`
2. Update `handleSubmitVerification()` - calls `POST /api/admin/verification/submit` with `entityType: 'user'`
3. Minimum 2 photos required
4. Database integration with localStorage fallback

**New File Created:**
`Frontend/src/modules/user/pages/LegalVerification.jsx` - Complete implementation ready

#### B. Add Backend Endpoint
File: `Backend/modules/user/controllers/user.controller.js`

Add method:
```javascript
export const getUserVerificationStatus = async (req, res, next) => {
    try {
        const VerificationRequest = (await import('../../admin/models/VerificationRequest.model.js')).default;
        
        const verificationRequest = await VerificationRequest.findOne({
            entityId: req.user._id,
            entityType: 'user'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                isVerified: req.user.isVerified || false,
                verificationRequest: verificationRequest || null
            }
        });
    } catch (error) {
        next(error);
    }
};
```

#### C. Add Route
File: `Backend/modules/user/routes/user.routes.js`

Add:
```javascript
router.get('/verification-status', getUserVerificationStatus);
```

### 2. Contractor Verification

#### A. Create ContractorLegalVerification.jsx
File: `Frontend/src/modules/contractor/pages/LegalVerification.jsx`

**Same as User but with:**
- `entityType: 'contractor'`
- Fetch from `GET /api/contractor/verification-status`
- Include `company` field in submission

#### B. Add Backend Endpoint
File: `Backend/modules/contractor/controllers/contractor.controller.js`

Add method:
```javascript
export const getContractorVerificationStatus = async (req, res, next) => {
    try {
        const contractor = await Contractor.findOne({ user: req.user._id });
        
        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor profile not found'
            });
        }

        const VerificationRequest = (await import('../../admin/models/VerificationRequest.model.js')).default;
        
        const verificationRequest = await VerificationRequest.findOne({
            entityId: contractor._id,
            entityType: 'contractor'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                isVerified: contractor.isVerified || false,
                verificationRequest: verificationRequest || null
            }
        });
    } catch (error) {
        next(error);
    }
};
```

#### C. Add Route
File: `Backend/modules/contractor/routes/contractor.routes.js`

Add:
```javascript
router.get('/verification-status', getContractorVerificationStatus);
```

### 3. Update Routes (if using new files)

File: `Frontend/src/routes/AppRoutes.jsx`

```javascript
// Import
import UserLegalVerification from '../modules/user/pages/LegalVerification';
import ContractorLegalVerification from '../modules/contractor/pages/LegalVerification';

// Routes
<Route path="/user/legal" element={<UserLegalVerification />} />
<Route path="/contractor/legal" element={<ContractorLegalVerification />} />
```

## API Endpoints Summary

### Submit Verification (Already Exists)
```
POST /api/admin/verification/submit
Authorization: Bearer {user_token}

Body: {
    entityType: 'user' | 'labour' | 'contractor',
    name: string,
    phone: string,
    aadhaarNumber: string (12 digits),
    aadhaarFrontUrl: string (base64),
    aadhaarBackUrl: string (base64),
    company: string (optional, for contractor)
}

Response: {
    success: true,
    data: { verificationRequest: {...} }
}
```

### Get User Verification Status (NEW)
```
GET /api/users/verification-status
Authorization: Bearer {user_token}

Response: {
    success: true,
    data: {
        isVerified: boolean,
        verificationRequest: {...} | null
    }
}
```

### Get Contractor Verification Status (NEW)
```
GET /api/contractor/verification-status
Authorization: Bearer {user_token}

Response: {
    success: true,
    data: {
        isVerified: boolean,
        verificationRequest: {...} | null
    }
}
```

## Complete Flow

### User Flow:
1. User goes to `/user/legal`
2. Enters Aadhaar number (from profile)
3. Uploads 2+ photos
4. Clicks "Submit for Verification"
5. POST to `/api/admin/verification/submit` with `entityType: 'user'`
6. Status changes to "Pending Verification"
7. Admin sees in verification management
8. Admin approves → User sees "Verified" status

### Contractor Flow:
1. Contractor goes to `/contractor/legal`
2. Enters Aadhaar number
3. Uploads 2+ photos
4. Clicks "Submit for Verification"
5. POST to `/api/admin/verification/submit` with `entityType: 'contractor'`
6. Status changes to "Pending Verification"
7. Admin sees in verification management
8. Admin approves → Contractor sees "Verified" status

## Files to Create/Modify

### Frontend:
1. ✅ `Frontend/src/modules/user/pages/LegalVerification.jsx` (CREATED)
2. ⏳ `Frontend/src/modules/contractor/pages/LegalVerification.jsx` (TO CREATE - copy from user)
3. ⏳ Update `Frontend/src/routes/AppRoutes.jsx` (if using new files)

### Backend:
4. ⏳ `Backend/modules/user/controllers/user.controller.js` - Add `getUserVerificationStatus()`
5. ⏳ `Backend/modules/user/routes/user.routes.js` - Add route
6. ⏳ `Backend/modules/contractor/controllers/contractor.controller.js` - Add `getContractorVerificationStatus()`
7. ⏳ `Backend/modules/contractor/routes/contractor.routes.js` - Add route

## Testing

### User Verification:
```powershell
# Login as user
POST /api/auth/login
Body: { mobileNumber: "1234567890", userType: "User" }

# Submit verification
POST /api/admin/verification/submit
Headers: { Authorization: Bearer {token} }
Body: { entityType: "user", name: "Test User", ... }

# Check status
GET /api/users/verification-status
Headers: { Authorization: Bearer {token} }
```

### Contractor Verification:
```powershell
# Login as contractor
POST /api/auth/login
Body: { mobileNumber: "1234567890", userType: "Contractor" }

# Submit verification
POST /api/admin/verification/submit
Headers: { Authorization: Bearer {token} }
Body: { entityType: "contractor", name: "Test Contractor", company: "ABC Ltd", ... }

# Check status
GET /api/contractor/verification-status
Headers: { Authorization: Bearer {token} }
```

## Status: 🔄 IN PROGRESS

User verification page created. Contractor page aur backend endpoints add karne hain.
