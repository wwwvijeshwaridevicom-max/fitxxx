import { NextRequest, NextResponse } from 'next/server';
import { adminStore, logAuditAction, verifyAdminAccess } from '@/lib/server-admin';
import { OrderLifecycleStatus } from '@/types/admin';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const searchQuery = url.searchParams.get('search')?.toLowerCase();

  let orders = Array.from(adminStore.orders.values());

  if (statusFilter && statusFilter !== 'all') {
    orders = orders.filter(o => o.status === statusFilter);
  }

  if (searchQuery) {
    orders = orders.filter(o => 
      o.orderNumber.toLowerCase().includes(searchQuery) ||
      o.customer.name.toLowerCase().includes(searchQuery) ||
      o.customer.email.toLowerCase().includes(searchQuery) ||
      o.customer.phone.includes(searchQuery)
    );
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    success: true,
    orders,
    count: orders.length,
  });
}

export async function PUT(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN, SUPPORT_STAFF allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN', 'SUPPORT_STAFF']);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const body = await req.json();
    const { orderId, status, courierPartner, trackingNumber, trackingUrl, internalNotes } = body;

    const order = adminStore.orders.get(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const oldStatus = order.status;
    const updates: any = { updatedAt: new Date().toISOString() };

    if (status && status !== oldStatus) {
      updates.status = status as OrderLifecycleStatus;
      if (status === 'refunded') {
        updates.paymentStatus = 'refunded';
      }
      logAuditAction(
        'STATUS_CHANGE',
        'order',
        order.orderNumber,
        { status: oldStatus },
        { status },
        `Status transitioned to ${status}`,
        user?.email
      );
    }

    if (courierPartner !== undefined) updates.courierPartner = courierPartner;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updates.trackingUrl = trackingUrl;
    if (internalNotes !== undefined) updates.internalNotes = internalNotes;

    const updatedOrder = { ...order, ...updates };
    adminStore.orders.set(orderId, updatedOrder);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
