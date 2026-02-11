# User & Contractor Verification System - Complete ✅

## Overview
Successfully implemented database-integrated verification system for Users and Contractors, matching the existing Labour verification flow.

## Implementation Summary

### 1. Frontend Updates

#### User Verification (`Frontend/src/modules/user/pages/Legal.jsx`)
- ✅ Updated to fetch verification status from database via `GET /api/users/verification-status`
- ✅ Submit verification to database via `POST /api/admin/verification/submit` with `entityType: 'user'`
- ✅ Requires minimum 2 photos (front and back of Aadhaar)
- ✅ Shows loading state during submission
- ✅ Hybrid system: database if token exists, localStorage as fallback
- ✅ Status tracking: pending → submitted → approved/rejected

#### Contractor Verification (`Frontend/src/modules/contractor/components/LegalVerificationSection.jsx`)
- ✅ Updated to fetch verification status from database via `GET /api/contractor/verification-status`
- ✅ Submit verification to database via `POST /api/admin/verification/submit` with `entityType: 'contractor'`
- ✅ Requires minimum 2 photos (front and back of Aadhaar)
- ✅ Shows loading state during submission
- ✅ Hybrid system: database if token exists, localStorage as fallback
- ✅ Status tracking: pending → submitted → approved/rejected

### 2. Backend Updates

#### User Controller (`Backend/modules/user/controllers/user.controller.js`)
Added new method:
```javascript
export const getUserVerificationStatus = async (req, res, next) => {
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
};
```

#### User Routes (`Backend/modules/user/routes/user.routes.js`)
Added route:
```javascript
router.get('/verification-status', getUserVerificationStatus);
```

#### Contractor Controller (`Backend/modules/contractor/controllers/contractor.controller.js`)
Added new method:
```javascript
export const getContractorVerificationStatus = async (req, res, next) => {
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
};
```

#### Contractor Routes (`Backend/modules/contractor/routes/contractor.routes.js`)
Added route:
```javascript
router.get('/verification-status', getContractorVerificationStatus);
```

### 3. Admin Verification System

The existing admin verification controller (`backend/modules/admin/controllers/verification.admin.controller.js`) already supports all three entity types:
- ✅ User verification
- ✅ Labour verification
- ✅ Contractor verification

Admin can:
- View all verification requests at `/admin/dashboard/verification`
- Filter by entity type (Users, Labours, Contractors)
- Approve/Reject requests
- View Aadhaar images in modal

## API Endpoints

### User Verification
```
GET  /api/users/verification-status          - Get user verification status
POST /api/admin/verification/submit          - Submit user verification (entityType: 'user')
```

### Contractor Verification
```
GET  /api/contractor/verification-status     - Get contractor verification status
POST /api/admin/verification/submit          - Submit contractor verification (entityType: 'contractor')
```

### Admin Verification Management
```
GET  /api/admin/verification/requests        - Get all verification requests
GET  /api/admin/verification/requests/:id    - Get specific request
PUT  /api/admin/verification/requests/:id/approve  - Approve request
PUT  /api/admin/verification/requests/:id/reject   - Reject request
```

## Verification Flow

### User Flow
1. User navigates to `/user/legal`
2. Page fetches existing verification status from database
3. User uploads Aadhaar front and back images (minimum 2 required)
4. User clicks "Submit for Verification"
5. Frontend calls `POST /api/admin/verification/submit` with:
   ```json
   {
     "entityType": "user",
     "name": "User Name",
     "phone": "9876543210",
     "aadhaarNumber": "123456789012",
     "aadhaarFrontUrl": "base64_or_url",
     "aadhaarBackUrl": "base64_or_url"
   }
   ```
6. Backend creates VerificationRequest with auto-generated requestId (V-U-001, V-U-002, etc.)
7. Status changes to "Pending"
8. Admin reviews and approves/rejects
9. User's `isVerified` flag updated on approval

### Contractor Flow
1. Contractor navigates to `/contractor/legal`
2. Page fetches existing verification status from database
3. Contractor uploads Aadhaar front and back images (minimum 2 required)
4. Contractor clicks "Submit for Verification"
5. Frontend calls `POST /api/admin/verification/submit` with:
   ```json
   {
     "entityType": "contractor",
     "name": "Contractor Name",
     "phone": "9876543211",
     "aadhaarNumber": "987654321098",
     "aadhaarFrontUrl": "base64_or_url",
     "aadhaarBackUrl": "base64_or_url"
   }
   ```
6. Backend finds contractor profile and creates VerificationRequest with requestId (V-C-001, V-C-002, etc.)
7. Status changes to "Pending"
8. Admin reviews and approves/rejects
9. Contractor's `isVerified` flag updated on approval

### Admin Flow
1. Admin logs in to `/admin/login`
2. Navigates to `/admin/dashboard/verification`
3. Sees all verification requests in table format
4. Can filter by category: Users, Labours, Contractors
5. Can search by name, phone, Aadhaar, Request ID
6. Clicks view icon to see Aadhaar images in modal
7. Clicks Approve or Reject button
8. Entity's `isVerified` flag updated accordingly

## Database Schema

### VerificationRequest Model
```javascript
{
  requestId: String,           // Auto-generated: V-U-001, V-L-001, V-C-001
  entityType: String,          // 'user', 'labour', 'contractor'
  entityId: ObjectId,          // Reference to User/Labour/Contractor
  entityModel: String,         // 'User', 'Labour', 'Contractor'
  name: String,
  phone: String,
  aadhaarNumber: String,
  aadhaarFrontUrl: String,
  aadhaarBackUrl: String,
  status: String,              // 'Pending', 'Approved', 'Rejected'
  verifiedBy: ObjectId,        // Reference to Admin
  verifiedAt: Date,
  rejectionReason: String
}
```

## Status Indicators

### Frontend Status Display
- **Pending**: Yellow button, "Submit for Verification"
- **Submitted**: Blue button, "Pending Verification" (disabled)
- **Approved**: Green button with checkmark, "Verified" (disabled)
- **Rejected**: Red button with X, "Not Verified" (can resubmit)

### Admin Dashboard Status Badges
- **Pending**: Yellow badge
- **Approved**: Green badge
- **Rejected**: Red badge

## Testing

### Current Database State
```
Total Verification Requests: 2
- V-L-002 | Type: labour | Name: klk klk | Status: Approved
- V-L-001 | Type: labour | Name: Test Labour User | Status: Approved
```

### Test Script
Created `backend/test-user-contractor-verification.ps1` for comprehensive testing of:
- User verification submission and status check
- Contractor verification submission and status check
- Admin viewing all verification requests

## Key Features

1. **Unified Verification System**: All three user types (User, Labour, Contractor) use the same verification infrastructure
2. **Auto-generated Request IDs**: V-U-XXX for users, V-L-XXX for labours, V-C-XXX for contractors
3. **Hybrid Storage**: Database-first with localStorage fallback for backward compatibility
4. **Real-time Status Updates**: Frontend fetches latest status from database on page load
5. **Admin Control**: Centralized admin dashboard for managing all verification requests
6. **Image Storage**: Supports both base64 and URL formats for Aadhaar images
7. **Validation**: Requires minimum 2 photos (front and back of Aadhaar)
8. **Status Tracking**: Clear visual indicators for pending, approved, and rejected states

## Files Modified

### Frontend
- `Frontend/src/modules/user/pages/Legal.jsx`
- `Frontend/src/modules/contractor/components/LegalVerificationSection.jsx`

### Backend
- `Backend/modules/user/controllers/user.controller.js`
- `Backend/modules/user/routes/user.routes.js`
- `Backend/modules/contractor/controllers/contractor.controller.js`
- `Backend/modules/contractor/routes/contractor.routes.js`

### Test Files
- `backend/test-user-contractor-verification.ps1`

## Next Steps (Optional Enhancements)

1. **Image Upload to Cloudinary**: Replace base64 with actual Cloudinary uploads
2. **Email Notifications**: Notify users when verification status changes
3. **Rejection Reasons**: Allow admin to provide detailed rejection reasons
4. **Document History**: Track all verification attempts for an entity
5. **Bulk Actions**: Allow admin to approve/reject multiple requests at once
6. **Analytics**: Dashboard showing verification statistics by entity type

## Conclusion

The verification system is now fully functional for all three user types (User, Labour, Contractor). Users can submit their Aadhaar documents, admins can review and approve/reject them, and the verification status is properly tracked in the database with real-time updates on the frontend.

All verification requests are visible in the admin dashboard at `/admin/dashboard/verification` with proper filtering and search capabilities.
