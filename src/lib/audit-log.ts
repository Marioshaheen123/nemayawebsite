import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "upload"
  | "content-replace"
  | "settings-change";

export interface AuditEntry {
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: string;
  ip: string;
}

/**
 * Write an audit log entry. Fire-and-forget — never crashes the request.
 */
export async function logAuditEvent(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: entry.adminId,
        adminEmail: entry.adminEmail,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId ?? null,
        details: entry.details?.slice(0, 5000) ?? null,
        ip: entry.ip,
      },
    });
  } catch (err) {
    // Audit logging must never break the request
    console.error("[AUDIT] Failed to write:", err);
  }
}
