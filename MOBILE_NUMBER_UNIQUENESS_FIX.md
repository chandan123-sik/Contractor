# Mobile Number Uniqueness Fix

## समस्या (Problem)

पहले जब कोई User mobile number `9999999999` से register करता था, और फिर कोई Labour या Contractor उसी mobile number से login करने की कोशिश करता था, तो वो User के panel में चला जाता था। ये एक serious security और data integrity issue था।

**Example:**
1. User A registers with `9999999999` as "User"
2. Labour B tries to register with `9999999999` as "Labour"
3. Labour B gets logged into User A's account ❌

## समाधान (Solution)

अब mobile number को user type के साथ validate किया जाता है। अगर कोई mobile number पहले से किसी दूसरे user type के साथ registered है, तो error show होगा।

### Changes Made

#### 1. Backend Changes

**File: `backend/controllers/auth.controller.js`**

```javascript
export const login = async (req, res, next) => {
    const { mobileNumber, requestedUserType } = req.body;
    
    let user = await User.findOne({ mobileNumber });
    
    // Check if user exists with different user type
    if (user.userType && requestedUserType && user.userType !== requestedUserType) {
        return res.status(409).json({
            success: false,
            message: `This mobile number is already registered as ${user.userType}. Please use a different number or login with the correct user type.`,
            existingUserType: user.userType
        });
    }
    
    // ... rest of the code
}
```

**Key Points:**
- Added `requestedUserType` parameter to login API
- Validates if mobile number is already registered with different user type
- Returns HTTP 409 (Conflict) status with clear error message
- Includes `existingUserType` in response for frontend to handle

#### 2. Frontend Changes

**File: `Frontend/src/modules/auth/pages/MobileInput.jsx`**

**Changes:**
1. Added user type selection UI (User/Labour/Contractor)
2. Added validation before navigating to OTP page
3. Shows error if mobile number is already registered with different user type

```javascript
const handleContinue = async () => {
    // Check if mobile number is already registered with different user type
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mobileNumber: phoneNumber,
            requestedUserType: selectedUserType
        })
    });
    
    const data = await response.json();
    
    if (!data.success && data.existingUserType) {
        toast.error(`This number is already registered as ${data.existingUserType}`);
        return;
    }
    
    // Proceed to OTP verification
    navigate('/otp-verify', { state: { phoneNumber, selectedUserType } });
}
```

**File: `Frontend/src/modules/auth/pages/OTPVerification.jsx`**

**Changes:**
1. Receives `selectedUserType` from previous page
2. Passes it to login API
3. Validates response and shows error if user type mismatch
4. Redirects to correct panel based on user type

**File: `Frontend/src/modules/auth/pages/CompleteProfile.jsx`**

**Changes:**
1. Receives `selectedUserType` from previous page
2. Pre-fills user type field (disabled, cannot be changed)
3. Shows message that user type was selected during registration

### User Flow

```
1. User opens app
   ↓
2. Selects user type (User/Labour/Contractor)
   ↓
3. Enters mobile number
   ↓
4. System checks if mobile number is already registered
   ↓
   ├─ If registered with SAME user type → Proceed to OTP
   ├─ If registered with DIFFERENT user type → Show error ❌
   └─ If NEW number → Proceed to OTP
   ↓
5. Enter OTP (1234 for testing)
   ↓
6. Complete profile
   ↓
7. Redirect to appropriate panel
```

## Testing

### Manual Testing Steps

1. **Test Case 1: New User Registration**
   - Select "User" type
   - Enter mobile: `9999999999`
   - Enter OTP: `1234`
   - Complete profile
   - ✅ Should create User account

2. **Test Case 2: Labour tries same number**
   - Logout
   - Select "Labour" type
   - Enter mobile: `9999999999`
   - ❌ Should show error: "This number is already registered as User"

3. **Test Case 3: Contractor tries same number**
   - Select "Contractor" type
   - Enter mobile: `9999999999`
   - ❌ Should show error: "This number is already registered as User"

4. **Test Case 4: Labour with different number**
   - Select "Labour" type
   - Enter mobile: `8888888888`
   - Enter OTP: `1234`
   - Complete profile
   - ✅ Should create Labour account

### Automated Testing

Run the test script:
```bash
node backend/test-mobile-uniqueness.js
```

## API Changes

### Login API

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "mobileNumber": "9999999999",
  "requestedUserType": "Labour"  // NEW: User/Labour/Contractor
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "mobileNumber": "9999999999",
      "userType": "User",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

**Error Response (409 - Conflict):**
```json
{
  "success": false,
  "message": "This mobile number is already registered as User. Please use a different number or login with the correct user type.",
  "existingUserType": "User"
}
```

## Security Benefits

1. ✅ **Data Isolation**: Each user type has separate data and cannot access other user type's data
2. ✅ **Account Protection**: Prevents accidental or malicious access to wrong account
3. ✅ **Clear Error Messages**: Users know exactly what went wrong
4. ✅ **Early Validation**: Checks happen before OTP verification, saving time

## Database Schema

Mobile number remains unique in User model:

```javascript
mobileNumber: {
    type: String,
    required: true,
    unique: true,  // Ensures one mobile = one account
    match: /^[0-9]{10}$/
}

userType: {
    type: String,
    enum: ['User', 'Labour', 'Contractor'],
    default: null
}
```

## Future Enhancements

1. **Account Type Migration**: Allow users to upgrade/change their account type
2. **Multi-role Support**: Allow one mobile number to have multiple roles
3. **Phone Number Verification**: Add actual SMS OTP verification
4. **Account Recovery**: Add forgot password/account recovery flow

## Notes

- Mobile number format: 10 digits (Indian format)
- OTP for testing: `1234`
- User type is set during registration and cannot be changed later
- Each mobile number can only be associated with ONE user type

---

**Fixed by:** Kiro AI Assistant  
**Date:** 2026-02-13  
**Issue:** Mobile number uniqueness across user types
