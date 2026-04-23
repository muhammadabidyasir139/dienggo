# Scenario: Migrate Payment Gateway to DOKU

## Target
Replace the existing Midtrans and Manual Transfer methods with DOKU (Jokul Checkout) to streamline the payment process on the booking page.

## Current State
* **Discovery:** User finds a villa/wisata and clicks "Book Now".
* **Interaction:** User fills in guest data and sees "Midtrans Payment Gateway" as the only option.
* **Payment:** Upon clicking "Cek Ketersediaan", the system calls Midtrans API.
* **Transition:** A Midtrans Snap popup appears or the user is redirected to a temporary invoice page.

## Desired State
* **Discovery:** Same entry point via the booking page.
* **Interaction:** User sees "DOKU Payment Gateway" (Jokul) branding and payment methods (VA, QRIS, e-Wallet).
* **Payment:** User clicks "Pesan & Bayar".
* **Transition:** Redirected seamlessly to DOKU's secure checkout page or integrated modal.
* **Confirmation:** Real-time feedback via DOKU's callback when payment is completed.

## User Journey
1. **Fill Booking Form**: User provides guest details and dates.
2. **Select DOKU**: DOKU is displayed as the default and secure payment provider.
3. **Initiate Payment**: User clicks "Bayar Sekarang".
4. **DOKU Checkout**: User completes payment via chosen method on DOKU's platform.
5. **Auto-Redirect**: After payment, the user is returned to the "Pesanan" (Orders) page with updated status.

## Success Criteria
* Seamless redirection to DOKU checkout.
* Correct handling of DOKU "Notification" (callback) to update booking status in DB.
* User sees "Paid" status in their order history after successful transaction.

## Scope
* **Pages affected:** `BookingForm.tsx` (all types), Booking detail pages.
* **Components touched:** `BookingForm.tsx` UI sections.
* **Data changes:** New API routes for DOKU; Database fields update (or reuse existing status fields).
* **Risk level:** High (Financial transaction flow).
