import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { deductInventoryAtomic, recordPaidOrder } from '@/lib/server-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderId, 
      orderDetails 
    } = body;

    if (!razorpay_payment_id || !orderId) {
      return NextResponse.json({ error: 'Missing required payment verification parameters' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'fitxxx_secret_key_mock_demo';

    // Verify HMAC SHA256 signature
    let isSignatureValid = false;
    if (razorpay_signature && razorpay_order_id) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      try {
        const bufGen = Buffer.from(generatedSignature);
        const bufSig = Buffer.from(razorpay_signature);
        if (bufGen.length === bufSig.length) {
          isSignatureValid = crypto.timingSafeEqual(bufGen, bufSig);
        }
      } catch {
        isSignatureValid = false;
      }

      // Allow mock signature match only in non-production environments when mock key is present
      if (!isSignatureValid && process.env.NODE_ENV !== 'production' && secret.includes('mock')) {
        isSignatureValid = true;
      }
    } else if (process.env.NODE_ENV !== 'production') {
      // In local dev without Razorpay keys
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed. Cryptographic fraud protection triggered.' },
        { status: 400 }
      );
    }

    const orderNumber = `FITXXX-${orderId.substring(Math.max(0, orderId.length - 6)).toUpperCase()}`;
    const items = orderDetails?.items || [];

    // Atomically deduct inventory for all items
    if (items.length > 0) {
      const deduction = deductInventoryAtomic(items, orderNumber);
      if (!deduction.success) {
        return NextResponse.json(
          { error: deduction.error || 'Inventory deduction failed: items sold out concurrently' },
          { status: 409 }
        );
      }
    }

    // Record verified order in business management ledger
    const savedOrder = recordPaidOrder({
      id: orderId,
      orderNumber,
      customer: {
        name: orderDetails?.shippingAddress?.fullName || 'Valued Customer',
        email: orderDetails?.shippingAddress?.email || 'customer@fitxxx.com',
        phone: orderDetails?.shippingAddress?.phone || '+91 98000 00000',
      },
      shippingAddress: orderDetails?.shippingAddress || {},
      items: items,
      subtotal: Number(orderDetails?.subtotal || 0),
      discount: Number(orderDetails?.discount || 0),
      shipping: Number(orderDetails?.shipping || 0),
      tax: Number(orderDetails?.tax || 0),
      total: Number(orderDetails?.total || 0),
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      couponCode: orderDetails?.couponCode,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      orderNumber,
      orderId,
      paymentId: razorpay_payment_id,
      paymentStatus: 'paid',
      order: savedOrder,
      timestamp: new Date().toISOString(),
      productionStatus: 'confirmed',
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Verification failure' }, { status: 500 });
  }
}
