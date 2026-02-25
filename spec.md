# Specification

## Summary
**Goal:** Fix the admission ID format inconsistency so that the AdmissionCard always displays the backend's sequential numeric ID (e.g., 2023000008) immediately after first form submission, instead of a frontend-generated temporary ID (e.g., 20260-34913).

**Planned changes:**
- Remove frontend-side temporary admission ID generation logic from `useSubmitAdmissionForm.ts` and/or `AdmissionFormPage.tsx`
- Update the `submitAdmissionForm` backend function to return the persistent sequential numeric admission ID in its response
- Update the frontend to use only the backend-returned admission ID when rendering the AdmissionCard after submission
- Add a duplicate mobile number check in the backend before creating a new admission record; if the mobile already exists, return the existing candidate's admission ID instead of creating a duplicate

**User-visible outcome:** After submitting the admission form for the first time, the AdmissionCard immediately shows the same sequential numeric ID (e.g., 2023000008) that appears in the Admin portal — no temporary or mismatched ID is ever displayed. Re-submitting with the same mobile number returns the existing ID without creating a duplicate record.
