# Database Migration Plan - Remove localStorage

## Current State
- User profiles stored in localStorage
- Jobs/Cards cached in localStorage
- CMS content in localStorage
- All data needs to come from database

## Strategy

### Keep in localStorage (Security/Performance)
1. ✅ `access_token` - JWT token for authentication
2. ✅ `refresh_token` - JWT refresh token
3. ✅ `mobile_number` - For quick reference
4. ✅ `adminAuth` - Admin authentication flag

### Remove from localStorage (Move to Database)
1. ❌ `user_data` → Fetch from `/api/user/profile`
2. ❌ `user_profile` → Fetch from `/api/user/profile`
3. ❌ `labour_profile` → Fetch from `/api/labour/profile`
4. ❌ `contractor_profile` → Fetch from `/api/contractor/profile`
5. ❌ `user_jobs` → Fetch from `/api/jobs/browse`
6. ❌ `contractor_jobs` → Fetch from `/api/contractor/jobs/browse`
7. ❌ `labour_cards` → Fetch from `/api/labour/browse`
8. ❌ `cmsContent` → Fetch from `/api/cms` (if exists)

## Implementation Steps

### Phase 1: User Profile APIs ✅ (Already exist)
- GET `/api/user/profile` - Get current user profile
- PUT `/api/user/profile` - Update user profile

### Phase 2: Labour Profile APIs ✅ (Already exist)
- GET `/api/labour/profile` - Get labour profile
- PUT `/api/labour/work-details` - Update labour work details

### Phase 3: Contractor Profile APIs ✅ (Already exist)
- GET `/api/contractor/profile` - Get contractor profile
- PUT `/api/contractor/business-details` - Update business details

### Phase 4: Browse APIs ✅ (Already exist)
- GET `/api/jobs/browse` - Browse all jobs
- GET `/api/contractor/jobs/browse` - Browse contractor jobs
- GET `/api/labour/browse` - Browse labour cards

### Phase 5: Frontend Changes (TO DO)

#### 1. Create useAuth Hook
```javascript
// hooks/useAuth.js
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    const response = await userAPI.getProfile();
    setUser(response.data.user);
    setLoading(false);
  };
  
  return { user, loading, refetch: fetchUserProfile };
};
```

#### 2. Update CompleteProfile.jsx
- Remove localStorage.setItem('user_profile')
- Remove localStorage.setItem('labour_profile')
- Remove localStorage.setItem('contractor_profile')
- Keep only tokens in localStorage

#### 3. Update BusinessDetails.jsx
- Remove localStorage.getItem('contractor_profile')
- Fetch from API: contractorAPI.getProfile()
- Remove localStorage.setItem after save

#### 4. Update LabourDetails.jsx
- Remove localStorage.getItem('labour_profile')
- Auto-fill from API response after registration

#### 5. Update FindUser.jsx (Contractor viewing User jobs)
- Remove localStorage.getItem('user_jobs')
- Remove localStorage.setItem('user_jobs')
- Always fetch from API: jobAPI.browseJobs()

#### 6. Update HireWorkers.jsx (User/Contractor viewing Labour cards)
- Remove localStorage.getItem('labour_cards')
- Remove localStorage.setItem('labour_cards')
- Always fetch from API: labourAPI.browseLabourCards()

#### 7. Update ContractorRequest.jsx (Labour viewing Contractor jobs)
- Remove localStorage.getItem('contractor_jobs')
- Remove localStorage.setItem('contractor_jobs')
- Always fetch from API: contractorJobAPI.browseJobs()

#### 8. Update ContactUs pages
- Remove localStorage.getItem('user_profile')
- Remove localStorage.getItem('labour_profile')
- Fetch from useAuth hook or API

#### 9. Update AboutUs pages
- Remove localStorage.getItem('cmsContent')
- Fetch from API (or hardcode if no CMS backend)

## Benefits
1. ✅ Single source of truth (Database)
2. ✅ Real-time data updates
3. ✅ No stale data issues
4. ✅ Multi-device sync
5. ✅ Better security

## Files to Modify
1. Frontend/src/modules/auth/pages/CompleteProfile.jsx
2. Frontend/src/modules/contractor/pages/BusinessDetails.jsx
3. Frontend/src/modules/labour/pages/LabourDetails.jsx
4. Frontend/src/modules/contractor/pages/FindUser.jsx
5. Frontend/src/modules/contractor/pages/HireWorkers.jsx
6. Frontend/src/modules/user/pages/HireWorkers.jsx
7. Frontend/src/modules/labour/pages/ContractorRequest.jsx
8. Frontend/src/modules/labour/pages/CreateLabourCard.jsx
9. Frontend/src/modules/user/pages/ContactUs.jsx
10. Frontend/src/modules/labour/pages/ContactUs.jsx
11. Frontend/src/modules/user/pages/AboutUs.jsx
12. Frontend/src/modules/labour/pages/AboutUs.jsx
13. Frontend/src/modules/contractor/components/AboutUsContent.jsx

## Priority Order
1. **HIGH**: Profile data (user_profile, labour_profile, contractor_profile)
2. **HIGH**: Jobs/Cards browsing (user_jobs, contractor_jobs, labour_cards)
3. **MEDIUM**: Contact forms auto-fill
4. **LOW**: CMS content (can be hardcoded)
