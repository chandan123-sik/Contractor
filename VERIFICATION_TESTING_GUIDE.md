# Verification System Testing Guide

## Current Status

✅ Backend API endpoints are working correctly
✅ Admin dashboard can display all verification types
❌ User and Contractor verifications not showing because they haven't been submitted yet

## Database Check Results

```
Total Requests: 2
Breakdown by Entity Type:
  labour: 2

All Requests:
- V-L-002 | labour | klk klk | Approved
- V-L-001 | labour | Test Labour User | Approved
```

## How to Test User Verification

### Step 1: Login as User
1. Open frontend at `http://localhost:5173`
2. Click "Login" or go to `/auth/mobile-input`
3. Enter a mobile number (e.g., `9999999999`)
4. Enter OTP (check backend console for OTP)
5. Complete profile:
   - First Name: Test
   - Last Name: User
   - User Type: **User**
   - City: Mumbai
   - State: Maharashtra

### Step 2: Navigate to Legal Verification
1. After login, go to User Home
2. Click on Settings or Profile
3. Find "Legal Verification" option
4. Or directly navigate to `/user/legal`

### Step 3: Submit Verification
1. You should see your Aadhaar number (if provided during registration)
2. Click "Upload Document Photos"
3. Upload **2 images** (front and back of Aadhaar)
   - Minimum 2 photos required
4. Click "Submit for Verification"
5. You should see success message: "Submitted for verification! Admin will review your documents."

### Step 4: Check Admin Dashboard
1. Logout from user account
2. Go to `/admin/login`
3. Login with:
   - Username: `admin`
   - Password: `admin123`
4. Navigate to `/admin/dashboard/verification`
5. Click on "Users" tab
6. You should see your verification request

## How to Test Contractor Verification

### Step 1: Login as Contractor
1. Open frontend at `http://localhost:5173`
2. Click "Login" or go to `/auth/mobile-input`
3. Enter a different mobile number (e.g., `8888888888`)
4. Enter OTP (check backend console for OTP)
5. Complete profile:
   - First Name: Test
   - Last Name: Contractor
   - User Type: **Contractor**
   - City: Delhi
   - State: Delhi

### Step 2: Complete Business Details
1. After selecting Contractor, you'll be redirected to `/contractor/business-details`
2. Fill in:
   - Business Type: Proprietorship
   - Business Name: Test Construction Co
   - City: Delhi
   - State: Delhi
3. Submit

### Step 3: Navigate to Legal Verification
1. Go to Contractor Home
2. Click on Settings or Profile
3. Find "Legal Verification" option
4. Or directly navigate to `/contractor/legal`

### Step 4: Submit Verification
1. You should see your Aadhaar number (if provided during registration)
2. Click "Upload Document Photos"
3. Upload **2 images** (front and back of Aadhaar)
   - Minimum 2 photos required
4. Click "Submit for Verification"
5. You should see success message: "Submitted for verification! Admin will review your documents."

### Step 5: Check Admin Dashboard
1. Logout from contractor account
2. Go to `/admin/login`
3. Login with admin credentials
4. Navigate to `/admin/dashboard/verification`
5. Click on "Contractors" tab
6. You should see your verification request

## Common Issues and Solutions

### Issue 1: "Please login first" error
**Solution**: Make sure you're logged in and have a valid `access_token` in localStorage

### Issue 2: "Please upload at least 2 documents" error
**Solution**: Upload both front and back images of Aadhaar card

### Issue 3: "Contractor profile not found" error
**Solution**: Complete the business details form first at `/contractor/business-details`

### Issue 4: Verification not showing in admin dashboard
**Possible Causes**:
1. Submission failed (check browser console for errors)
2. Wrong category tab selected (check Users/Labours/Contractors tabs)
3. Backend server not running
4. Database connection issue

## API Endpoints Reference

### User Verification
```
POST /api/admin/verification/submit
Headers: Authorization: Bearer <user_token>
Body: {
  "entityType": "user",
  "name": "User Name",
  "phone": "9999999999",
  "aadhaarNumber": "123456789012",
  "aadhaarFrontUrl": "base64_or_url",
  "aadhaarBackUrl": "base64_or_url"
}
```

### Contractor Verification
```
POST /api/admin/verification/submit
Headers: Authorization: Bearer <contractor_token>
Body: {
  "entityType": "contractor",
  "name": "Contractor Name",
  "phone": "8888888888",
  "aadhaarNumber": "123456789012",
  "aadhaarFrontUrl": "base64_or_url",
  "aadhaarBackUrl": "base64_or_url"
}
```

### Check Verification Status (User)
```
GET /api/users/verification-status
Headers: Authorization: Bearer <user_token>
```

### Check Verification Status (Contractor)
```
GET /api/contractor/verification-status
Headers: Authorization: Bearer <contractor_token>
```

### Admin - Get All Requests
```
GET /api/admin/verification/requests
Headers: Authorization: Bearer <admin_token>
```

### Admin - Get Requests by Category
```
GET /api/admin/verification/requests?category=user
GET /api/admin/verification/requests?category=labour
GET /api/admin/verification/requests?category=contractor
Headers: Authorization: Bearer <admin_token>
```

### Admin - Approve Request
```
PUT /api/admin/verification/requests/:id/approve
Headers: Authorization: Bearer <admin_token>
```

### Admin - Reject Request
```
PUT /api/admin/verification/requests/:id/reject
Headers: Authorization: Bearer <admin_token>
Body: {
  "reason": "Documents not valid"
}
```

## Testing Scripts

### Check Current Database State
```powershell
cd backend
node check-verification-db.js
```

### Check via API
```powershell
cd backend
.\test-verification-simple.ps1
```

### Submit Test Verifications (requires tokens)
```powershell
cd backend
.\test-submit-verifications.ps1
```

## Expected Behavior

### Frontend (User/Contractor)
1. Page loads and fetches existing verification status
2. If no verification exists, status is "pending"
3. User uploads 2+ images
4. User clicks "Submit for Verification"
5. Loading state shows "Submitting..."
6. Success message appears
7. Status changes to "submitted" (Pending Verification)
8. Button becomes disabled and shows "Pending Verification"

### Frontend (Admin)
1. Admin logs in
2. Navigates to Verification Management
3. Sees three tabs: Users, Labours, Contractors
4. Clicks on appropriate tab
5. Sees list of verification requests
6. Can search by name, phone, Aadhaar, Request ID
7. Clicks view icon to see Aadhaar images
8. Clicks Approve or Reject button
9. Request status updates immediately

### Backend
1. Receives verification submission
2. Validates user is authenticated
3. For contractor, checks if contractor profile exists
4. Creates VerificationRequest with auto-generated requestId
5. Returns success response with requestId
6. Admin can fetch and filter requests
7. Admin can approve/reject requests
8. Entity's `isVerified` flag updates on approval

## Troubleshooting

### Check if backend is running
```powershell
curl http://localhost:5000/api/health
```

### Check if frontend can reach backend
Open browser console and check for CORS errors

### Check database connection
```powershell
cd backend
node check-verification-db.js
```

### Check backend logs
Look for console output showing:
- `📨 POST /api/admin/verification/submit`
- `🟢 ===== SUBMIT VERIFICATION REQUEST =====`
- `✅ Verification request created: V-U-001` or `V-C-001`

### Check frontend localStorage
Open DevTools -> Application -> Local Storage
- `access_token` should exist
- `user_profile` or `contractor_profile` should exist
- `adminToken` for admin (not `admin_token`)

## Success Criteria

✅ User can submit verification from `/user/legal`
✅ Contractor can submit verification from `/contractor/legal`
✅ Admin can see user requests in "Users" tab
✅ Admin can see contractor requests in "Contractors" tab
✅ Admin can view Aadhaar images in modal
✅ Admin can approve/reject requests
✅ User/Contractor sees updated status after admin action
✅ Database contains verification requests with correct entityType

## Next Steps After Testing

1. Test the complete flow from user registration to verification approval
2. Test rejection flow and resubmission
3. Test with actual image uploads (not base64)
4. Test with multiple users and contractors
5. Test search and filter functionality in admin dashboard
6. Test edge cases (missing data, invalid tokens, etc.)
