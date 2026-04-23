# BookingForm — DOKU Migration Specification

## Change Summary
Migration of the payment gateway from Midtrans to DOKU (Jokul Checkout). This involves updating the frontend UI, removing the Midtrans Snap.js script, and implementing new API logic for DOKU transaction creation and notification handling.

## Before
* **Branding:** "Midtrans Payment Gateway" displayed with VA, Gopay, QRIS icons.
* **Mechanism:** Midtrans Snap.js script loaded on mount; `window.snap.pay` used for checkout.
* **API:** Calls `/api/midtrans/create-transaction`.

## After (DOKU)
* **Branding:** "DOKU Payment Gateway" displayed with updated iconography (DOKU logo, VA, QRIS, e-Wallet).
* **Mechanism:** Seamless redirect to DOKU's hosted checkout page (Jokul Checkout) for maximum security and reduced bundle size (no external script needed for basic redirect flow).
* **API:** Calls `/api/doku/create-transaction`.

## Components

### 1. Payment Method Card (`BookingForm.tsx`)
* **Title:** Update to "DOKU Payment Gateway".
* **Description:** "VA, QRIS, Credit Card, e-Wallet & More".
* **Logo:** Replace Midtrans-related icons with DOKU branding elements.
* **Behavior:** Clicking "Bayar Sekarang" (previously "Pesan & Bayar") initiates the DOKU flow.

### 2. proceedToPayment Logic
* **Step 1:** Call `POST /api/doku/create-transaction` with booking details.
* **Step 2:** Extract `payment_url` from DOKU response.
* **Step 3:** Perform client-side redirect: `window.location.href = data.payment_url`.

### 3. DOKU API Service (New)
* **Endpoint:** `/api/doku/create-transaction`
* **Security:** Use HMAC signature or Secret Key validation as per DOKU/Jokul docs.
* **Request:** Map Dienggo booking data to DOKU `order` and `items` structure.

### 4. DOKU Notification (New)
* **Endpoint:** `/api/doku/notification` (POST)
* **Action:** Validate DOKU signature, check transaction status, and update `bookings` status to 'paid' or 'failed'.

## Responsive Behavior
* Hosted checkout adapts automatically to mobile/desktop.
* UI components in `BookingForm` maintain existing responsive grid.

## Acceptance Criteria
1. UI clearly indicates DOKU as the payment provider.
2. Clicking the payment button redirects the user to the DOKU checkout page.
3. System handles the DOKU callback correctly to update the database.
4. User is redirected back to `/pesanan` upon successful payment completion.
