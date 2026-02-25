# Specification

## Summary
**Goal:** Fix the duplicate serial number (admission ID) bug in the backend so that every member receives a globally unique serial number.

**Planned changes:**
- Replace the per-year counter logic with a single global counter stored in actor state that increments atomically on each new member registration
- On actor initialization, scan all existing member records to find the highest numeric suffix already in use and set the global counter above it, preventing future collisions with existing entries like 2023000004 and 2024000004
- Keep the serial number display format unchanged: YYYY (year of registration) + 6-digit zero-padded global counter

**User-visible outcome:** Every newly registered member receives a unique serial number. No two members will ever share the same numeric suffix, even if registered in different years.
