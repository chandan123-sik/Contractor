# Verification Testing Guide

## How to Test Verification Status

The verification system stores data in localStorage. You can simulate admin actions by running these commands in browser console:

## USER PANEL

### 1. Check Current Verification Status
```javascript
console.log(JSON.parse(localStorage.getItem('user_verification')));
```

### 2. Simulate Admin Approval (Verify)
```javascript
const verification = JSON.parse(localStorage.getItem('user_verification') || '{}');
verification.status = 'verified';
verification.verifiedAt = new Date().toISOString();
localStorage.setItem('user_verification', JSON.stringify(verification));
console.log('User Status changed to VERIFIED');
// Refresh the page to see changes
```

### 3. Simulate Admin Rejection (Reject)
```javascript
const verification = JSON.parse(localStorage.getItem('user_verification') || '{}');
verification.status = 'rejected';
verification.rejectedAt = new Date().toISOString();
localStorage.setItem('user_verification', JSON.stringify(verification));
console.log('User Status changed to REJECTED');
// Refresh the page to see changes
```

### 4. Reset to Pending (Allow Resubmission)
```javascript
const verification = JSON.parse(localStorage.getItem('user_verification') || '{}');
verification.status = 'pending';
localStorage.setItem('user_verification', JSON.stringify(verification));
console.log('User Status reset to PENDING');
// Refresh the page to see changes
```

### 5. Clear All Verification Data
```javascript
localStorage.removeItem('user_verification');
console.log('User Verification data cleared');
// Refresh the page to see changes
```

## CONTRACTOR PANEL

### 1. Check Current Verification Status
```javascript
console.log(JSON.parse(localStorage.getItem('contractor_verification')));
```

### 2. Simulate Admin Approval (Verify)
```javascript
const verification = JSON.parse(localStorage.getItem('contractor_verification') || '{}');
verification.status = 'verified';
verification.verifiedAt = new Date().toISOString();
localStorage.setItem('contractor_verification', JSON.stringify(verification));
console.log('Contractor Status changed to VERIFIED');
// Refresh the page to see changes
```

### 3. Simulate Admin Rejection (Reject)
```javascript
const verification = JSON.parse(localStorage.getItem('contractor_verification') || '{}');
verification.status = 'rejected';
verification.rejectedAt = new Date().toISOString();
localStorage.setItem('contractor_verification', JSON.stringify(verification));
console.log('Contractor Status changed to REJECTED');
// Refresh the page to see changes
```

### 4. Reset to Pending
```javascript
const verification = JSON.parse(localStorage.getItem('contractor_verification') || '{}');
verification.status = 'pending';
localStorage.setItem('contractor_verification', JSON.stringify(verification));
console.log('Contractor Status reset to PENDING');
// Refresh the page to see changes
```

### 5. Clear All Verification Data
```javascript
localStorage.removeItem('contractor_verification');
console.log('Contractor Verification data cleared');
// Refresh the page to see changes
```

## LABOUR PANEL

### 1. Check Current Verification Status
```javascript
console.log(JSON.parse(localStorage.getItem('labour_verification')));
```

### 2. Simulate Admin Approval (Verify)
```javascript
const verification = JSON.parse(localStorage.getItem('labour_verification') || '{}');
verification.status = 'verified';
verification.verifiedAt = new Date().toISOString();
localStorage.setItem('labour_verification', JSON.stringify(verification));
console.log('Labour Status changed to VERIFIED');
// Refresh the page to see changes
```

### 3. Simulate Admin Rejection (Reject)
```javascript
const verification = JSON.parse(localStorage.getItem('labour_verification') || '{}');
verification.status = 'rejected';
verification.rejectedAt = new Date().toISOString();
localStorage.setItem('labour_verification', JSON.stringify(verification));
console.log('Labour Status changed to REJECTED');
// Refresh the page to see changes
```

### 4. Reset to Pending
```javascript
const verification = JSON.parse(localStorage.getItem('labour_verification') || '{}');
verification.status = 'pending';
localStorage.setItem('labour_verification', JSON.stringify(verification));
console.log('Labour Status reset to PENDING');
// Refresh the page to see changes
```

### 5. Clear All Verification Data
```javascript
localStorage.removeItem('labour_verification');
console.log('Labour Verification data cleared');
// Refresh the page to see changes
```

## Verification Flow

1. **User/Contractor/Labour uploads Aadhaar photos** → Photos stored in localStorage
2. **User clicks "Submit for Verification"** → Status: `submitted` (Blue button, "Pending Verification")
3. **Admin reviews in admin panel** → (Future implementation)
4. **Admin approves** → Status: `verified` (Green button with checkmark, "Verified")
5. **Admin rejects** → Status: `rejected` (Red button with X, "Not Verified")

## Button States

- **Yellow** - "Submit for Verification" (Initial state)
- **Blue** - "Pending Verification" (After submission, waiting for admin)
- **Green** - "✓ Verified" (Admin approved)
- **Red** - "✗ Not Verified" (Admin rejected)

## Testing Steps

### User Panel
1. Go to User Panel → Settings → Legal
2. Upload Aadhaar card photos
3. Click "Submit for Verification"
4. Open browser console (F12)
5. Run the USER PANEL verification status change commands above
6. Refresh the page to see the button color change

### Contractor Panel
1. Go to Contractor Panel → Settings → Legal
2. Upload Aadhaar card photos
3. Click "Submit for Verification"
4. Open browser console (F12)
5. Run the CONTRACTOR PANEL verification status change commands above
6. Refresh the page to see the button color change

### Labour Panel
1. Go to Labour Panel → Settings → Legal Details
2. Upload Aadhaar card photos
3. Click "Submit for Verification"
4. Open browser console (F12)
5. Run the LABOUR PANEL verification status change commands above
6. Refresh the page to see the button color change
