import { NextRequest, NextResponse } from 'next/server';
import { adminStore, logAuditAction, verifyAdminAccess } from '@/lib/server-admin';

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    success: true,
    settings: adminStore.settings,
  });
}

export async function PUT(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN']);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const body = await req.json();
    const oldSettings = { ...adminStore.settings };
    adminStore.settings = { ...adminStore.settings, ...body };

    logAuditAction(
      'STATUS_CHANGE',
      'setting',
      'store_settings',
      oldSettings,
      adminStore.settings,
      'Site configuration updated',
      user?.email
    );

    return NextResponse.json({
      success: true,
      settings: adminStore.settings,
      message: 'Store settings saved successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
