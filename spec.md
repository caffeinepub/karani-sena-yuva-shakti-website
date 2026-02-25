# Specification

## Summary
**Goal:** Fix mobile number validation to accept 10-digit Indian format instead of the Pakistani 11-digit format.

**Planned changes:**
- Update frontend (`AdmissionFormPage.tsx`) mobile number validation regex to accept exactly 10 digits (Indian format, e.g., 9450956184)
- Update the Hindi error message to: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (जैसे: 9450956184)'
- Remove Pakistani format (03001234567, 11 digits) validation logic from frontend
- Update backend (`main.mo`) mobile number validation to accept exactly 10 digits and reject any other length
- Keep the mobile number field mandatory in both frontend and backend

**User-visible outcome:** Users entering a valid 10-digit Indian mobile number (e.g., 9450956184) will no longer see a validation error, and the form will submit successfully.
