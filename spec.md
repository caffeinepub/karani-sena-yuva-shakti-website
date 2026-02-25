# Specification

## Summary
**Goal:** Fix the mobile number search on the reprint ID card page so that registered candidates can successfully retrieve their admission card instead of seeing "इस मोबाइल नंबर से कोई प्रवेश नहीं मिला।"

**Planned changes:**
- Fix the backend `getCandidateByMobile` function to search the same stable candidates map used by the admin portal, with normalized (trimmed, no spaces, no country code) 10-digit mobile number matching
- Ensure mobile numbers are stored in the same normalized format at registration time as is used during lookup, so both paths use identical normalization logic
- Update the `useGetCandidateByMobile` frontend hook and `ReprintIdCardPage` to pass the normalized mobile number to the backend and display the correct admission card with the backend-assigned admission ID on a successful match

**User-visible outcome:** A candidate entering their registered mobile number (e.g. 6392708274) on the reprint page and pressing "खोजें" will see their admission card with the correct ID, and the error message only appears for genuinely unregistered numbers.
