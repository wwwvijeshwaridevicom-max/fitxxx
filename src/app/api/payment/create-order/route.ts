import { NextRequest, NextResponse } from 'next/server';
import { adminStore } from '@/lib/server-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, couponCode, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // SERVER-SIDE RE-CALCULATION & INVENTORY VERIFICATION: Never trust client amount!
    let subtotal = 0;
    for (const item of items) {
      const itemPrice = Number(item.price);
      const qty = Number(item.quantity);
      if (isNaN(itemPrice) || isNaN(qty) || qty <= 0) {
        return NextResponse.json({ error: 'Invalid item price or quantity' }, { status: 400 });
      }

      // Check stock availability in matrix inventory
      if (item.productId && item.size) {
        let invItem = item.color ? adminStore.inventory.get(`${item.productId}-${item.color}-${item.size}`) : undefined;
        if (!invItem) {
          for (const val of Array.from(adminStore.inventory.values())) {
            if (val.productId === item.productId && val.size === item.size) {
              invItem = val;
              break;
            }
          }
        }

        if (invItem && invItem.stockCount < qty) {
          return NextResponse.json(
            { error: `Sorry, ${item.title || item.productId} (Size: ${item.size}) has only ${invItem.stockCount} units remaining in stock.` },
            { status: 400 }
          );
        }
      }

      subtotal += itemPrice * qty;
    }

    // Server-side dynamic coupon calculation from adminStore
    let discount = 0;
    let appliedCouponObj: any = null;

    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = adminStore.coupons.get(cleanCode);

      if (coupon && coupon.isActive) {
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt).getTime() > Date.now();
        const withinLimits = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
        const meetsMinOrder = subtotal >= coupon.minOrderValue;

        if (notExpired && withinLimits && meetsMinOrder) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
              discount = coupon.maxDiscountAmount;
            }
          } else {
            discount = Math.min(coupon.discountValue, subtotal);
          }
          appliedCouponObj = coupon;
        }
      }
    }

    const freeShippingThreshold = adminStore.settings?.freeShippingThreshold || 2999;
    const standardFee = adminStore.settings?.standardShippingFee || 149;
    const shipping = subtotal >= freeShippingThreshold ? 0 : standardFee;
    const taxRate = (adminStore.settings?.taxRatePercent || 12) / 100;
    const tax = Math.round(Math.max(0, subtotal - discount) * taxRate);
    const totalAmount = Math.max(0, subtotal - discount + shipping + tax);

    // Generate Unique Order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const razorpayOrderId = `rzp_order_${Date.now()}`;

    return NextResponse.json({
      success: true,
      orderId,
      razorpayOrderId,
      amount: totalAmount * 100, // In Paise for Razorpay
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_fitxxxDemoKey',
      calculatedSummary: {
        subtotal,
        discount,
        shipping,
        tax,
        total: totalAmount,
        couponCode: appliedCouponObj?.code || null,
      },
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
