import { NextRequest, NextResponse } from 'next/server';
import { adminStore } from '@/lib/server-admin';

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Enter a valid coupon code' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = adminStore.coupons.get(cleanCode);

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' }, { status: 400 });
    }

    const total = Number(orderTotal || 0);
    if (total < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order value for this coupon is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`,
      }, { status: 400 });
    }

    // Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((total * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, total);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      description: coupon.description,
      message: `Coupon applied: Saved ₹${discountAmount.toLocaleString('en-IN')}`,
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
