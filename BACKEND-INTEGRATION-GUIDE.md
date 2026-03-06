# Backend Integration Guide — Microsoft Dynamics 365 & Payment Providers

## Architecture Overview

The website has a **service abstraction layer** that sits between the API routes and the data source. Currently, all services use **Prisma (local DB)** as a placeholder. To integrate with external systems, you only need to modify **two files** — everything else (API routes, frontend, admin panel) stays untouched.

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│  Public Pages  │  Personal Area  │  Admin Backoffice     │
└───────┬────────┴───────┬─────────┴───────┬──────────────┘
        │                │                 │
        ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                  NEXT.JS API ROUTES                      │
│  /api/contact  │  /api/user/*  │  /api/admin/*           │
└───────┬────────┴───────┬───────┴─────────┬──────────────┘
        │                │                 │
        ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│              SERVICE ABSTRACTION LAYER                    │
│                                                          │
│  crm-service.ts          │  payment-service.ts           │
│  (Users, Contacts, Docs) │  (Transactions, Payments)     │
└───────┬──────────────────┴───────┬──────────────────────┘
        │                          │
        ▼                          ▼
┌───────────────────┐  ┌───────────────────────────┐
│ Microsoft          │  │ Payment Provider           │
│ Dynamics 365       │  │ (Stripe / PayTabs /        │
│ Web API            │  │  HyperPay / etc.)          │
└───────────────────┘  └───────────────────────────┘
```

---

## Files to Modify

| File | Purpose | Integrates With |
|------|---------|-----------------|
| `src/lib/services/crm-service.ts` | Users, contacts, documents, KYC | Microsoft Dynamics 365 |
| `src/lib/services/payment-service.ts` | Deposits, withdrawals, transactions | Payment gateway |

**That's it.** No other files need to change.

---

## 1. Microsoft Dynamics 365 Integration

### File: `src/lib/services/crm-service.ts`

### Entity Mapping

| Website Entity | Dynamics 365 Entity | Dynamics API Endpoint |
|----------------|---------------------|----------------------|
| User | Contact | `/contacts` |
| ContactRequest | Lead or Case (incident) | `/leads` or `/incidents` |
| UserDocument | Annotation (or SharePoint) | `/annotations` |

### Environment Variables Needed

```env
DYNAMICS_BASE_URL=https://yourorg.crm.dynamics.com/api/data/v9.2
DYNAMICS_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DYNAMICS_CLIENT_SECRET=your-client-secret
DYNAMICS_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Authentication

Use OAuth2 client-credentials flow against Azure AD. A scaffolded helper is in the file — implement it like this:

```typescript
async function getDynamicsToken(): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: DYNAMICS_CLIENT_ID,
      client_secret: DYNAMICS_CLIENT_SECRET,
      scope: `${DYNAMICS_BASE_URL}/.default`,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function dynamicsFetch(endpoint: string, options?: RequestInit) {
  const token = await getDynamicsToken();
  return fetch(`${DYNAMICS_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      ...options?.headers,
    },
  });
}
```

### Functions to Replace

Each function has a comment showing the equivalent Dynamics 365 API call. Here's the full list:

#### Users (Contact entity)

| Function | Current (Prisma) | Replace With (Dynamics 365) |
|----------|-----------------|----------------------------|
| `getUsers({ search, page, limit })` | `prisma.user.findMany(...)` | `GET /contacts?$filter=contains(firstname,'{search}')&$top={limit}&$skip={skip}&$count=true` |
| `getUserById(id)` | `prisma.user.findUnique(...)` | `GET /contacts({id})?$select=firstname,lastname,...` |
| `getUserByEmail(email)` | `prisma.user.findFirst(...)` | `GET /contacts?$filter=emailaddress1 eq '{email}'&$top=1` |
| `getUserByAccountId(accountId)` | `prisma.user.findFirst(...)` | `GET /contacts?$filter=accountnumber eq '{accountId}'&$top=1` |
| `createUser(data)` | `prisma.user.create(...)` | `POST /contacts` with `{ firstname, lastname, emailaddress1, telephone1, ... }` |
| `updateUser(id, data)` | `prisma.user.update(...)` | `PATCH /contacts({id})` with `{ firstname, lastname, ... }` |
| `updateUserPassword(id, hash)` | `prisma.user.update(...)` | Call Azure AD B2C API or identity provider — passwords should NOT be stored in Dynamics |
| `updateUserAvatar(id, url)` | `prisma.user.update(...)` | `PATCH /contacts({id})` with `{ entityimage: base64 }` or custom URL field |
| `isAccountIdTaken(accountId)` | `prisma.user.findFirst(...)` | `GET /contacts?$filter=accountnumber eq '{id}'&$top=1&$select=contactid` |

#### Contact Requests (Lead / Case entity)

| Function | Current (Prisma) | Replace With (Dynamics 365) |
|----------|-----------------|----------------------------|
| `getContactRequests({ status, page, limit })` | `prisma.contactRequest.findMany(...)` | `GET /leads?$filter=statecode eq {status}&$top={limit}&$skip={skip}&$count=true` |
| `createContactRequest(data)` | `prisma.contactRequest.create(...)` | `POST /leads` with `{ subject, firstname, lastname, emailaddress1, description }` |
| `updateContactRequestStatus(id, status)` | `prisma.contactRequest.update(...)` | `PATCH /leads({id})` with `{ statecode: newStatus }` |

#### Documents / KYC (Annotation entity)

| Function | Current (Prisma) | Replace With (Dynamics 365) |
|----------|-----------------|----------------------------|
| `getDocuments({ status, userId, page, limit })` | `prisma.userDocument.findMany(...)` | `GET /annotations?$filter=_objectid_value eq '{userId}'&$top={limit}` |
| `getUserDocuments(userId)` | `prisma.userDocument.findMany(...)` | `GET /annotations?$filter=_objectid_value eq '{userId}'` |
| `createDocument(data)` | `prisma.userDocument.create(...)` | `POST /annotations` with `{ objectid_contact@odata.bind, subject, documentbody (base64), filename }` |
| `updateDocumentStatus(id, status)` | `prisma.userDocument.update(...)` | `PATCH /annotations({id})` with status custom field |

---

## 2. Payment Provider Integration

### File: `src/lib/services/payment-service.ts`

### Environment Variables Needed

```env
PAYMENT_PROVIDER_API_URL=https://api.yourprovider.com/v1
PAYMENT_PROVIDER_API_KEY=sk_live_xxxxxxxxxxxx
PAYMENT_PROVIDER_MERCHANT_ID=merchant_xxxx
PAYMENT_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### Functions to Replace

| Function | Current (Prisma) | Replace With (Payment API) |
|----------|-----------------|---------------------------|
| `getTransactions({ userId, type, status, page, limit })` | `prisma.transaction.findMany(...)` | `GET /transactions?customer={userId}&type={type}` |
| `getUserTransactions(params)` | Same as above | Same as above, filtered by user |
| `createTransaction(data)` | `prisma.transaction.create(...)` | `POST /charges` (deposits) or `POST /payouts` (withdrawals) |
| `createDepositWithProof(data)` | `prisma.transaction.create(...)` | Create pending deposit + upload proof to provider |
| `createWithdrawalRequest(data)` | `prisma.transaction.create(...)` | `POST /payouts` with bank/wallet details |
| `updateTransaction(id, data)` | `prisma.transaction.update(...)` | `PATCH /transactions/{id}` or handle via webhooks |
| `deleteTransaction(id)` | `prisma.transaction.delete(...)` | `DELETE /transactions/{id}` or mark as void |

### Webhook Setup

Payment status updates should come via webhooks. A scaffolded handler is in the file:

1. Create a new API route at `src/app/api/payments/webhook/route.ts`
2. Verify the webhook signature using `PAYMENT_WEBHOOK_SECRET`
3. Call `updateTransaction()` to update status based on event type:
   - `charge.succeeded` → status = `"Completed"`
   - `charge.failed` → status = `"Failed"`
   - `payout.paid` → status = `"Completed"`

```typescript
// src/app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateTransaction } from "@/lib/services/payment-service";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("x-webhook-signature") || "";

  // 1. Verify signature
  // 2. Parse event
  // 3. Update transaction status

  return NextResponse.json({ received: true });
}
```

---

## 3. What Stays in Local Database (No Changes Needed)

These are **CMS content** managed by the admin backoffice. They stay in Prisma/Turso and do NOT need external integration:

| Feature | API Routes |
|---------|-----------|
| Blog articles | `/api/admin/blog/*` |
| Videos | `/api/admin/videos/*` |
| FAQ | `/api/admin/faq` |
| Legal pages (Terms, Privacy) | `/api/admin/legal/*` |
| Economic developments | `/api/admin/economic-developments/*` |
| Account types | `/api/admin/account-types/*` |
| Homepage sections | `/api/admin/homepage/*` |
| Footer & navigation | `/api/admin/footer/*` |
| Islamic rulings | `/api/admin/islamic-rulings` |
| About page | `/api/admin/about/*` |
| Website settings | `/api/admin/website-settings/*` |
| SEO settings | `/api/admin/seo-settings/*` |
| Payment config (admin-managed) | `/api/admin/payments/*` |
| Admin auth | `/api/admin/auth/*` |

---

## 4. Email & SMS Integration (TODO)

Two auth flows need external service integration:

### Password Reset Email
- **File:** `src/app/api/user/auth/forgot-password/route.ts`
- **Current:** Generates a JWT reset token and logs it to console
- **Needed:** Send email with link `/reset-password?token=<token>`
- **Options:** SendGrid, AWS SES, or Dynamics 365 email activities

### OTP Verification (SMS / Email)
- **File:** `src/app/api/user/auth/send-otp/route.ts`
- **Current:** Generates 6-digit OTP and logs to console
- **File:** `src/app/api/user/auth/verify-code/route.ts`
- **Current:** Accepts any 6-digit code
- **Needed:** Store OTP in Redis/DB, verify against stored value
- **Options:** Twilio (SMS), SendGrid (email), or Dynamics 365 workflows

---

## 5. API Routes → Service Function Mapping

Quick reference showing which API route calls which service function:

### CRM Service (`crm-service.ts`)

| API Route | Method | Service Function |
|-----------|--------|-----------------|
| `/api/admin/users` | GET | `getUsers()` |
| `/api/admin/users/[id]` | GET | `getUserById()` + `getUserDocuments()` + `getUserContactRequests()` |
| `/api/admin/users/[id]` | PATCH | `updateUser()` |
| `/api/admin/contact-requests` | GET | `getContactRequests()` |
| `/api/admin/contact-requests/[id]` | PATCH | `updateContactRequestStatus()` |
| `/api/admin/documents` | GET | `getDocuments()` |
| `/api/admin/documents/[id]` | PATCH | `updateDocumentStatus()` |
| `/api/user/auth/login` | POST | `getUserByAccountId()` |
| `/api/user/auth/register` | POST | `getUserByEmail()` + `isAccountIdTaken()` + `createUser()` |
| `/api/user/auth/me` | GET | `getUserById()` |
| `/api/user/auth/forgot-password` | POST | `getUserByEmail()` |
| `/api/user/auth/reset-password` | POST | `getUserById()` + `updateUserPassword()` |
| `/api/user/profile` | GET | `getUserById()` |
| `/api/user/profile` | PUT | `updateUser()` |
| `/api/user/avatar` | POST | `updateUserAvatar()` |
| `/api/user/change-password` | POST | `updateUserPassword()` |
| `/api/user/documents` | GET | `getUserDocuments()` |
| `/api/user/documents` | POST | `createDocument()` |
| `/api/user/contact` | POST | `createContactRequest()` |
| `/api/contact` | POST | `createContactRequest()` |

### Payment Service (`payment-service.ts`)

| API Route | Method | Service Function |
|-----------|--------|-----------------|
| `/api/admin/transactions` | GET | `getTransactions()` |
| `/api/admin/transactions` | POST | `createTransaction()` |
| `/api/admin/transactions/[id]` | PATCH | `updateTransaction()` |
| `/api/admin/transactions/[id]` | DELETE | `deleteTransaction()` |
| `/api/admin/users/[id]` | GET | `getUserTransactions()` (related data) |
| `/api/user/transactions` | GET | `getUserTransactions()` |
| `/api/user/deposit-proof` | POST | `createDepositWithProof()` |
| `/api/withdrawal/request` | POST | `createWithdrawalRequest()` |

---

## 6. Step-by-Step Integration Checklist

### Phase 1 — Dynamics 365
- [ ] Register Azure AD application and get credentials
- [ ] Add environment variables (`DYNAMICS_BASE_URL`, `DYNAMICS_CLIENT_ID`, etc.)
- [ ] Implement `getDynamicsToken()` and `dynamicsFetch()` in `crm-service.ts`
- [ ] Map Dynamics Contact entity fields to our User fields
- [ ] Replace `getUsers()` and `getUserById()` — test admin users page
- [ ] Replace `createUser()` — test registration flow
- [ ] Replace `getUserByAccountId()` and `getUserByEmail()` — test login + forgot password
- [ ] Replace `updateUser()` and `updateUserPassword()` — test profile edit + password change
- [ ] Replace contact request functions — test contact form + admin contact requests page
- [ ] Replace document functions — test KYC upload + admin documents page
- [ ] Verify admin backoffice CRM pages load correctly

### Phase 2 — Payment Provider
- [ ] Choose and configure payment provider (Stripe / PayTabs / HyperPay)
- [ ] Add environment variables (`PAYMENT_PROVIDER_API_URL`, etc.)
- [ ] Replace `createTransaction()` — test deposit flow
- [ ] Replace `createWithdrawalRequest()` — test withdrawal flow
- [ ] Implement webhook handler at `/api/payments/webhook`
- [ ] Replace `getTransactions()` and `getUserTransactions()` — test transaction lists
- [ ] Test admin transactions page (approve/reject)
- [ ] Verify personal area transactions display correctly

### Phase 3 — Email & SMS
- [ ] Integrate email service for password reset
- [ ] Integrate SMS service for OTP
- [ ] Implement OTP storage and verification (Redis or Dynamics)
- [ ] Test full registration → email verify → phone verify flow
- [ ] Test forgot password → email → reset password flow
