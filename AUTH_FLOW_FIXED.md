# Authentication Flow - FIXED ✅

## User Request
OTP fill karne ke baad CompleteProfile page aana chahiye, aur wahan se user type ke basis pe specific forms fill karwane hain, phir main page pe bhejein.

## Complete Flow

### 1. Mobile Input (`/mobile-login`)
- User enters mobile number
- Clicks "Send OTP"
- Navigates to → `/otp-verify`

### 2. OTP Verification (`/otp-verify`)
- User enters OTP
- Backend validates and returns tokens
- **ALWAYS navigates to → `/complete-profile`**
- No longer checks if profile is complete
- Stores: `access_token`, `refresh_token`, `mobile_number`, `user_id`, `user_type`

**Code Change:**
```javascript
// Before (WRONG - was checking profile completion)
if (data.data.user.firstName && data.data.user.lastName) {
    // Redirect to home based on user type
    navigate('/user/home'); // or /labour/home or /contractor/home
} else {
    navigate('/complete-profile');
}

// After (CORRECT - always go to complete profile)
// Always go to complete profile page after OTP verification
navigate('/complete-profile');
```

### 3. Complete Profile (`/complete-profile`)
- User fills basic details:
  - First Name, Middle Name, Last Name
  - Gender, DOB
  - City, State, Address
  - Profile Image
  - **User Type Selection** (User/Labour/Contractor)
- Saves to database via `PUT /api/users/profile`
- Saves to localStorage

**Navigation based on User Type:**

#### A. If User Type = "User"
```javascript
navigate('/user/home');
```
- Directly goes to User Home page
- No additional form needed

#### B. If User Type = "Labour"
```javascript
navigate('/labour/details');
```
- Goes to Labour Details form
- User fills labour-specific details:
  - Skill Type (Mason, Painter, etc.)
  - Experience
  - Work Photos
  - Previous Work Location
  - Rating
  - Availability
- Saves to database via `POST /api/labour/create-profile`
- After submission → navigates to `/labour/find-user` (main page)

#### C. If User Type = "Contractor"
```javascript
navigate('/contractor/business-details');
```
- Goes to Business Details form
- User fills contractor-specific details:
  - Business Type (Proprietorship, Partnership, etc.)
  - Business Name
  - City, State
  - Address Line 1, Address Line 2
  - Landmark
- Saves to database via `PUT /api/contractor/business-details`
- After submission → navigates to `/contractor/hire-workers` (main page)

## Flow Diagram

```
Mobile Input (/mobile-login)
    ↓
OTP Verification (/otp-verify)
    ↓
Complete Profile (/complete-profile)
    ↓
    ├─→ User Type = "User"
    │       ↓
    │   User Home (/user/home) ✅ DONE
    │
    ├─→ User Type = "Labour"
    │       ↓
    │   Labour Details Form (/labour/details)
    │       ↓
    │   Labour Main Page (/labour/find-user) ✅ DONE
    │
    └─→ User Type = "Contractor"
            ↓
        Business Details Form (/contractor/business-details)
            ↓
        Contractor Main Page (/contractor/hire-workers) ✅ DONE
```

## Routes Added

### Labour Home Route
```javascript
<Route path="/labour/home" element={<LabourDashboard />} />
```
- Added to handle any direct navigation to `/labour/home`
- Uses same component as `/labour/hire-workers`

## Files Modified

### 1. `Frontend/src/modules/auth/pages/OTPVerification.jsx`
**Change:** Removed profile completion check, always navigate to `/complete-profile`

```javascript
// After successful OTP verification
if (data.success) {
    // Store tokens
    localStorage.setItem('access_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);
    localStorage.setItem('mobile_number', phoneNumber);
    localStorage.setItem('user_id', data.data.user._id);
    localStorage.setItem('user_type', data.data.user.userType);

    // Always go to complete profile page
    navigate('/complete-profile');
}
```

### 2. `Frontend/src/routes/AppRoutes.jsx`
**Change:** Added `/labour/home` route

```javascript
{/* Labour Module Routes */}
<Route path="/labour/home" element={<LabourDashboard />} />
<Route path="/labour/details" element={<LabourDetails />} />
<Route path="/labour/hire-workers" element={<LabourDashboard />} />
```

## Existing Navigation (Already Correct)

### CompleteProfile.jsx
```javascript
if (formData.userType === 'User') {
    navigate('/user/home');
} else if (formData.userType === 'Contractor') {
    navigate('/contractor/business-details');
} else if (formData.userType === 'Labour') {
    navigate('/labour/details');
}
```

### LabourDetails.jsx
```javascript
// After successful profile save
navigate('/labour/find-user');
```

### BusinessDetails.jsx
```javascript
// After successful business details save
navigate('/contractor/hire-workers');
```

## Testing Steps

1. **Start Flow:**
   - Go to `/mobile-login`
   - Enter mobile: `9876543210`
   - Click "Send OTP"

2. **Verify OTP:**
   - Enter OTP: `123456`
   - Click "Verify"
   - Should navigate to `/complete-profile` ✅

3. **Test User Type = "User":**
   - Fill basic details
   - Select "User" as user type
   - Submit
   - Should navigate to `/user/home` ✅

4. **Test User Type = "Labour":**
   - Fill basic details
   - Select "Labour" as user type
   - Submit
   - Should navigate to `/labour/details` ✅
   - Fill labour details form
   - Submit
   - Should navigate to `/labour/find-user` ✅

5. **Test User Type = "Contractor":**
   - Fill basic details
   - Select "Contractor" as user type
   - Submit
   - Should navigate to `/contractor/business-details` ✅
   - Fill business details form
   - Submit
   - Should navigate to `/contractor/hire-workers` ✅

## Key Points

1. **Always CompleteProfile First:** OTP verification always goes to complete profile, no shortcuts
2. **User Type Determines Next Step:** Based on selection, user goes to appropriate form or home
3. **Additional Forms for Labour/Contractor:** They need to fill role-specific details before accessing main page
4. **Database Integration:** All forms save to database with proper API calls
5. **localStorage Backup:** Data also saved to localStorage for offline access

## Status: ✅ COMPLETE

Authentication flow ab sahi hai - OTP ke baad CompleteProfile, phir user type ke basis pe specific forms, aur finally main page!
