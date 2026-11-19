# Security Specification — Richaa's Beauty & Aesthetic

## 1. Data Invariants
1. **Default-Deny Baseline**: Every unspecified document path in Firestore is denied for read and write.
2. **Strict Admin Authorisation**: Only verified administrators (`request.auth != null && request.auth.token.email_verified == true` AND either registered in `/admins/{uid}` or matching the verified bootstrapped owner emails) may read PII collections (`appointments`, `customers`, `enquiries`, `notifications`, `admin_profiles`) or mutate salon catalog/configuration (`services`, `service_categories`, `gallery_images`, `business_settings`, `reviews`).
3. **Zero Public Admin Self-Registration**: Unauthenticated or non-admin users can NEVER write to `/admins/{uid}` or `/admin_profiles/{uid}` to escalate privileges.
4. **Public Contact Form Containment**: Public visitors may ONLY `create` documents in `/enquiries/{enquiryId}` with initial `status == "New"`, strict field allowlisting (`keys().hasOnly(...)`), bounded string lengths, and server-verified timestamps (`createdAt == request.time && updatedAt == request.time`). Public visitors can NEVER `get`, `list`, `update`, or `delete` enquiries.
5. **Immutable Timestamps & Path Hardening**: All single-document operations enforce `isValidId(id)` matching `^[a-zA-Z0-9_\-]+$` (<= 128 chars). `createdAt` is immutable on update and `updatedAt == request.time`.

## 2. The "Dirty Dozen" Attack Payloads (All Must Return PERMISSION_DENIED)
1. **Privilege Escalation**: Non-admin signed-in user writes `{ uid, email, role: "owner" }` to `/admins/{uid}`.
2. **Email Spoofing**: Signed-in user with `email_verified: false` attempts to read `/enquiries/{id}`.
3. **PII Leak (Enquiries List)**: Public/non-admin user executes `list` on `/enquiries`.
4. **PII Leak (Customers Get)**: Non-admin user attempts `get` on `/customers/{id}`.
5. **PII Leak (Appointments)**: Non-admin user attempts `list` or `create` on `/appointments`.
6. **Shadow Field Injection on Enquiry**: Public user creates enquiry with extra field `isAdminApproved: true`.
7. **Status Forgery on Enquiry**: Public user creates enquiry with `status: "Resolved"` instead of `"New"`.
8. **Timestamp Forgery**: Caller creates enquiry or service with client-supplied past timestamp instead of `request.time`.
9. **ID Poisoning**: Caller attempts create with document ID containing invalid characters or > 128 chars (`../admin`).
10. **Payload Size Exhaustion**: Public user submits 100KB `message` string to `/enquiries`.
11. **Catalog Tampering**: Unauthenticated or non-admin user updates price on `/services/{id}`.
12. **Unpublished Review Leak**: Public user tries to `get` or `list` a review with `published: false`.
