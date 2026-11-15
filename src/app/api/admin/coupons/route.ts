import { NextRequest, NextResponse } from 'next/server';
import { adminStore, logAuditAction, verifyAdminAccess } from '@/lib/server-admin';
import { CouponItem } from '@/types/admin';

export async function GET(_req: NextRequest) {
  const coupons = Array.from(adminStore.coupons.values());
  return NextResponse.json({
    success: true,
    coupons,
  });
}

export async function POST(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN']);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const body = await req.json();
    const { code, description, discountType, discountValue, minOrderValue, maxDiscountAmount, expiresAt, maxUses, applicableCategories } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ success: false, error: 'Code and discount value are required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    if (adminStore.coupons.has(cleanCode)) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }

    const newCoupon: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: cleanCode,
      description: description || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off`,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue || 0),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      startsAt: new Date().toISOString(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      maxUses: maxUses ? Number(maxUses) : undefined,
      usedCount: 0,
      perCustomerLimit: 1,
      isActive: true,
      applicableCategories: applicableCategories || [],
      createdAt: new Date().toISOString(),
    };

    adminStore.coupons.set(cleanCode, newCoupon);

    logAuditAction(
      'COUPON_CREATED',
      'coupon',
      cleanCode,
      null,
      newCoupon,
      `Created coupon ${cleanCode}`,
      user?.email
    );

    return NextResponse.json({
      success: true,
      coupon: newCoupon,
      message: `Coupon ${cleanCode} created successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
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
    const { code, isActive } = body;

    const coupon = adminStore.coupons.get(code);
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    const oldState = coupon.isActive;
    coupon.isActive = Boolean(isActive);
    adminStore.coupons.set(code, coupon);

    logAuditAction(
      'COUPON_TOGGLED',
      'coupon',
      code,
      { isActive: oldState },
      { isActive: coupon.isActive },
      `Coupon ${code} toggled to ${coupon.isActive ? 'Active' : 'Disabled'}`,
      user?.email
    );

    return NextResponse.json({
      success: true,
      coupon,
      message: `Coupon ${code} is now ${coupon.isActive ? 'Active' : 'Disabled'}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
