# 🧪 Testing Steps - Login & Registration

## ✅ Current Status:
- **Backend**: Running on http://localhost:5000 ✅
- **Frontend**: Running on http://localhost:5174 ✅
- **Database**: MongoDB connected ✅
- **Integration**: Complete ✅

## 📝 Step-by-Step Testing:

### 1. Open Frontend
Open browser and go to: **http://localhost:5174**

### 2. Start Login Flow
- Click on "Get Started" button
- You'll see the mobile number input page

### 3. Enter Mobile Number
- Enter any 10-digit mobile number (e.g., **9876543210**)
- Click "Continue"
- **What happens**: 
  - API call to `POST /api/auth/login`
  - User created/found in database
  - Tokens saved in localStorage
  - Success toast message appears
  - Navigates to OTP page

### 4. Enter OTP (Dummy)
- Enter any 4 digits (e.g., **1234**)
- Click "Enter"
- **What happens**:
  - Just UI flow (no API call)
  - Navigates to Complete Profile page

### 5. Fill Complete Profile
Fill the form:
- **First Name**: John
- **Last Name**: Doe
- **Gender**: Male
- **Date of Birth**: 01/01/1990
- **City**: Mumbai (optional)
- **State**: Maharashtra (optional)
- **Address**: 123 Street (optional)
- **Aadhar Number**: 123456789012 (optional)
- **User Type**: Select one (User/Contractor/Labour)

### 6. Submit Profile
- Click "Continue"
- **What happens**:
  - API call to `POST /api/auth/register`
  - Profile data saved in MongoDB
  - Tokens updated
  - Success toast message
  - Navigates to dashboard based on user type

## 🔍 Verify Data in Database:

### Option 1: MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `rajghar`
4. Check collections:
   - `users` - You'll see your user data
   - `contractors` - If you selected Contractor type
   - `labours` - If you selected Labour type

### Option 2: Backend Logs
Watch the terminal where backend is running. You'll see:
```
POST /api/auth/login 200
POST /api/auth/register 200
```

### Option 3: Browser DevTools
1. Press F12 to open DevTools
2. Go to **Network** tab
3. You'll see API calls:
   - `login` - Status 200
   - `register` - Status 200
4. Go to **Application** tab → **Local Storage**
5. You'll see:
   - `access_token`
   - `refresh_token`
   - `mobile_number`
   - `user_data`
   - `user_type`

## 📊 Expected Database Structure:

### Users Collection:
```json
{
  "_id": "ObjectId",
  "mobileNumber": "9876543210",
  "userType": "User",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "dob": "1990-01-01T00:00:00.000Z",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Street",
  "aadharNumber": "123456789012",
  "profileImage": null,
  "isVerified": true,
  "isActive": true,
  "createdAt": "2024-...",
  "updatedAt": "2024-..."
}
```

## 🎯 Test Different User Types:

### Test 1: Regular User
- Mobile: 9876543210
- User Type: **User**
- Result: Data in `users` collection only

### Test 2: Contractor
- Mobile: 9876543211
- User Type: **Contractor**
- Result: Data in `users` + `contractors` collections

### Test 3: Labour
- Mobile: 9876543212
- User Type: **Labour**
- Result: Data in `users` + `labours` collections

## ⚠️ Common Issues & Solutions:

### Issue 1: "Network Error"
- **Solution**: Check if backend is running on port 5000

### Issue 2: "CORS Error"
- **Solution**: Backend CORS is configured for ports 5173 and 5174

### Issue 3: "Token not found"
- **Solution**: Complete login flow first before registration

### Issue 4: "Validation Error"
- **Solution**: Fill all required fields (marked with *)

## 🎉 Success Indicators:

✅ Toast message: "Login successful!"
✅ Toast message: "Profile completed successfully!"
✅ Data visible in MongoDB
✅ Tokens stored in localStorage
✅ Redirected to appropriate dashboard

---

**Ready to test!** 🚀
