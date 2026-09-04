import type { AuditActionType, AuditEntry, Session } from "@/types";

export function createAuditEntry(
  actionType: AuditActionType,
  description: string,
  xpDelta: number,
  snapshot: Session | null,
  relatedEntryId?: string
): AuditEntry {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    actionType,
    description,
    xpDelta,
    snapshot,
    relatedEntryId,
  };
}

export function describeSession(session: Pick<Session, "discipline" | "date">): string {
  const discipline = session.discipline?.replace("_", " ") ?? "sesión";
  return `${discipline} del ${session.date}`;
}
