import { NextRequest, NextResponse } from 'next/server';
import { calculateAnalytics, verifyAdminAccess, adminStore } from '@/lib/server-admin';

export async function GET(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get('format');

  const analytics = calculateAnalytics();

  // If CSV export is requested:
  if (format === 'csv') {
    const orders = Array.from(adminStore.orders.values());
    const csvHeader = 'Order Number,Date,Customer Name,Customer Email,Status,Items,Subtotal,Discount,Tax,Total,Payment Method,Payment Status\n';
    const csvRows = orders.map(o => {
      const dateStr = new Date(o.createdAt).toISOString().split('T')[0];
      const itemsCount = o.items ? o.items.length : 0;
      return `"${o.orderNumber}","${dateStr}","${o.customer.name}","${o.customer.email}","${o.status}","${itemsCount}","${o.subtotal}","${o.discount}","${o.tax}","${o.total}","${o.paymentMethod}","${o.paymentStatus}"`;
    }).join('\n');

    return new NextResponse(csvHeader + csvRows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fitxxx_sales_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({
    success: true,
    analytics,
  });
}
