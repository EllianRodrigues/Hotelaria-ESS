# Unit Tests

This directory contains unit tests for the backend API. Unit tests focus on testing individual functions and components in isolation, using mocks for external dependencies.

## Structure

```
unit-tests/
├── README.md
├── uploadRouter.test.js    # Tests for upload functionality
└── [future test files]    # Additional unit tests
```

## Running Unit Tests

### Run all unit tests:
```bash
npm run test:unit
```

### Run a specific unit test file:
```bash
npx mocha unit-tests/uploadRouter.test.js
```

### Run all tests (integration + unit):
```bash
npm run test:all
```

## Test Categories

### 1. Upload Router Tests (`uploadRouter.test.js`)
Tests the Cloudinary signature generation endpoint:

- ✅ **Signature Generation** - Tests successful signature creation
- ✅ **Configuration** - Verifies Cloudinary is configured correctly
- ✅ **Error Handling** - Tests various error scenarios
- ✅ **Security** - Ensures no sensitive data is exposed
- ✅ **Response Structure** - Validates JSON response format

## Test Features

### Mocking Strategy
- **External Dependencies** - Cloudinary, database, etc. are mocked
- **Time Control** - Date.now() is mocked for predictable timestamps
- **Console Spying** - Error logging is monitored and verified

### Test Scenarios
- **Happy Path** - Normal successful operations
- **Error Scenarios** - Various failure conditions
- **Security Validation** - Ensures no credential exposure
- **Data Validation** - Verifies response structure and types

## Benefits

✅ **Isolated Testing** - No external dependencies required  
✅ **Fast Execution** - No database or network calls  
✅ **Predictable Results** - Controlled test environment  
✅ **Comprehensive Coverage** - Tests all code paths  
✅ **Security Validation** - Ensures no data leaks  

## Adding New Unit Tests

1. Create a new test file in `unit-tests/` directory
2. Follow the naming convention: `[component].test.js`
3. Use mocks for external dependencies
4. Test both success and error scenarios
5. Include security and validation tests where applicable

## Example Test Structure

```javascript
import { jest } from '@jest/globals';

// Mock external dependencies
jest.mock('../src/someModule');

describe('Component Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Function Name', () => {
    it('should do something successfully', async () => {
      // Test implementation
    });

    it('should handle errors gracefully', async () => {
      // Error test implementation
    });
  });
});
``` 