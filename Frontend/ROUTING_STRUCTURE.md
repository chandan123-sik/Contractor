# User Module - Routing Structure

## Complete Route Map

### Auth Routes
```
/ (root)                    → GetStarted
/mobile-login              → MobileInput
/otp-verify                → OTPVerification
/complete-profile          → CompleteProfile
```

### User Module Routes

#### Main Navigation (Bottom Nav)
```
/user/hire-workers         → HireWorkers (Home/Dashboard)
/user/find-contractor      → FindContractor
/user/requests             → Requests
/user/settings             → Settings
```

#### Request Sub-Routes
```
/user/contractor-request   → ContractorRequest (from Requests)
/user/workers-request      → WorkersRequest (from Requests)
```

#### Settings Sub-Routes
```
/user/personal-details     → PersonalDetails
/user/my-projects          → MyProjects
/user/legal                → Legal
/user/contact-us           → ContactUs
/user/about-us             → AboutUs
```

#### Additional Routes
```
/user/subscription         → Subscription (from Header Crown icon)
/user/notifications        → Notifications (from Header Bell icon)
```

### Contractor Module Routes

#### Onboarding
```
/contractor/business-details → BusinessDetails (from CompleteProfile)
```

#### Future Routes (To be implemented)
```
/contractor/dashboard         → ContractorDashboard
/contractor/projects          → ContractorProjects
/contractor/applications      → Applications
/contractor/settings          → ContractorSettings
```

## Navigation Flow

### User Module

#### Bottom Navigation Bar
- **Hire Workers** → `/user/hire-workers`
- **Find Contractor** → `/user/find-contractor`
- **Requests** → `/user/requests`
- **Settings** → `/user/settings`

#### Header Actions (on HireWorkers page)
- **Post Job Button** → (To be implemented)
- **Bell Icon** → `/user/notifications`
- **Crown Icon** → `/user/subscription`

#### Settings Menu
1. Personal → `/user/personal-details`
2. My Projects → `/user/my-projects`
3. Legal → `/user/legal`
4. Contact us → `/user/contact-us`
5. About us → `/user/about-us`
6. Log out → `/mobile-login` (direct navigation, no page)

#### Requests Menu
1. Contractor Request → `/user/contractor-request`
2. Workers Request → `/user/workers-request`

### Contractor Module

#### Onboarding Flow
```
CompleteProfile (Select "Contractor")
    ↓
Continue Button
    ↓
/contractor/business-details
    ↓
Save Business Details
    ↓
(Future) /contractor/dashboard
```

## Files Removed (Cleanup)
- ❌ `Logout.jsx` - Not needed (Settings directly navigates to /mobile-login)
- ❌ `AddProject.jsx` - Empty file, no implementation
- ❌ `DeleteProfile.jsx` - Not linked anywhere
- ❌ `UserDashboard.jsx` - Replaced by HireWorkers
- ❌ `BusinessDetails.jsx` - Moved to Contractor module

## Active Pages

### User Module (13 pages)
✅ AboutUs.jsx
✅ ContactUs.jsx
✅ ContractorRequest.jsx
✅ FindContractor.jsx
✅ HireWorkers.jsx
✅ Legal.jsx
✅ MyProjects.jsx
✅ Notifications.jsx
✅ PersonalDetails.jsx
✅ Requests.jsx
✅ Settings.jsx
✅ Subscription.jsx
✅ WorkersRequest.jsx

### Contractor Module (1 page - refactored)
✅ BusinessDetails.jsx (Component-based)

### Contractor Module (4 pages - to be refactored)
⏳ ApplicationDetails.jsx
⏳ ContractorDashboard.jsx
⏳ ContractorProjectDetails.jsx
⏳ ContractorSettings.jsx

## Route Protection
Currently using `ProtectedRoute.jsx` component (authentication logic to be implemented)

## Module Routing Pattern

### User Routes
- Prefix: `/user/`
- Example: `/user/hire-workers`, `/user/settings`

### Contractor Routes
- Prefix: `/contractor/`
- Example: `/contractor/business-details`, `/contractor/dashboard`

### Labour Routes (Future)
- Prefix: `/labour/`
- Example: `/labour/dashboard`, `/labour/find-work`

## Notes
- All module routes are prefixed with their module name
- Auth routes have no prefix
- Logout functionality redirects to `/mobile-login` without a dedicated page
- HireWorkers serves as the main dashboard/home page for users
- BusinessDetails is the entry point for contractors after profile completion
- Component-based architecture implemented for User and Contractor modules
- Routes are centrally managed in `src/routes/AppRoutes.jsx`
