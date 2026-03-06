/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CRM Service — Microsoft Dynamics 365 Integration Layer
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This service abstracts all CRM operations (users, contacts, documents).
 * Currently uses Prisma as a local placeholder — replace each method body
 * with Microsoft Dynamics 365 Web API calls when ready.
 *
 * Dynamics 365 Web API docs:
 *   https://learn.microsoft.com/en-us/power-apps/developer/data-verse/webapi/overview
 *
 * Entity Mapping:
 *   - User          → Dynamics Contact (contact) entity
 *   - ContactRequest → Dynamics Lead (lead) or Case (incident) entity
 *   - UserDocument   → Dynamics Annotation (annotation) or SharePoint
 *
 * Environment Variables (add when integrating):
 *   DYNAMICS_BASE_URL    — e.g. https://yourorg.crm.dynamics.com/api/data/v9.2
 *   DYNAMICS_CLIENT_ID   — Azure AD app registration client ID
 *   DYNAMICS_CLIENT_SECRET — Azure AD app registration secret
 *   DYNAMICS_TENANT_ID   — Azure AD tenant ID
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { prisma } from "@/lib/prisma";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CrmUser {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  profession: string;
  additionalPhone: string;
  annualIncome: string;
  avatarUrl: string | null;
  createdAt: Date;
}

export interface CrmUserListItem {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  createdAt: Date;
}

export interface CrmContactRequest {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  reason: string;
  requestType: string;
  topicDetails: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrmDocument {
  id: string;
  userId: string;
  docKey: string;
  face: string;
  fileUrl: string;
  originalName: string;
  status: string;
  createdAt: Date;
  user?: { firstName: string; lastName: string; email: string };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  profession?: string;
  additionalPhone?: string;
  annualIncome?: string;
}

// ─── Dynamics 365 Auth Helper (implement when integrating) ──────────────────

/**
 * TODO: Implement OAuth2 client-credentials flow for Dynamics 365.
 *
 * async function getDynamicsToken(): Promise<string> {
 *   const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
 *   const res = await fetch(tokenUrl, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/x-www-form-urlencoded" },
 *     body: new URLSearchParams({
 *       grant_type: "client_credentials",
 *       client_id: DYNAMICS_CLIENT_ID,
 *       client_secret: DYNAMICS_CLIENT_SECRET,
 *       scope: `${DYNAMICS_BASE_URL}/.default`,
 *     }),
 *   });
 *   const data = await res.json();
 *   return data.access_token;
 * }
 *
 * async function dynamicsFetch(endpoint: string, options?: RequestInit) {
 *   const token = await getDynamicsToken();
 *   return fetch(`${DYNAMICS_BASE_URL}${endpoint}`, {
 *     ...options,
 *     headers: {
 *       Authorization: `Bearer ${token}`,
 *       "Content-Type": "application/json",
 *       "OData-MaxVersion": "4.0",
 *       "OData-Version": "4.0",
 *       ...options?.headers,
 *     },
 *   });
 * }
 */

// ═══════════════════════════════════════════════════════════════════════════════
// USER OPERATIONS — Maps to Dynamics 365 "Contact" entity
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * List users with search & pagination.
 *
 * Dynamics 365 equivalent:
 *   GET /contacts?$filter=contains(firstname,'{search}') or contains(lastname,'{search}')
 *   &$top={limit}&$skip={skip}&$count=true&$orderby=createdon desc
 */
export async function getUsers(params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<CrmUserListItem>> {
  const { search, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { accountId: { contains: search } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        accountId: true,
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

/**
 * Get single user by ID with full profile.
 *
 * Dynamics 365 equivalent:
 *   GET /contacts({id})?$select=firstname,lastname,emailaddress1,...
 */
export async function getUserById(id: string): Promise<CrmUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      accountId: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      dateOfBirth: true,
      address: true,
      city: true,
      postalCode: true,
      country: true,
      profession: true,
      additionalPhone: true,
      annualIncome: true,
      avatar: true,
      createdAt: true,
    },
  });
  if (!user) return null;
  return { ...user, avatarUrl: user.avatar } as CrmUser;
}

/**
 * Get user by email (for auth).
 *
 * Dynamics 365 equivalent:
 *   GET /contacts?$filter=emailaddress1 eq '{email}'&$top=1
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findFirst({ where: { email } });
}

/**
 * Get user by accountId (for login).
 *
 * Dynamics 365 equivalent:
 *   GET /contacts?$filter=accountnumber eq '{accountId}'&$top=1
 */
export async function getUserByAccountId(accountId: string) {
  return prisma.user.findFirst({ where: { accountId } });
}

/**
 * Create a new user (registration).
 *
 * Dynamics 365 equivalent:
 *   POST /contacts
 *   Body: { firstname, lastname, emailaddress1, telephone1, ... }
 */
export async function createUser(data: {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  passwordHash: string;
  country?: string;
}) {
  return prisma.user.create({ data });
}

/**
 * Update user profile.
 *
 * Dynamics 365 equivalent:
 *   PATCH /contacts({id})
 *   Body: { firstname, lastname, emailaddress1, ... }
 */
export async function updateUser(id: string, data: UserUpdateData) {
  return prisma.user.update({ where: { id }, data });
}

/**
 * Update user password hash.
 *
 * Dynamics 365: Passwords are typically NOT stored in Dynamics.
 * Auth would use Azure AD B2C or a separate identity provider.
 * This function would become a no-op or call the identity provider API.
 */
export async function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}

/**
 * Update user avatar URL.
 *
 * Dynamics 365 equivalent:
 *   PATCH /contacts({id})
 *   Body: { entityimage: base64EncodedImage } (or store URL in custom field)
 */
export async function updateUserAvatar(id: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id },
    data: { avatar: avatarUrl },
  });
}

/**
 * Check if accountId is already taken.
 */
export async function isAccountIdTaken(accountId: string): Promise<boolean> {
  const existing = await prisma.user.findFirst({ where: { accountId } });
  return !!existing;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT REQUEST OPERATIONS — Maps to Dynamics 365 "Lead" or "Case" entity
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * List contact requests with filters.
 *
 * Dynamics 365 equivalent (as Lead):
 *   GET /leads?$filter=statecode eq {status}&$top={limit}&$skip={skip}
 *   &$orderby=createdon desc&$count=true
 */
export async function getContactRequests(params: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<CrmContactRequest>> {
  const { status, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [items, total] = await Promise.all([
    prisma.contactRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactRequest.count({ where }),
  ]);

  return { items, total };
}

/**
 * Create a contact request.
 *
 * Dynamics 365 equivalent:
 *   POST /leads (or POST /incidents for Cases)
 *   Body: { subject, firstname, lastname, emailaddress1, telephone1, description }
 */
export async function createContactRequest(data: {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  reason: string;
  requestType: string;
  topicDetails: string;
}) {
  return prisma.contactRequest.create({ data });
}

/**
 * Update contact request status.
 *
 * Dynamics 365 equivalent:
 *   PATCH /leads({id}) or /incidents({id})
 *   Body: { statecode: newStatus }
 */
export async function updateContactRequestStatus(id: string, status: string) {
  return prisma.contactRequest.update({
    where: { id },
    data: { status },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT OPERATIONS — Maps to Dynamics 365 "Annotation" or SharePoint
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * List documents with filters.
 *
 * Dynamics 365 equivalent:
 *   GET /annotations?$filter=_objectid_value eq '{userId}'
 *   &$top={limit}&$skip={skip}&$orderby=createdon desc
 */
export async function getDocuments(params: {
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<CrmDocument>> {
  const { status, userId, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const [items, total] = await Promise.all([
    prisma.userDocument.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.userDocument.count({ where }),
  ]);

  // Enrich with user info
  const userIds = [...new Set(items.map((d: { userId: string }) => d.userId))];
  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, firstName: true, lastName: true, email: true },
      })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const enriched = items.map((doc: { userId: string }) => ({
    ...doc,
    user: userMap.get(doc.userId) || undefined,
  }));

  return { items: enriched as CrmDocument[], total };
}

/**
 * Get documents for a specific user.
 *
 * Dynamics 365 equivalent:
 *   GET /annotations?$filter=_objectid_value eq '{userId}'
 */
export async function getUserDocuments(userId: string) {
  return prisma.userDocument.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Create a document record.
 *
 * Dynamics 365 equivalent:
 *   POST /annotations
 *   Body: { objectid_contact@odata.bind, subject, documentbody (base64), filename, mimetype }
 */
export async function createDocument(data: {
  userId: string;
  docKey: string;
  face: string;
  fileUrl: string;
  originalName: string;
}) {
  return prisma.userDocument.create({
    data: {
      userId: data.userId,
      docKey: data.docKey,
      face: data.face,
      url: data.fileUrl,
      fileName: data.originalName,
    },
  });
}

/**
 * Update document status (approve/reject).
 *
 * Dynamics 365 equivalent:
 *   PATCH /annotations({id})
 *   Body: { statecode: approved/rejected custom field }
 */
export async function updateDocumentStatus(id: string, status: string) {
  return prisma.userDocument.update({
    where: { id },
    data: { status },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// RELATED DATA FETCHERS (for user detail views)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get user's transactions (for admin user detail view).
 *
 * Dynamics 365: Transactions may come from payment provider, not Dynamics.
 * See payment-service.ts for transaction operations.
 */
export async function getUserTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 20,
  });
}

/**
 * Get user's contact requests (for admin user detail view).
 */
export async function getUserContactRequests(userId: string) {
  return prisma.contactRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
