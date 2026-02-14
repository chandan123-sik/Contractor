# Mobile Number Uniqueness - Flow Diagram

## पहले की समस्या (Before Fix)

```
User A registers
Mobile: 9999999999
Type: User
     ↓
Database Entry:
{
  mobile: "9999999999",
  userType: "User",
  name: "User A"
}
     ↓
Labour B tries to login
Mobile: 9999999999
Type: Labour
     ↓
❌ PROBLEM: Labour B gets logged into User A's account!
```

## अब का Solution (After Fix)

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE INPUT PAGE                         │
│                                                              │
│  Select User Type:                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│  │  User   │  │ Labour  │  │Contractor│                    │
│  └─────────┘  └─────────┘  └─────────┘                    │
│                                                              │
│  Enter Mobile: [9999999999]                                 │
│                                                              │
│  [Continue] ──────────────────────────────────────────────┐ │
└──────────────────────────────────────────────────────────┼─┘
                                                            │
                                                            ↓
                                              ┌─────────────────────┐
                                              │  Backend Validation │
                                              │                     │
                                              │  Check Database:    │
                                              │  - Mobile exists?   │
                                              │  - User type match? │
                                              └─────────────────────┘
                                                            │
                        ┌───────────────────────────────────┼───────────────────────────────────┐
                        │                                   │                                   │
                        ↓                                   ↓                                   ↓
              ┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
              │   NEW NUMBER     │              │  SAME USER TYPE  │              │ DIFFERENT TYPE   │
              │                  │              │                  │              │                  │
              │ Mobile not found │              │ Mobile: 9999999  │              │ Mobile: 9999999  │
              │ in database      │              │ Type: User       │              │ Existing: User   │
              │                  │              │ Requested: User  │              │ Requested: Labour│
              └──────────────────┘              └──────────────────┘              └──────────────────┘
                        │                                   │                                   │
                        ↓                                   ↓                                   ↓
              ┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
              │  ✅ PROCEED      │              │  ✅ PROCEED      │              │  ❌ REJECT       │
              │                  │              │                  │              │                  │
              │ Create temp user │              │ Existing user    │              │ Show error:      │
              │ Go to OTP page   │              │ Go to OTP page   │              │ "Already         │
              │                  │              │                  │              │  registered as   │
              └──────────────────┘              └──────────────────┘              │  User"           │
                        │                                   │                     │                  │
                        │                                   │                     │ [Try Different   │
                        │                                   │                     │  Number]         │
                        │                                   │                     └──────────────────┘
                        │                                   │
                        └───────────────┬───────────────────┘
                                        │
                                        ↓
                        ┌───────────────────────────────┐
                        │      OTP VERIFICATION         │
                        │                               │
                        │  Enter OTP: [1234]           │
                        │                               │
                        │  [Verify] ───────────────────┤
                        └───────────────────────────────┘
                                        │
                                        ↓
                        ┌───────────────────────────────┐
                        │   COMPLETE PROFILE PAGE       │
                        │                               │
                        │  User Type: [User] (locked)  │
                        │  First Name: [____]          │
                        │  Last Name: [____]           │
                        │  Gender: [____]              │
                        │  DOB: [____]                 │
                        │                               │
                        │  [Continue] ─────────────────┤
                        └───────────────────────────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        │               │               │
                        ↓               ↓               ↓
              ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
              │  USER PANEL  │ │ LABOUR PANEL │ │CONTRACTOR    │
              │              │ │              │ │PANEL         │
              │  Dashboard   │ │  Dashboard   │ │  Dashboard   │
              └──────────────┘ └──────────────┘ └──────────────┘
```

## Database Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      USER COLLECTION                         │
├─────────────────────────────────────────────────────────────┤
│  _id          │ mobileNumber │ userType   │ firstName       │
├───────────────┼──────────────┼────────────┼─────────────────┤
│  507f1f77...  │ 9999999999   │ User       │ John            │
│  507f1f78...  │ 8888888888   │ Labour     │ Ram             │
│  507f1f79...  │ 7777777777   │ Contractor │ Shyam           │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │
                    UNIQUE CONSTRAINT
              (One mobile = One user type)
```

## API Request/Response Flow

### Scenario 1: New User Registration

```
REQUEST:
POST /api/auth/login
{
  "mobileNumber": "9999999999",
  "requestedUserType": "User"
}

↓

RESPONSE (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77...",
      "mobileNumber": "9999999999",
      "userType": null,  // Will be set during profile completion
      "firstName": null,
      "lastName": null
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Scenario 2: User Type Mismatch

```
REQUEST:
POST /api/auth/login
{
  "mobileNumber": "9999999999",  // Already registered as User
  "requestedUserType": "Labour"   // Trying to login as Labour
}

↓

RESPONSE (409 CONFLICT):
{
  "success": false,
  "message": "This mobile number is already registered as User. Please use a different number or login with the correct user type.",
  "existingUserType": "User"
}
```

### Scenario 3: Existing User Login

```
REQUEST:
POST /api/auth/login
{
  "mobileNumber": "9999999999",
  "requestedUserType": "User"  // Same as registered type
}

↓

RESPONSE (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77...",
      "mobileNumber": "9999999999",
      "userType": "User",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Mobile already registered with different type           │
│     → Show: "This number is already registered as [Type]"   │
│     → Action: User must use different number                │
│                                                              │
│  2. Invalid mobile number format                            │
│     → Show: "Please enter a valid 10-digit mobile number"   │
│     → Action: User must enter correct format                │
│                                                              │
│  3. Network error during validation                         │
│     → Show: "Connection error. Please try again."           │
│     → Action: User can retry                                │
│                                                              │
│  4. Invalid OTP                                             │
│     → Show: "Invalid OTP! Please enter 1234"                │
│     → Action: User must enter correct OTP                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Benefits

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Frontend Validation                               │
│  ├─ User type selection required                            │
│  ├─ Mobile format validation (10 digits)                    │
│  └─ Pre-OTP uniqueness check                                │
│                                                              │
│  Layer 2: Backend Validation                                │
│  ├─ Database uniqueness constraint                          │
│  ├─ User type matching validation                           │
│  └─ Token-based authentication                              │
│                                                              │
│  Layer 3: Profile Completion                                │
│  ├─ User type locked after selection                        │
│  ├─ Cannot change user type later                           │
│  └─ Separate panels for each user type                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Legend:**
- ✅ = Success/Allowed
- ❌ = Error/Blocked
- → = Flow direction
- ↓ = Next step
