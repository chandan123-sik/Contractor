# Cloudinary Usage Guide for Developers

## Quick Start

### 1. Test Cloudinary Configuration
```bash
cd backend
node test-cloudinary-upload.js
```

This will verify your Cloudinary credentials are working correctly.

### 2. Environment Setup
Ensure your `.env` file has:
```env
CLOUDINARY_CLOUD_NAME=dncw1hfix
CLOUDINARY_API_KEY=561958667554945
CLOUDINARY_API_SECRET=t5MjDDDXnlGMxgr6O0jYWy3J3ec
```

## Frontend Implementation Examples

### Example 1: Upload Profile Photo

```javascript
// React component example
import { useState } from 'react';
import api from '../services/api';

function ProfilePhotoUpload() {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      setUploading(true);
      try {
        const response = await api.put('/users/profile', {
          profilePhoto: base64String
        });
        
        console.log('Upload successful!', response.data.user.profilePhoto);
        alert('Profile photo updated!');
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload photo');
      } finally {
        setUploading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### Example 2: Upload Multiple Work Photos

```javascript
function WorkPhotosUpload() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleMultipleFiles = async (e) => {
    const files = Array.from(e.target.files);
    
    // Convert all files to base64
    const base64Promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(base64Promises);
    setPhotos(base64Images);
  };

  const uploadPhotos = async () => {
    setUploading(true);
    try {
      const response = await api.put('/labour/work-details', {
        workPhotos: photos
      });
      
      console.log('Photos uploaded!', response.data.labour.workPhotos);
      alert('Work photos updated!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleMultipleFiles}
      />
      <button onClick={uploadPhotos} disabled={uploading || photos.length === 0}>
        {uploading ? 'Uploading...' : `Upload ${photos.length} Photos`}
      </button>
    </div>
  );
}
```

### Example 3: Upload Labour Card Photo

```javascript
function LabourCardForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    mobileNumber: '',
    city: '',
    address: '',
    skills: '',
    photo: null
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        photo: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const submitLabourCard = async () => {
    try {
      const response = await api.post('/labour/card', {
        labourCardDetails: formData,
        skillType: 'Plumber',
        experience: '5 years'
      });
      
      console.log('Labour card created!', response.data.labour);
      alert('Labour card created successfully!');
    } catch (error) {
      console.error('Failed:', error);
      alert('Failed to create labour card');
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
      />
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handlePhotoChange}
      />
      
      {formData.photo && (
        <img src={formData.photo} alt="Preview" style={{width: 100}} />
      )}
      
      <button onClick={submitLabourCard}>Create Labour Card</button>
    </div>
  );
}
```

### Example 4: Upload Verification Documents

```javascript
function VerificationForm() {
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);

  const handleFrontUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setAadhaarFront(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBackUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setAadhaarBack(reader.result);
    reader.readAsDataURL(file);
  };

  const submitVerification = async () => {
    try {
      const response = await api.post('/admin/verification/submit', {
        entityType: 'labour',
        name: 'John Doe',
        phone: '9876543210',
        aadhaarNumber: '123456789012',
        aadhaarFrontUrl: aadhaarFront,
        aadhaarBackUrl: aadhaarBack
      });
      
      console.log('Verification submitted!', response.data);
      alert('Verification request submitted!');
    } catch (error) {
      console.error('Failed:', error);
      alert('Failed to submit verification');
    }
  };

  return (
    <div>
      <div>
        <label>Aadhaar Front:</label>
        <input type="file" accept="image/*" onChange={handleFrontUpload} />
        {aadhaarFront && <img src={aadhaarFront} alt="Front" style={{width: 200}} />}
      </div>
      
      <div>
        <label>Aadhaar Back:</label>
        <input type="file" accept="image/*" onChange={handleBackUpload} />
        {aadhaarBack && <img src={aadhaarBack} alt="Back" style={{width: 200}} />}
      </div>
      
      <button onClick={submitVerification}>Submit Verification</button>
    </div>
  );
}
```

## Backend Implementation Examples

### Example 1: Add Image Upload to New Controller

```javascript
import { uploadToCloudinary, deleteFromCloudinary } from '../../../utils/cloudinary.utils.js';

export const updateSomething = async (req, res) => {
  try {
    const { image } = req.body;
    
    // Check if image is base64
    if (image && image.startsWith('data:image')) {
      // Delete old image if exists
      const oldImage = await Model.findById(id);
      if (oldImage.imageUrl && oldImage.imageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldImage.imageUrl);
      }
      
      // Upload new image
      const cloudinaryUrl = await uploadToCloudinary(image, 'rajghar/your-folder');
      
      // Save to database
      await Model.findByIdAndUpdate(id, { imageUrl: cloudinaryUrl });
      
      return res.json({ success: true, imageUrl: cloudinaryUrl });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Example 2: Handle Multiple Images

```javascript
import { uploadMultipleToCloudinary } from '../../../utils/cloudinary.utils.js';

export const uploadGallery = async (req, res) => {
  try {
    const { images } = req.body; // Array of base64 images
    
    // Filter only base64 images
    const base64Images = images.filter(img => 
      typeof img === 'string' && img.startsWith('data:image')
    );
    
    // Upload all images
    const cloudinaryUrls = await uploadMultipleToCloudinary(
      base64Images, 
      'rajghar/gallery'
    );
    
    // Save to database
    await Model.create({ gallery: cloudinaryUrls });
    
    res.json({ success: true, urls: cloudinaryUrls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

## Common Patterns

### Pattern 1: Update with Optional Image
```javascript
// Only upload if new image is provided
if (req.body.image && req.body.image.startsWith('data:image')) {
  const url = await uploadToCloudinary(req.body.image, 'folder');
  updates.imageUrl = url;
}
```

### Pattern 2: Preserve Existing URLs
```javascript
// Keep existing Cloudinary URLs, upload only new base64 images
const existingUrls = images.filter(img => img.includes('cloudinary.com'));
const newBase64 = images.filter(img => img.startsWith('data:image'));
const newUrls = await uploadMultipleToCloudinary(newBase64, 'folder');
const allUrls = [...existingUrls, ...newUrls];
```

### Pattern 3: Delete Before Update
```javascript
// Delete old image before uploading new one
if (oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
  await deleteFromCloudinary(oldImageUrl);
}
const newUrl = await uploadToCloudinary(newImage, 'folder');
```

## Image Display in Frontend

### Display Cloudinary Image
```javascript
// Simple display
<img src={user.profilePhoto} alt="Profile" />

// With Cloudinary transformations (optional)
<img 
  src={user.profilePhoto.replace('/upload/', '/upload/w_200,h_200,c_fill/')} 
  alt="Profile" 
/>
```

### Lazy Loading
```javascript
<img 
  src={labour.workPhotos[0]} 
  loading="lazy"
  alt="Work" 
/>
```

## Error Handling

### Frontend Error Handling
```javascript
try {
  await api.put('/users/profile', { profilePhoto: base64 });
} catch (error) {
  if (error.response?.status === 500) {
    alert('Failed to upload image. Please try again.');
  } else {
    alert(error.response?.data?.message || 'Upload failed');
  }
}
```

### Backend Error Handling
```javascript
try {
  const url = await uploadToCloudinary(image, 'folder');
  // ... save to database
} catch (error) {
  console.error('Cloudinary upload error:', error);
  return res.status(500).json({
    success: false,
    message: 'Failed to upload image',
    error: error.message
  });
}
```

## Best Practices

1. **Always validate file type on frontend**
   ```javascript
   <input type="file" accept="image/*" />
   ```

2. **Show upload progress**
   ```javascript
   const [uploading, setUploading] = useState(false);
   // Set to true before upload, false after
   ```

3. **Compress images before upload (optional)**
   ```javascript
   // Use libraries like browser-image-compression
   import imageCompression from 'browser-image-compression';
   
   const compressed = await imageCompression(file, {
     maxSizeMB: 1,
     maxWidthOrHeight: 1920
   });
   ```

4. **Handle large files**
   - Show file size warning
   - Compress before upload
   - Show progress indicator

5. **Cleanup on delete**
   ```javascript
   // Always delete from Cloudinary when deleting entity
   if (entity.imageUrl) {
     await deleteFromCloudinary(entity.imageUrl);
   }
   await entity.deleteOne();
   ```

## Troubleshooting

### Issue: "Failed to upload image"
- Check Cloudinary credentials in `.env`
- Verify image is in base64 format
- Check file size (max 50MB)
- Check network connection

### Issue: "Image not displaying"
- Verify URL is saved in database
- Check if URL is accessible
- Check CORS settings in Cloudinary dashboard

### Issue: "Upload is slow"
- Compress images before upload
- Use smaller image sizes
- Check internet connection
- Consider using Cloudinary's upload widget

## API Endpoints Summary

| Endpoint | Method | Image Field | Folder |
|----------|--------|-------------|--------|
| `/api/users/profile` | PUT | `profilePhoto` | `rajghar/profiles` |
| `/api/labour/work-details` | PUT | `workPhotos[]` | `rajghar/work-photos` |
| `/api/labour/card` | POST | `labourCardDetails.photo` | `rajghar/labour-cards` |
| `/api/admin/verification/submit` | POST | `aadhaarFrontUrl`, `aadhaarBackUrl` | `rajghar/aadhaar-documents` |
| `/api/admin/labour-categories` | POST/PUT | `image` | `rajghar/categories` |

## Support & Resources

- Cloudinary Dashboard: https://cloudinary.com/console
- Cloudinary Documentation: https://cloudinary.com/documentation
- Test Script: `node backend/test-cloudinary-upload.js`
- Implementation Details: See `CLOUDINARY_IMPLEMENTATION.md`
