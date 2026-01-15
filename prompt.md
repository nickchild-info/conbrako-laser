@plan.md @activity.md

# Sprint 2 Completion: Frontend Integration

Read activity.md "Project Status Summary" section for full context on completed work.

## Current Status

**Backend: ✅ COMPLETE**
- Payfast service, checkout endpoint, ITN webhook
- TCG service with mock mode, shipping endpoints
- All API endpoints tested and working

**Frontend: ⏳ IN PROGRESS**
- 6 remaining tasks to connect frontend to new backend APIs

## Project Context

- Next.js 15 frontend in apps/web (TypeScript, Tailwind)
- FastAPI backend in apps/api (Python, SQLAlchemy, Alembic)
- Currency: ZAR | Locale: en-ZA

## Dev Servers

```bash
# Terminal 1 - Backend
cd apps/api && uvicorn app.main:app --reload --port 8001

# Terminal 2 - Frontend
cd apps/web && npm run dev
```

Start both servers before testing integrations.

---

## Remaining Tasks (Priority Order)

### 1. Shipping API Client
**File:** `apps/web/src/lib/api/shipping.ts`

Create TypeScript client to call backend shipping endpoints:
```typescript
// Types needed
interface ShippingAddress { street, suburb, city, province, postal_code, country }
interface ShippingQuote { service, price, estimated_days, carrier }
interface TrackingEvent { status, description, timestamp, location }

// Functions needed
getShippingQuotes(address: ShippingAddress, items: CartItem[]): Promise<ShippingQuote[]>
getSimpleQuote(province: string, postal_code: string): Promise<ShippingQuote[]>
createShipment(orderId: number, address: ShippingAddress, service: string): Promise<{waybill, tracking_url}>
getTracking(waybill: string): Promise<TrackingEvent[]>
```

Backend endpoints:
- POST /api/v1/shipping/quote
- POST /api/v1/shipping/quote/simple
- POST /api/v1/shipping/create
- GET /api/v1/shipping/track/{waybill}

---

### 2. Shipping Calculator Component
**File:** `apps/web/src/components/shipping/ShippingCalculator.tsx`

Add to cart page - UI for shipping quotes:
- Province dropdown (all 9 SA provinces)
- Postal code input
- "Calculate Shipping" button
- Display shipping options with prices and delivery times
- Select shipping option (updates cart total)

Use mock rates in development:
- Gauteng: R95 standard / R150 express / R250 overnight
- Western Cape: R150 / R220 / R350
- Other provinces: R120-R180 depending on distance

---

### 3. Address Collection Form
**File:** `apps/web/src/components/checkout/AddressForm.tsx`

Collect delivery address before checkout:
- Street address (required)
- Suburb (required)
- City (required)
- Province dropdown (required)
- Postal code (required)
- Phone number (optional)

Store in state/context for checkout submission.

---

### 4. PayfastForm Component
**File:** `apps/web/src/components/checkout/PayfastForm.tsx`

Hidden form that submits to Payfast:
```tsx
// Receives form fields from POST /api/v1/checkout/payfast response
interface PayfastFormProps {
  payfastUrl: string;
  formFields: { name: string; value: string }[];
  onSubmit?: () => void;
}

// Renders hidden form and auto-submits or provides submit button
// Form method="POST" action={payfastUrl}
// Each formField becomes <input type="hidden" name={field.name} value={field.value} />
```

---

### 5. Update Checkout Flow
**File:** `apps/web/src/app/cart/page.tsx` (and CartDrawer)

Replace Stripe flow with Payfast:

1. User clicks "Proceed to Checkout"
2. Show AddressForm if not already collected
3. Call `POST /api/v1/checkout/payfast` with:
   - Cart items
   - Customer info (email, name, phone)
   - Shipping address
   - Selected shipping service and cost
4. Receive response with `payfast_url` and `form_fields`
5. Render PayfastForm and auto-submit (redirects to Payfast)
6. After payment, Payfast redirects to /order-confirmation?order_id=X

Backend endpoint returns:
```json
{
  "order_id": 123,
  "payfast_url": "https://sandbox.payfast.co.za/eng/process",
  "form_fields": [
    {"name": "merchant_id", "value": "10000100"},
    {"name": "amount", "value": "2500.00"},
    {"name": "signature", "value": "abc123..."},
    // ... more fields
  ],
  "total": 2500.00
}
```

---

### 6. Order Confirmation Tracking
**File:** `apps/web/src/app/order-confirmation/page.tsx`

Update to show shipping info:
- Read `order_id` from URL params
- Fetch order details from `GET /api/v1/orders/{id}`
- Display waybill number if available
- Show tracking link if available
- Display shipping service and estimated delivery

---

## Testing

After each task:
1. Start both dev servers
2. Test the feature manually
3. Take screenshot if relevant
4. Update activity.md with progress
5. Mark task complete in plan.md

## Sandbox Testing

Payfast sandbox works without real account:
- URL: https://sandbox.payfast.co.za/eng/process
- Any valid-format card works
- ITN callbacks sent to notify_url

TCG mock mode returns realistic data:
- Province-based shipping rates
- Mock waybill numbers (MOCK-{orderId}-{timestamp})
- Mock tracking events

## Completion Criteria

All 6 tasks complete when:
- User can calculate shipping in cart
- User can enter delivery address
- Checkout submits to Payfast successfully
- Order confirmation shows shipping/tracking info
- Full E2E flow works: browse → cart → shipping → checkout → Payfast → confirmation

Take final screenshot: `screenshots/sprint-2-complete.png`
