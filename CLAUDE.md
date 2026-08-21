# Project Rules

## 1. Form Validation

All required form fields must be validated before submission. Name and email cannot be empty, email must use a valid email format, and age must be between 13 and 100 when the age field is present. Validation errors must be shown next to the relevant field.

## 2. Accessibility and Keyboard Support

Every form input must have a properly associated label. Forms must be usable with the keyboard, and when submission fails, focus should move to the first invalid field so the user can quickly correct the problem.

## 3. Test Before Completion

Any change to the settings form must include or update automated tests for the affected behavior. Before considering the feature complete, run the test suite and confirm that all tests pass. Do not assume generated code is correct without verification.
