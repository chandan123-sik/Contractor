# Contractor Module - Component-Based Architecture

## Overview
Contractor module follows the same component-based architecture as User module for consistency, reusability, and maintainability.

## Folder Structure

```
contractor-main/Frontend/src/modules/contractor/
├── components/
│   ├── ContractorPageHeader.jsx      # Reusable page header with back navigation
│   ├── BusinessDetailForm.jsx        # Business detail form section
│   └── BusinessAddressForm.jsx       # Business address form section
└── pages/
    ├── BusinessDetails.jsx            # Route-level container (refactored)
    ├── ApplicationDetails.jsx         # (To be refactored)
    ├── ContractorDashboard.jsx        # (To be refactored)
    ├── ContractorProjectDetails.jsx   # (To be refactored)
    └── ContractorSettings.jsx         # (To be refactored)
```

## Component Architecture

### Pages (Route-Level Containers)
Pages handle:
- **State Management** - Form data, loading states
- **Data Flow** - API calls, localStorage operations
- **Business Logic** - Validation, data transformation
- **Layout Structure** - Composing child components
- **Navigation** - Route transitions

### Components (UI Building Blocks)
Components handle:
- **UI Rendering** - Pure presentational logic
- **Props-based** - Receive data and callbacks
- **Reusable** - Can be used across different pages
- **Focused** - Single responsibility

## Current Implementation

### 1. BusinessDetails Page (Refactored ✅)

**Location:** `pages/BusinessDetails.jsx`

**Responsibilities:**
- Manages form state (15 fields)
- Handles form validation
- Saves data to localStorage
- Composes child components

**Components Used:**
- `ContractorPageHeader` - Page header with back button
- `BusinessDetailForm` - Business information section
- `BusinessAddressForm` - Address information section

**Code Structure:**
```jsx
const BusinessDetails = () => {
    // State management
    const [formData, setFormData] = useState({...});
    
    // Event handlers
    const handleChange = (e) => {...};
    const validateForm = () => {...};
    const handleSaveBusinessDetails = () => {...};
    
    // Render components
    return (
        <div>
            <ContractorPageHeader />
            <BusinessDetailForm />
            <BusinessAddressForm />
            <button onClick={handleSaveBusinessDetails}>Save</button>
        </div>
    );
};
```

### 2. ContractorPageHeader Component

**Location:** `components/ContractorPageHeader.jsx`

**Props:**
- `title` - Page title text
- `onBack` - Custom back handler (optional)
- `backPath` - Navigation path (optional)
- `icon` - Icon component (optional)
- `sticky` - Sticky header flag (optional)

**Features:**
- Back navigation with ChevronLeft icon
- Optional icon display
- Sticky positioning support
- Flexible back navigation (custom handler, path, or default)

### 3. BusinessDetailForm Component

**Location:** `components/BusinessDetailForm.jsx`

**Props:**
- `formData` - Form data object
- `onChange` - Change handler function

**Fields:**
- Business Type (dropdown)
- Business Name
- Authorized Person Name
- Contact Number
- Alternate Contact Number
- PAN/GST Number
- Email Address
- Alternate Email Address

### 4. BusinessAddressForm Component

**Location:** `components/BusinessAddressForm.jsx`

**Props:**
- `formData` - Form data object
- `onChange` - Change handler function

**Fields:**
- Pincode & Post Office (grid layout)
- City & State (grid layout)
- Address Line 1
- Address Line 2
- Landmark

## Routing

### Current Routes
```javascript
// In AppRoutes.jsx
import ContractorBusinessDetails from '../modules/contractor/pages/BusinessDetails';

<Route path="/contractor/business-details" element={<ContractorBusinessDetails />} />
```

### Navigation Flow
```
CompleteProfile (Select "Contractor") 
    → Continue Button 
    → /contractor/business-details
    → Save Business Details
    → (Future: /contractor/dashboard)
```

## Benefits of Component-Based Architecture

### 1. Reusability
- `ContractorPageHeader` can be used across all contractor pages
- Form components can be reused in edit/view modes
- Components can be shared between User, Contractor, and Labour modules

### 2. Maintainability
- Changes to UI happen in one place
- Easy to locate and fix bugs
- Clear separation of concerns

### 3. Testability
- Components can be tested in isolation
- Props-based testing is straightforward
- Mock data can be easily injected

### 4. Scalability
- New pages can quickly compose existing components
- New features can be added without affecting existing code
- Team members can work on different components simultaneously

### 5. Consistency
- Same patterns across all modules
- Predictable code structure
- Easier onboarding for new developers

## Future Refactoring Plan

### Pages to Refactor:
1. **ApplicationDetails.jsx**
   - Extract application form components
   - Create ApplicationCard component
   - Add ApplicationStatus component

2. **ContractorDashboard.jsx**
   - Create DashboardHeader component
   - Extract ProjectCard component
   - Add StatisticsCard component
   - Create ContractorBottomNav component

3. **ContractorProjectDetails.jsx**
   - Extract ProjectInfo component
   - Create ProjectTimeline component
   - Add ProjectActions component

4. **ContractorSettings.jsx**
   - Reuse SettingsMenuItem from user module
   - Create ContractorProfile component
   - Add BusinessInfo component

### Shared Components to Create:
- `ContractorBottomNav` - Bottom navigation bar
- `ProjectCard` - Project display card
- `ApplicationCard` - Application display card
- `StatCard` - Statistics card
- `ActionButton` - Reusable action button
- `StatusBadge` - Status indicator badge

## Best Practices

### 1. Component Naming
- Use PascalCase for component names
- Prefix contractor-specific components with "Contractor"
- Use descriptive names (e.g., `BusinessDetailForm` not `Form1`)

### 2. Props Design
- Keep props minimal and focused
- Use object props for related data
- Provide default values where appropriate
- Document props with PropTypes or TypeScript

### 3. State Management
- Keep state in the page component
- Pass down data and callbacks to child components
- Use controlled components for forms
- Avoid prop drilling (consider Context if needed)

### 4. File Organization
- One component per file
- Group related components in subfolders if needed
- Keep components folder flat initially
- Create subfolders when you have 10+ components

### 5. Code Reusability
- Extract repeated UI patterns into components
- Share components between modules when appropriate
- Create a shared/common folder for cross-module components
- Document reusable components thoroughly

## Data Flow

### Form Data Flow
```
Page Component (State)
    ↓ (formData, onChange)
Form Component
    ↓ (renders inputs)
User Input
    ↑ (onChange event)
Form Component
    ↑ (calls onChange)
Page Component (Updates State)
```

### Save Flow
```
User clicks "Save"
    ↓
Page validates data
    ↓
Page saves to localStorage
    ↓
Toast notification
    ↓
(Future) Navigate to dashboard
```

## Testing Strategy

### Component Testing
```javascript
// Example: BusinessDetailForm.test.jsx
test('renders all required fields', () => {
    render(<BusinessDetailForm formData={mockData} onChange={mockFn} />);
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
});

test('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    render(<BusinessDetailForm formData={mockData} onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText(/business name/i), {
        target: { value: 'New Name' }
    });
    expect(handleChange).toHaveBeenCalled();
});
```

### Page Testing
```javascript
// Example: BusinessDetails.test.jsx
test('validates required fields on save', () => {
    render(<BusinessDetails />);
    fireEvent.click(screen.getByText(/save business details/i));
    expect(screen.getByText(/please enter business name/i)).toBeInTheDocument();
});
```

## Next Steps

1. ✅ Refactor BusinessDetails page (Complete)
2. ⏳ Create ContractorBottomNav component
3. ⏳ Refactor ContractorDashboard page
4. ⏳ Create shared components library
5. ⏳ Refactor remaining contractor pages
6. ⏳ Add unit tests for components
7. ⏳ Document all components with examples

## Notes

- Follow the same patterns as User module for consistency
- Reuse User module components where appropriate
- Keep contractor-specific logic in contractor components
- Document any deviations from standard patterns
- Update this document as architecture evolves
