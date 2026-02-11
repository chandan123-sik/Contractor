# Simple Auth Flow Test ✅

## Current Flow (Updated)

### Step 1: Login with Any Number
- Enter any 10-digit mobile number (e.g., `9999999999`)
- Click Continue
- **Backend**: Login API creates temporary user in `users` collection if doesn't exist
- **Response**: Returns tokens + user data (userType will be `null` for new users)

### Step 2: Enter Any OTP
- Enter any 4-digit OTP (e.g., `1234`)
- Click Enter
- **Frontend**: Navigates to `/complete-profile`

### Step 3: Complete Profile
- Fill in personal details:
  - First Name, Last Name (required)
  - Gender, DOB (required)
  - City, State, Address (optional)
  - Aadhar Number (optional)
- Select User Type: **User**, **Labour**, or **Contractor**
- Click Continue
- **Backend**: Register API updates user in `users` collection with all details

### Step 4: User Type Specific Flow

#### If User Type = "User"
- Navigate to `/user/hire-workers`
- **Data Stored**: Only in `users` collection

#### If User Type = "Labour"
- Navigate to `/labour/details`
- Fill labour-specific details:
  - Skill Type (Plumber, Electrician, etc.)
  - Experience
  - Work Photos
  - Previous Work Location
  - Rating
  - Availability
- Click Continue
- **Backend**: updateWorkDetails API creates entry in `labours` collection
- **Data Stored**: 
  - Personal data in `users` collection
  - Work details in `labours` collection (linked via `user` field)

#### If User Type = "Contractor"
- Navigate to `/contractor/business-details`
- Fill business details
- **Data Stored**:
  - Personal data in `users` collection
  - Business details in `contractors` collection

## Database Collections

### 1. users Collection
Stores ALL users (User, Labour, Contractor)
```javascript
{
  _id: ObjectId,
  mobileNumber: "9999999999",
  userType: "Labour",  // or "User" or "Contractor"
  firstName: "John",
  lastName: "Doe",
  gender: "Male",
  dob: "1990-01-01",
  city: "Mumbai",
  state: "Maharashtra",
  address: "Test Address",
  aadharNumber: "123456789012",
  profilePhoto: null,
  refreshToken: "...",
  createdAt: Date,
  updatedAt: Date
}
```

### 2. labours Collection
Stores ONLY Labour-specific work details
```javascript
{
  _id: ObjectId,
  user: ObjectId,  // Reference to users collection
  skillType: "Plumber",
  experience: "5 years",
  workPhotos: ["base64..."],
  previousWorkLocation: "Mumbai",
  rating: 4.5,
  availability: "Full Time",
  hasLabourCard: false,
  isVerified: false,
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. contractors Collection
Stores ONLY Contractor-specific business details
```javascript
{
  _id: ObjectId,
  user: ObjectId,  // Reference to users collection
  businessName: "ABC Construction",
  gstNumber: "...",
  // ... other business fields
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Used

### 1. POST /api/auth/login
- **Input**: `{ mobileNumber: "9999999999" }`
- **Action**: 
  - Finds user by mobile number
  - If not found, creates temporary user with `userType: null`
  - Generates tokens
- **Output**: `{ success, data: { user, accessToken, refreshToken } }`

### 2. POST /api/auth/register
- **Input**: 
```javascript
{
  mobileNumber: "9999999999",
  userType: "Labour",
  firstName: "John",
  lastName: "Doe",
  gender: "Male",
  dob: "1990-01-01",
  city: "Mumbai",
  state: "Maharashtra",
  address: "Test Address",
  aadharNumber: "123456789012"
}
```
- **Action**: 
  - Updates user in `users` collection with all details
  - If userType is "Labour", creates empty entry in `labours` collection
  - If userType is "Contractor", creates empty entry in `contractors` collection
- **Output**: `{ success, data: { user, accessToken, refreshToken } }`

### 3. PUT /api/labour/work-details
- **Input**:
```javascript
{
  skillType: "Plumber",
  experience: "5 years",
  workPhotos: ["base64..."],
  previousWorkLocation: "Mumbai",
  rating: 4.5,
  availability: "Full Time"
}
```
- **Action**: Updates labour entry in `labours` collection
- **Output**: `{ success, data: { labour } }`

## Test Scenario

### Test 1: New User Registration
```
1. Mobile: 9999999999 → Login API → Creates temp user
2. OTP: 1234 → Navigate to CompleteProfile
3. Fill: John Doe, Male, 1990-01-01, User type: User
4. Register API → Updates users collection
5. Navigate to /user/hire-workers
```

**Expected Database State:**
- `users` collection: 1 document with userType="User"
- `labours` collection: 0 documents
- `contractors` collection: 0 documents

### Test 2: New Labour Registration
```
1. Mobile: 8888888888 → Login API → Creates temp user
2. OTP: 1234 → Navigate to CompleteProfile
3. Fill: Jane Smith, Female, 1995-05-15, User type: Labour
4. Register API → Updates users collection + creates empty labour entry
5. Navigate to /labour/details
6. Fill: Plumber, 5 years experience, etc.
7. updateWorkDetails API → Updates labours collection
8. Navigate to /labour/find-user
```

**Expected Database State:**
- `users` collection: 1 document with userType="Labour"
- `labours` collection: 1 document linked to user
- `contractors` collection: 0 documents

## Backend Changes Made

### 1. auth.controller.js - login()
- **Before**: Returned 404 if user not found
- **After**: Creates temporary user if not found

### 2. User.model.js
- **Before**: Required fields: userType, firstName, lastName, gender, dob
- **After**: All fields optional (default: null) - allows temporary user creation

## Status
✅ **COMPLETE** - Any mobile number can login, any OTP accepted, data stores correctly in database
