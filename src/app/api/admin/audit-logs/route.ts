import { NextRequest, NextResponse } from 'next/server';
import { adminStore, verifyAdminAccess } from '@/lib/server-admin';

export async function GET(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  return NextResponse.json({
    success: true,
    logs: adminStore.auditLogs,
    count: adminStore.auditLogs.length,
  });
}
