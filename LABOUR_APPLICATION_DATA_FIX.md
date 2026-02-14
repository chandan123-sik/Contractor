# Labour Application Data Fix

## समस्या (Problem)

Contractor panel के "Workers Request" page में labour का:
- Name: "null null" show ho raha tha
- Location: "Not specified" show ho raha tha

![Problem Screenshot](Screenshot showing null null and Not specified)

## Root Cause Analysis

### Data Flow:

```
Labour Registration
    ↓
CompleteProfile.jsx sends data
    ↓
POST /api/labour/create-profile
    ↓
Labour Controller creates Labour profile
    ↓
❌ PROBLEM: User model में firstName, lastName update nahi ho rahe the
    ↓
Labour applies to Contractor Job
    ↓
Contractor checks applications
    ↓
Backend populates: app.labour.user.firstName
    ↓
❌ RESULT: null (because User model wasn't updated)
```

### Code Analysis:

**Backend: `contractor.controller.js` - Line 927**
```javascript
labourName: `${app.labour.user.firstName} ${app.labour.user.lastName}`,
location: app.labour.user.city || 'Not specified',
```

Ye code **User model** se data le raha hai, Labour model se nahi.

**Backend: `labour.controller.js` - Original Code (Line 48)**
```javascript
// Only set userType in User model, not other fields
const user = await User.findById(userId);
if (user && !user.userType) {
    user.userType = 'Labour';
    await user.save();
    // ❌ firstName, lastName update nahi ho rahe
}
```

## Solution

Labour profile create/update karte time **User model** ko bhi update karna hoga.

### Changes Made

**File: `backend/modules/labour/controllers/labour.controller.js`**

#### Change 1: Initial Profile Creation
```javascript
// ✅ NEW CODE - Update User model with personal details
const user = await User.findById(userId);
if (user) {
    if (firstName) user.firstName = firstName;
    if (middleName) user.middleName = middleName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (state) user.state = state;
    if (!user.userType) user.userType = 'Labour';
    
    await user.save();
    console.log('✅ User model updated with personal details');
}
```

#### Change 2: Existing Profile Update
```javascript
// ✅ NEW CODE - Update User model when updating existing profile
const user = await User.findById(userId);
if (user) {
    if (firstName) user.firstName = firstName;
    if (middleName) user.middleName = middleName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (state) user.state = state;
    await user.save();
}
```

#### Change 3: New Profile Creation
```javascript
// ✅ NEW CODE - Update User model before creating Labour profile
const userToUpdate = await User.findById(userId);
if (userToUpdate) {
    if (firstName) userToUpdate.firstName = firstName;
    if (middleName) userToUpdate.middleName = middleName;
    if (lastName) userToUpdate.lastName = lastName;
    if (gender) userToUpdate.gender = gender;
    if (city) userToUpdate.city = city;
    if (state) userToUpdate.state = state;
    await userToUpdate.save();
}
```

## Data Storage Strategy

### User Model (Primary)
Stores basic user information that's common across all user types:
- firstName
- lastName
- middleName
- gender
- city
- state
- mobileNumber
- userType

### Labour Model (Extended)
Stores labour-specific information:
- Reference to User model
- Duplicate of firstName, lastName (for Labour-specific queries)
- skillType
- experience
- workPhotos
- previousWorkLocation
- availability
- rating
- labourCardDetails

### Why Duplicate Data?

1. **Performance**: Labour-specific queries don't need to join User table
2. **Flexibility**: Labour can have different display name than User
3. **Consistency**: Both models have the data for different use cases

## Fixed Data Flow

```
Labour Registration
    ↓
CompleteProfile.jsx sends:
{
  firstName: "Ramesh",
  lastName: "Kumar",
  city: "Mumbai",
  skillType: "Plumber"
}
    ↓
POST /api/labour/create-profile
    ↓
Labour Controller:
  1. ✅ Updates User model (firstName, lastName, city)
  2. ✅ Creates Labour profile (all fields)
    ↓
Labour applies to Contractor Job
    ↓
Contractor checks applications
    ↓
Backend populates: app.labour.user.firstName
    ↓
✅ RESULT: "Ramesh" (from User model)
    ↓
Frontend displays: "Ramesh Kumar" from "Mumbai"
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId("..."),
  mobileNumber: "7777777777",
  userType: "Labour",
  firstName: "Ramesh",      // ✅ Now updated
  lastName: "Kumar",        // ✅ Now updated
  city: "Mumbai",           // ✅ Now updated
  state: "Maharashtra"
}
```

### Labour Collection
```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."),    // Reference to User
  firstName: "Ramesh",      // Duplicate for Labour queries
  lastName: "Kumar",
  city: "Mumbai",
  skillType: "Plumber",
  experience: "5 years"
}
```

### ContractorJob Collection
```javascript
{
  _id: ObjectId("..."),
  applications: [
    {
      _id: ObjectId("..."),
      labour: ObjectId("..."),  // Reference to Labour
      status: "Pending",
      appliedAt: Date
    }
  ]
}
```

## Testing

### Manual Testing Steps

1. **Create Labour Account**
   ```
   - Open app
   - Select "Labour" type
   - Enter mobile: 7777777777
   - Enter OTP: 1234
   - Fill profile:
     * First Name: Ramesh
     * Last Name: Kumar
     * City: Mumbai
     * Skill: Plumber
   - Submit
   ```

2. **Create Contractor Job**
   ```
   - Login as contractor
   - Create a job posting
   - Set skill: Plumber
   ```

3. **Apply to Job**
   ```
   - Login as labour (7777777777)
   - Browse contractor jobs
   - Apply to the Plumber job
   ```

4. **Verify in Contractor Panel**
   ```
   - Login as contractor
   - Go to "Workers Request"
   - ✅ Should show:
     * Name: Ramesh Kumar (not "null null")
     * Location: Mumbai (not "Not specified")
     * Phone: 7777777777
     * Skill: Plumber
     * Experience: 5 years
   ```

### Automated Testing

```bash
node backend/test-labour-application-data.js
```

## Frontend Display

**File: `Frontend/src/modules/contractor/pages/WorkersRequest.jsx`**

The frontend expects this data structure:
```javascript
{
  _id: "...",
  labourName: "Ramesh Kumar",      // From User.firstName + User.lastName
  location: "Mumbai",               // From User.city
  phoneNumber: "7777777777",        // From User.mobileNumber
  skillType: "Plumber",             // From Labour.skillType
  experience: "5 years",            // From Labour.experience
  jobTitle: "Plumber - Indore",
  appliedAt: Date
}
```

## Impact on Existing Data

### For New Labour Registrations
✅ Will work perfectly - User model will be updated

### For Existing Labour Accounts
⚠️ May still show "null null" if they registered before this fix

**Solution for Existing Data:**
Run a migration script to update User model from Labour model:

```javascript
// Migration script (to be created if needed)
const labours = await Labour.find().populate('user');
for (const labour of labours) {
  if (labour.user && !labour.user.firstName) {
    labour.user.firstName = labour.firstName;
    labour.user.lastName = labour.lastName;
    labour.user.city = labour.city;
    await labour.user.save();
  }
}
```

## Benefits

1. ✅ Contractor sees correct labour name
2. ✅ Contractor sees correct labour location
3. ✅ Better user experience
4. ✅ Data consistency across models
5. ✅ No frontend changes needed

## Related Files

### Backend
- `backend/modules/labour/controllers/labour.controller.js` - Fixed
- `backend/modules/contractor/controllers/contractor.controller.js` - No changes needed
- `backend/modules/user/models/User.model.js` - Schema unchanged
- `backend/modules/labour/models/Labour.model.js` - Schema unchanged

### Frontend
- `Frontend/src/modules/contractor/pages/WorkersRequest.jsx` - No changes needed
- `Frontend/src/modules/auth/pages/CompleteProfile.jsx` - Already sending correct data

## Verification Checklist

- [ ] Labour can register with name and city
- [ ] User model stores firstName, lastName, city
- [ ] Labour model stores firstName, lastName, city
- [ ] Labour can apply to contractor jobs
- [ ] Contractor sees correct labour name (not "null null")
- [ ] Contractor sees correct location (not "Not specified")
- [ ] Phone number displays correctly
- [ ] Skill type displays correctly
- [ ] Experience displays correctly

---

**Status:** ✅ Fixed  
**Date:** 13 February 2026  
**Issue:** Labour name and location showing as null in contractor panel  
**Solution:** Update User model when creating/updating Labour profile
