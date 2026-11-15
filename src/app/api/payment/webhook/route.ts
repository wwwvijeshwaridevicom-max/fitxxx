import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminStore, logAuditAction } from '@/lib/server-admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'fitxxx_webhook_secret_key';

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    // Verify webhook HMAC SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    let isValid = false;
    try {
      const bufExp = Buffer.from(expectedSignature);
      const bufSig = Buffer.from(signature);
      if (bufExp.length === bufSig.length) {
        isValid = crypto.timingSafeEqual(bufExp, bufSig);
      }
    } catch {
      isValid = false;
    }

    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;
    const orderId = payment?.notes?.orderId || payment?.order_id;

    if (event === 'payment.captured') {
      if (orderId && adminStore.orders.has(orderId)) {
        const order = adminStore.orders.get(orderId);
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.razorpayPaymentId = payment.id;
        adminStore.orders.set(orderId, order);
      }
      logAuditAction('STATUS_CHANGE', 'order', orderId || 'webhook', null, { event, paymentId: payment?.id }, 'Razorpay Webhook: payment.captured', 'razorpay-webhook');
    } else if (event === 'refund.processed') {
      if (orderId && adminStore.orders.has(orderId)) {
        const order = adminStore.orders.get(orderId);
        order.paymentStatus = 'refunded';
        order.status = 'refunded';
        adminStore.orders.set(orderId, order);
      }
      logAuditAction('ORDER_REFUNDED', 'order', orderId || 'webhook', null, { event, amount: payment?.amount_refunded }, 'Razorpay Webhook: refund.processed', 'razorpay-webhook');
    }

    return NextResponse.json({ status: 'ok', eventReceived: event });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
