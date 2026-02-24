# Specification

## Summary
**Goal:** Make the admission form publicly accessible, add father's name field, generate unique admission IDs, and create printable admission cards.

**Planned changes:**
- Remove authentication requirement from admission form submission
- Add "Father's Name" field to candidate records and form
- Generate unique 10-character admission IDs in format YYYY0-XXXXX for each submission
- Display printable admission card immediately after successful form submission
- Show unique admission IDs in admin panel submissions list

**User-visible outcome:** Anyone can submit admission forms without logging in. After submission, they receive a printable admission card showing their unique ID, personal details, and photo. Admins can view the unique ID for each submission in the admin panel.
