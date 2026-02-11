# Labour Verification System - COMPLETE ✅

## Task
Jab labour `/labour/legal-details` page se Aadhar number aur images upload kare, toh wo admin dashboard `/admin/dashboard/verification` page pe verification ke liye aana chahiye. Admin verify kare toh labour ko legal status dikhe aur data database me store ho.

## Implementation

### 1. Backend - Verification System

#### A. VerificationRequest Model (`backend/modules/admin/models/VerificationRequest.model.js`)
```javascript
{
    requestId: String (auto-generated: V-L-001, V-U-002, V-C-003),
    entityType: 'user' | 'labour' | 'contractor',
    entityId: ObjectId (ref to Labour/User/Contractor),
    entityModel: 'Labour' | 'User' | 'Contractor',
    name: String,
    phone: String,
    aadhaarNumber: String (12 digits),
    aadhaarFrontUrl: String (base64 or URL),
    aadhaarBackUrl: String (base64 or URL),
    status: 'Pending' | 'Approved' | 'Rejected',
    rejectionReason: String,
    verifiedBy: ObjectId (ref to Admin),
    verifiedAt: Date,
    trade: String (for labour),
    company: String (for contractor)
}
```

#### B. New Controller Method (`backend/modules/admin/controllers/verification.admin.controller.js`)
```javascript
export const submitVerificationRequest = async (req, res, next) => {
    // For labour/user/contractor to submit verification
    // Finds labour profile from user ID
    // Creates verification request with Pending status
    // Returns requestId
}
```

#### C. New Labour Controller Method (`Backend/modules/labour/controllers/labour.controller.js`)
```javascript
export const getLabourVerificationStatus = async (req, res, next) => {
    // Gets labour's verification status
    // Returns isVerified flag and latest verification request
}
```

#### D. Routes Added
```javascript
// Verification routes (backend/modules/admin/routes/verification.admin.routes.js)
POST /api/admin/verification/submit (protected - user auth)
GET /api/admin/verification/requests (protected - admin auth)
GET /api/admin/verification/requests/:id (protected - admin auth)
PUT /api/admin/verification/requests/:id/approve (protected - admin auth)
PUT /api/admin/verification/requests/:id/reject (protected - admin auth)

// Labour routes (Backend/modules/labour/routes/labour.routes.js)
GET /api/labour/verification-status (protected - user auth)
```

### 2. Frontend - Labour Legal Details Page

#### A. Updated LabourLegalDetails (`Frontend/src/modules/labour/pages/LabourLegalDetails.jsx`)

**Features Added:**
1. **Fetch Verification Status on Load**
   - Calls `GET /api/labour/verification-status`
   - Updates UI based on database status
   - Syncs with localStorage

2. **Submit to Database**
   - Calls `POST /api/admin/verification/submit`
   - Requires at least 2 photos (front + back)
   - Stores requestId locally

3. **Status Display**
   - `pending` → Yellow button "Submit for Verification"
   - `submitted` → Blue button "Pending Verification" (disabled)
   - `verified` → Green button with checkmark "Verified" (disabled)
   - `rejected` → Red button with X "Not Verified" (can resubmit)

**Code Changes:**
```javascript
// Fetch status from database
const fetchVerificationStatus = async () => {
    const response = await fetch('/api/labour/verification-status', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.data.verificationRequest) {
        // Update status based on database
        if (request.status === 'Approved') setVerificationStatus('verified');
        else if (request.status === 'Rejected') setVerificationStatus('rejected');
        else if (request.status === 'Pending') setVerificationStatus('submitted');
    }
};

// Submit verification
const handleSubmitVerification = async () => {
    const response = await fetch('/api/admin/verification/submit', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            entityType: 'labour',
            name: `${firstName} ${lastName}`,
            phone: mobileNumber,
            aadhaarNumber: aadharNumber,
            aadhaarFrontUrl: uploadedPhotos[0],
            aadhaarBackUrl: uploadedPhotos[1],
            trade: skillType
        })
    });
    
    if (response.success) {
        setVerificationStatus('submitted');
        toast.success('Submitted for verification!');
    }
};
```

### 3. Admin Dashboard Integration

#### Verification Management Page
- Already exists at `/admin/dashboard/verification`
- Uses `VerificationManagement.jsx` component
- Fetches requests via `GET /api/admin/verification/requests`
- Can approve/reject via:
  - `PUT /api/admin/verification/requests/:id/approve`
  - `PUT /api/admin/verification/requests/:id/reject`

**When Admin Approves:**
1. Verification request status → `Approved`
2. Labour model `isVerified` → `true`
3. Labour model `aadharNumber` → saved
4. `verifiedBy` → admin ID
5. `verifiedAt` → current timestamp

**When Admin Rejects:**
1. Verification request status → `Rejected`
2. `rejectionReason` → saved
3. Labour can resubmit with correct documents

### 4. Complete Flow

```
Labour Side:
1. Labour goes to /labour/legal-details
2. Enters Aadhar number (from profile)
3. Uploads 2+ photos (front & back of Aadhar)
4. Clicks "Submit for Verification"
5. POST /api/admin/verification/submit
6. Status changes to "Pending Verification"
7. Request ID generated (e.g., V-L-001)

Admin Side:
1. Admin logs in to /admin/dashboard
2. Goes to Verification tab
3. Sees list of pending requests
4. Views labour details:
   - Name, Phone, Aadhar Number
   - Front & Back images
   - Trade/Skill
5. Clicks "Approve" or "Reject"
6. PUT /api/admin/verification/requests/:id/approve

Labour Side (After Approval):
1. Labour refreshes /labour/legal-details
2. GET /api/labour/verification-status
3. Status shows "Verified" with green checkmark
4. Documents cannot be removed
5. isVerified flag = true in database
```

### 5. Database Structure

**VerificationRequests Collection:**
```javascript
{
    _id: ObjectId,
    requestId: "V-L-001",
    entityType: "labour",
    entityId: ObjectId (Labour._id),
    entityModel: "Labour",
    name: "John Doe",
    phone: "9876543210",
    aadhaarNumber: "123456789012",
    aadhaarFrontUrl: "data:image/png;base64,...",
    aadhaarBackUrl: "data:image/png;base64,...",
    status: "Pending",
    trade: "Mason",
    createdAt: ISODate,
    updatedAt: ISODate
}
```

**Labour Model Updates:**
```javascript
{
    isVerified: true,  // Set when approved
    aadharNumber: "123456789012"  // Saved from verification
}
```

### 6. Testing Results

```
✅ Labour login successful
✅ Verification request submitted (Request ID: V-L-001)
✅ Verification status fetched (Status: Pending)
✅ Admin login successful
✅ Verification requests visible to admin
```

## Files Modified

### Backend
1. `backend/modules/admin/models/VerificationRequest.model.js`
   - Made requestId optional (auto-generated)

2. `backend/modules/admin/controllers/verification.admin.controller.js`
   - Added `submitVerificationRequest()` method

3. `backend/modules/admin/routes/verification.admin.routes.js`
   - Added `POST /submit` route (user auth)
   - Imported `protect` middleware

4. `Backend/modules/labour/controllers/labour.controller.js`
   - Added `getLabourVerificationStatus()` method

5. `Backend/modules/labour/routes/labour.routes.js`
   - Added `GET /verification-status` route

### Frontend
6. `Frontend/src/modules/labour/pages/LabourLegalDetails.jsx`
   - Added `fetchVerificationStatus()` function
   - Updated `handleSubmitVerification()` to call API
   - Added database sync on component mount
   - Minimum 2 photos required

### Testing
7. `backend/test-verification-flow.ps1`
   - Complete flow test script

## Key Features

1. **Database Integration**: All verification data stored in MongoDB
2. **Status Tracking**: Real-time status updates (Pending/Approved/Rejected)
3. **Request ID**: Auto-generated unique IDs (V-L-001, V-L-002, etc.)
4. **Admin Workflow**: Complete approval/rejection system
5. **Labour Feedback**: Visual status indicators with colors
6. **Hybrid System**: Works with database + localStorage fallback
7. **Security**: Protected routes with JWT authentication
8. **Validation**: Requires 12-digit Aadhar + 2 photos minimum

## Status: ✅ COMPLETE

Labour verification system ab fully functional hai - labour submit karta hai, admin verify karta hai, aur labour ko status dikhai deta hai!
