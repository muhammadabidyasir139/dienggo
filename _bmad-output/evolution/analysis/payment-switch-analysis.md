# Analysis: Switching Payment Gateway to DOKU

**Product Snapshot:**
* **Current Gateway:** Midtrans (Snap.js Integration)
* **Status:** Fully functional for Booking flow
* **Key Files:**
    * `components/BookingForm.tsx`: Handles frontend Snap popup and API calls.
    * `app/api/midtrans/create-transaction/route.ts`: Server-side transaction creation.
    * `app/api/midtrans/notification/route.ts`: Webhook for payment status updates.
    * `.env.local`: Stores Midtrans Client/Server keys.
* **Database Integration:** `bookings` table stores `midtransOrderId`, `snapToken`, and `paymentUrl`.

**Improvement Target:**
* **Objective:** Replace Midtrans/Manual Transfer flow with DOKU (Jokul).
* **Rationale:** Business requirement to use DOKU as the primary payment provider.

**Priority:** High
**Impact:** Critical (Core revenue flow)
**Effort:** Medium (API integration + UI update)

**Technical Requirements for DOKU:**
1. **DOKU Credentials:** Client ID and Secret Key (Sandbox/Production).
2. **API Endpoint:** Create checkout session (Jokul Checkout).
3. **Notification Handler:** New endpoint `/api/doku/notification` to process Jokul callbacks.
4. **UI Update:** Change Midtrans branding to DOKU branding in `BookingForm.tsx`.
