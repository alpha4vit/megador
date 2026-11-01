# Lead Quiz Component - State Management Documentation

## Overview

The `LeadQuiz` component is a multi-step form wizard designed to capture user information through a guided questionnaire. It uses React's `useState` hook for state management and provides a smooth, interactive user experience with visual progress tracking.

## State Structure

### Primary State Variables

```typescript
const [currentStep, setCurrentStep] = useState(1);
const [quizData, setQuizData] = useState<QuizData>({...});
const [isSubmitted, setIsSubmitted] = useState(false);
```

### 1. `currentStep` (number)
- **Purpose**: Tracks the current step in the quiz (1-4)
- **Initial Value**: 1
- **Possible Values**: 1, 2, 3, 4
- **Updates**: Incremented/decremented via navigation buttons
- **Validation**: Cannot go below 1 or exceed 4

### 2. `quizData` (QuizData object)
Stores all user responses across all steps:

```typescript
interface QuizData {
  destination: Destination | null;      // Step 1
  productType: ProductType | null;     // Step 2
  dimensions: {                         // Step 3
    width: number;
    height: number;
  };
  contact: {                            // Step 4
    name: string;
    phone: string;
    messenger: Messenger | null;
  };
}
```

#### Initial State:
```typescript
{
  destination: null,
  productType: null,
  dimensions: { width: 300, height: 200 },
  contact: { name: '', phone: '', messenger: null }
}
```

### 3. `isSubmitted` (boolean)
- **Purpose**: Tracks whether the quiz has been successfully submitted
- **Initial Value**: false
- **Purpose**: Controls display of success message vs. quiz form

## Type Definitions

### Destination Type
```typescript
type Destination = 'dacha' | 'house' | 'industrial';
```
- `dacha`: Seasonal property (Дача)
- `house`: Private residence (Частный дом)
- `industrial`: Industrial zone (Промзона)

### Product Type
```typescript
type ProductType = 'gates' | 'fences' | 'complex';
```
- `gates`: Gates only (Ворота)
- `fences`: Fences only (Забор)
- `complex`: Complete solution (Комплексное решение)

### Messenger Type
```typescript
type Messenger = 'viber' | 'telegram' | 'whatsapp' | 'sms';
```
- `viber`: Viber messenger
- `telegram`: Telegram messenger
- `whatsapp`: WhatsApp messenger
- `sms`: SMS delivery

## State Update Patterns

### Step 1: Destination Selection
```typescript
setQuizData({ ...quizData, destination: dest.id });
```
- Updates only the `destination` field
- Maintains all other existing quiz data
- Allows back/forward navigation without data loss

### Step 2: Product Type Selection
```typescript
setQuizData({ ...quizData, productType: product.id });
```
- Updates only the `productType` field
- Preserves destination selection from Step 1

### Step 3: Dimensions Input
```typescript
setQuizData({
  ...quizData,
  dimensions: { ...quizData.dimensions, width: parseInt(e.target.value) }
});
```
- Updates nested dimensions object
- Uses spread operator to preserve other dimension values
- Allows independent adjustment of width and height

### Step 4: Contact Information
```typescript
// Name
setQuizData({
  ...quizData,
  contact: { ...quizData.contact, name: e.target.value }
});

// Phone
setQuizData({
  ...quizData,
  contact: { ...quizData.contact, phone: e.target.value }
});

// Messenger
setQuizData({
  ...quizData,
  contact: { ...quizData.contact, messenger: messenger.id }
});
```
- Updates contact fields independently
- Maintains validation state for each field

## Navigation Logic

### Forward Navigation (`handleNext`)
```typescript
const handleNext = () => {
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1);
  }
};
```
- Increments step if not at maximum
- Protected by validation in UI (buttons disabled if required fields missing)

### Backward Navigation (`handleBack`)
```typescript
const handleBack = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};
```
- Decrements step if not at minimum
- Always preserves existing data

### Validation Rules

#### Step 1 Validation
- **Required**: `destination` must not be null
- **UI Feedback**: "Далее" button disabled until selection made

#### Step 2 Validation
- **Required**: `productType` must not be null
- **UI Feedback**: "Далее" button disabled until selection made

#### Step 3 Validation
- **No Required Fields**: Dimensions have default values
- **User can proceed regardless of slider values**

#### Step 4 Validation
- **Required Fields**:
  - `contact.name` must not be empty
  - `contact.phone` must not be empty
  - `contact.messenger` must not be null
- **UI Feedback**: "Отправить заявку" button disabled until all fields filled

## Submission Flow

### `handleSubmit` Function
```typescript
const handleSubmit = () => {
  console.log('Quiz submitted:', quizData);
  setIsSubmitted(true);
};
```

**Current Behavior**:
- Logs quiz data to console
- Sets `isSubmitted` to true
- Displays success message

**Production Implementation**:
```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData),
    });
    if (response.ok) {
      setIsSubmitted(true);
    }
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

### Reset Functionality
```typescript
const resetQuiz = () => {
  setCurrentStep(1);
  setQuizData({
    destination: null,
    productType: null,
    dimensions: { width: 300, height: 200 },
    contact: { name: '', phone: '', messenger: null },
  });
  setIsSubmitted(false);
};
```
- Resets all state to initial values
- Allows user to retake quiz
- Clears all form fields

## Progress Tracking

### Progress Calculation
```typescript
const progress = (currentStep / totalSteps) * 100;
```

**Visual Representation**:
- Progress bar shows percentage completion
- Updates in real-time as user navigates
- Smooth CSS transitions (500ms duration)

**Step Mapping**:
- Step 1: 25%
- Step 2: 50%
- Step 3: 75%
- Step 4: 100%

## UI State Indicators

### Selection States
```typescript
className={`... ${
  quizData.destination === dest.id
    ? 'border-[#E65F2B] bg-orange-50'  // Selected
    : 'border-gray-200 hover:border-[#E65F2B] hover:bg-orange-50'  // Unselected
}`}
```

### Button States
```typescript
disabled={
  (currentStep === 1 && !quizData.destination) ||
  (currentStep === 2 && !quizData.productType)
}
```

## Error Handling

### Current Implementation
- No explicit error handling
- Validation prevents invalid submissions
- Console logging for debugging

### Recommended Enhancements
1. Add error boundaries for component crashes
2. Implement form validation with error messages
3. Add retry logic for failed submissions
4. Store progress in localStorage for recovery

## Data Persistence

### Current State
- Data exists only in component state
- Lost on page refresh or navigation
- No external storage

### Recommended Enhancements
```typescript
// Save to localStorage on each step change
useEffect(() => {
  localStorage.setItem('quizProgress', JSON.stringify({
    currentStep,
    quizData
  }));
}, [currentStep, quizData]);

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem('quizProgress');
  if (saved) {
    const { currentStep: savedStep, quizData: savedData } = JSON.parse(saved);
    setCurrentStep(savedStep);
    setQuizData(savedData);
  }
}, []);
```

## Component Lifecycle

### Mount
1. Initialize state with default values
2. Render Step 1 (Destination selection)
3. Display progress bar at 25%

### User Interaction
1. User selects option → Update quizData
2. User clicks "Далее" → Increment currentStep
3. Animate transition to next step
4. Update progress bar

### Unmount
- All state is lost (no persistence)
- Component cleans up automatically via React

## Testing Considerations

### Unit Tests
- Test state initialization
- Test state updates for each step
- Test validation logic
- Test navigation limits
- Test reset functionality

### Integration Tests
- Test complete user flow
- Test submission with mock API
- Test error scenarios
- Test mobile responsiveness

### End-to-End Tests
- Test full quiz completion
- Test data persistence (if implemented)
- Test cross-browser compatibility
- Test accessibility (keyboard navigation)

## Performance Considerations

### Current Implementation
- Minimal re-renders (state updates localized)
- No heavy computations
- CSS animations for smooth transitions

### Optimization Opportunities
1. Memoize step components with `React.memo`
2. Use `useCallback` for event handlers
3. Implement virtual scrolling for long lists
4. Lazy load icons if needed

## Accessibility

### Current Implementation
- Keyboard navigation support (tab index)
- Semantic HTML structure
- Clear visual feedback
- Progress indicator

### Recommended Enhancements
1. ARIA labels for screen readers
2. Focus management on step changes
3. Error announcements for validation failures
4. Keyboard shortcuts for navigation

## Future Enhancements

### Planned Features
1. Backend API integration
2. Email/SMS delivery of catalog
3. Progress persistence
4. A/B testing of step order
5. Analytics tracking
6. Multi-language support

### Technical Debt
1. Extract validation logic to custom hook
2. Create reusable step component
3. Implement form library (React Hook Form)
4. Add TypeScript strict mode compliance
5. Add comprehensive error boundaries

---

**Last Updated**: October 7, 2026
**Component Version**: 1.0.0
**React Version**: 19.x
**Next.js Version**: 16.4.0
