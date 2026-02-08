# Specification

## Summary
**Goal:** Add PayPal as an additional payment option for paid course purchases, alongside the existing Stripe flow.

**Planned changes:**
- Add backend methods in the existing Motoko actor to create a PayPal order (returning an approval/redirect URL and orderId) and to confirm/capture a PayPal order for a given (orderId, courseId), verifying payment success with PayPal before unlocking the course.
- Store a server-side mapping from PayPal orderId to the creating authenticated principal to prevent other principals from confirming the order.
- Update the course detail purchase UI to include a PayPal checkout option, calling the PayPal-create API via a new React Query mutation and redirecting the user to PayPal for approval (without changing existing Stripe behavior).
- Extend the existing payment return handling to support PayPal returns on `/payment-success` (detect PayPal return via query params, extract orderId, confirm/capture in-app, and invalidate purchase-related queries to unlock the course without refresh), and clear pending purchase context on `/payment-failure` (or PayPal cancel) similarly to Stripe.
- Add React Query mutation hooks for PayPal create and PayPal confirm/capture in `frontend/src/hooks/useQueries.ts`, following existing Stripe hook patterns (toast on errors; invalidate purchase-related queries on confirm success).

**User-visible outcome:** Users can choose PayPal or Stripe to buy a paid course; after returning from PayPal, the purchase is confirmed in-app and the course unlocks without a hard refresh.
