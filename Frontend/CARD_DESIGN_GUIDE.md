# Premium Card Design System

## Overview
This document describes the common reusable card UI design system implemented across all panels (User, Contractor, Labour).

## Features

### 🎨 Card Base Design
- **Rounded corners**: 16px border-radius (rounded-2xl)
- **Soft border**: Light gray border (border-gray-200)
- **Box shadow**: Subtle shadow with depth (shadow-md)
- **Background**: Clean white
- **Padding**: Consistent 16px (p-4)
- **Spacing**: 16px margin bottom (mb-4)

### ✨ Border & Hover Animation
- **Default State**:
  - Thin neutral border (border-gray-200)
  - Medium shadow (shadow-md)
  
- **Hover State**:
  - Border color changes to blue (border-blue-400)
  - Shadow becomes deeper (shadow-xl)
  - Card moves up 4px (translateY -4px)
  - Smooth transition (300ms ease-out)

### 🎞 Micro Animations
- **Card Load**: Fade-in + slide-up animation (400ms)
- **Stagger Effect**: Each card animates with 50ms delay
- **Button Hover**: Scale up to 105% (200ms)
- **Button Click**: Scale down to 95% (active state)

## Usage

### 1. Using PremiumCard Component

```jsx
import PremiumCard from '../components/shared/PremiumCard';

// Basic usage
<PremiumCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</PremiumCard>

// With index for stagger animation
{items.map((item, index) => (
  <PremiumCard key={item.id} index={index}>
    <h3>{item.title}</h3>
  </PremiumCard>
))}

// With click handler
<PremiumCard onClick={() => handleClick()}>
  <p>Clickable card</p>
</PremiumCard>
```

### 2. Using Premium Buttons

```jsx
import { PrimaryButton, SecondaryButton } from '../components/shared/PremiumButton';

// Primary button (yellow)
<PrimaryButton onClick={handleSubmit}>
  Submit
</PrimaryButton>

// Secondary button (blue outline)
<SecondaryButton onClick={handleView}>
  View Details
</SecondaryButton>

// Disabled state
<PrimaryButton disabled>
  Loading...
</PrimaryButton>
```

### 3. Using CSS Classes Directly

```jsx
// Card with premium styling
<div className="premium-card card-fade-in">
  <h3>Card Content</h3>
</div>

// Primary button
<button className="btn-primary">
  Click Me
</button>

// Secondary button
<button className="btn-secondary">
  View More
</button>

// Hover effect on any element
<div className="btn-hover">
  Hover me
</div>
```

## CSS Classes Reference

### Card Classes
- `premium-card`: Base card styling with hover effects
- `card-fade-in`: Fade-in animation on load

### Button Classes
- `btn-primary`: Yellow primary button
- `btn-secondary`: Blue outline secondary button
- `btn-hover`: Generic hover scale effect

## Animation Timing
- **Card fade-in**: 400ms ease-out
- **Hover transition**: 300ms ease-out
- **Button hover**: 200ms ease-out
- **Stagger delay**: 50ms per card

## Color Scheme
- **Primary**: Yellow (#fbbf24 - yellow-400)
- **Secondary**: Blue (#3b82f6 - blue-500)
- **Border**: Gray (#e5e7eb - gray-200)
- **Hover Border**: Blue (#60a5fa - blue-400)

## Best Practices

1. **Always use index prop** for stagger animation when mapping cards
2. **Use PremiumCard component** for consistency
3. **Use button components** instead of custom buttons
4. **Don't override hover effects** unless necessary
5. **Keep card content organized** with proper spacing

## Examples

### Worker Card
```jsx
<PremiumCard index={index}>
  <div className="flex items-start gap-3 mb-3">
    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full">
      <span className="text-2xl font-bold">{name[0]}</span>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm text-gray-600">{skill}</p>
    </div>
  </div>
  
  <div className="flex gap-3">
    <SecondaryButton onClick={handleView}>
      View Details
    </SecondaryButton>
    <PrimaryButton onClick={handleHire}>
      Hire Worker
    </PrimaryButton>
  </div>
</PremiumCard>
```

### Job Card
```jsx
<PremiumCard index={index}>
  <h3 className="font-bold text-lg mb-2">{jobTitle}</h3>
  <p className="text-gray-600 mb-3">{description}</p>
  
  <div className="grid grid-cols-2 gap-3 mb-3">
    <div>
      <p className="text-xs text-gray-500">City</p>
      <p className="font-medium">{city}</p>
    </div>
    <div>
      <p className="text-xs text-gray-500">Budget</p>
      <p className="font-medium">{budget}</p>
    </div>
  </div>
  
  <PrimaryButton onClick={handleApply}>
    Apply Now
  </PrimaryButton>
</PremiumCard>
```

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Performance
- Hardware-accelerated animations (transform, opacity)
- No layout thrashing
- Smooth 60fps animations
- Optimized for mobile devices
