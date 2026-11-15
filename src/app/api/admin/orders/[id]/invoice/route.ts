import { NextRequest, NextResponse } from 'next/server';
import { adminStore } from '@/lib/server-admin';
import { formatPrice } from '@/lib/utils';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const order = adminStore.orders.get(orderId) || Array.from(adminStore.orders.values()).find(o => o.orderNumber === orderId);

  if (!order) {
    return new NextResponse('Order not found', { status: 404 });
  }

  const invoiceHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Tax Invoice - ${order.orderNumber}</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #111;
        background: #fff;
        padding: 40px;
        margin: 0;
        max-width: 850px;
        margin: 0 auto;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #000;
        padding-bottom: 20px;
      }
      .logo {
        font-size: 28px;
        font-weight: 900;
        letter-spacing: 2px;
      }
      .tagline {
        font-size: 11px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .invoice-meta {
        text-align: right;
      }
      .title {
        font-size: 20px;
        font-weight: 800;
        margin: 0 0 6px 0;
      }
      .addresses {
        display: flex;
        justify-content: space-between;
        margin: 30px 0;
      }
      .address-box {
        width: 48%;
        font-size: 13px;
        line-height: 1.6;
      }
      .address-box strong {
        display: block;
        font-size: 14px;
        margin-bottom: 6px;
        text-transform: uppercase;
        color: #000;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 25px 0;
        font-size: 13px;
      }
      th {
        background: #f4f4f4;
        text-align: left;
        padding: 10px;
        font-weight: 700;
        text-transform: uppercase;
        border-bottom: 1px solid #ccc;
      }
      td {
        padding: 12px 10px;
        border-bottom: 1px solid #eee;
      }
      .totals {
        margin-left: auto;
        width: 320px;
        font-size: 13px;
        line-height: 1.8;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
      }
      .grand-total {
        font-size: 16px;
        font-weight: 800;
        border-top: 2px solid #000;
        border-bottom: 2px solid #000;
        padding: 8px 0;
        margin-top: 6px;
      }
      .footer {
        margin-top: 50px;
        border-top: 1px dashed #ccc;
        padding-top: 20px;
        font-size: 11px;
        color: #777;
        text-align: center;
      }
      @media print {
        body { padding: 0; }
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="no-print" style="margin-bottom: 20px; text-align: right;">
      <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #fff; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">
        Print / Save as PDF
      </button>
    </div>

    <div class="header">
      <div>
        <div class="logo">FITXXX</div>
        <div class="tagline">Official Streetwear Studio</div>
        <p style="font-size: 12px; color: #555; margin-top: 6px;">
          GSTIN: 07AAECF9921M1Z4<br/>
          Registered HQ: Indiranagar, Bengaluru, KA - 560038<br/>
          Support: +91 98163 57615 | support@fitxxx.com
        </p>
      </div>
      <div class="invoice-meta">
        <div class="title">TAX INVOICE</div>
        <div style="font-size: 13px;"><strong>Invoice No:</strong> INV-${order.orderNumber}</div>
        <div style="font-size: 13px;"><strong>Order ID:</strong> ${order.orderNumber}</div>
        <div style="font-size: 13px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        <div style="font-size: 13px;"><strong>Status:</strong> <span style="text-transform: uppercase; color: #16a34a; font-weight: bold;">${order.paymentStatus}</span></div>
      </div>
    </div>

    <div class="addresses">
      <div class="address-box">
        <strong>Sold By:</strong>
        FITXXX PRIVATE APPARELS LTD.<br/>
        Plot 402, Neo Fashion Hub<br/>
        Whitefield Main Road, Bengaluru, 560066<br/>
        Karnataka, India
      </div>
      <div class="address-box">
        <strong>Billed & Shipped To:</strong>
        ${order.customer?.name || order.shippingAddress?.fullName}<br/>
        ${order.shippingAddress?.addressLine1 || ''}<br/>
        ${order.shippingAddress?.addressLine2 ? order.shippingAddress.addressLine2 + '<br/>' : ''}
        ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pinCode}<br/>
        Phone: ${order.customer?.phone || order.shippingAddress?.phone}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th>Size</th>
          <th>Color</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || []).map((item: any, idx: number) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${item.title}</strong>${item.isCustom ? ' (Custom Bespoke Print)' : ''}</td>
            <td>${item.size}</td>
            <td>${item.colorName || item.color}</td>
            <td>${item.quantity}</td>
            <td>₹${Number(item.price).toLocaleString('en-IN')}</td>
            <td style="text-align: right;">₹${(Number(item.price) * item.quantity).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>₹${Number(order.subtotal || order.total).toLocaleString('en-IN')}</span>
      </div>
      ${order.discount ? `
      <div class="totals-row" style="color: #16a34a;">
        <span>Promotional Discount:</span>
        <span>- ₹${Number(order.discount).toLocaleString('en-IN')}</span>
      </div>` : ''}
      <div class="totals-row">
        <span>Estimated GST (12%):</span>
        <span>₹${Number(order.tax || Math.round((order.total || 0) * 0.12)).toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row">
        <span>Shipping & Handling:</span>
        <span>${order.shipping > 0 ? `₹${order.shipping}` : 'FREE (Special Offer)'}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total Paid:</span>
        <span>₹${Number(order.total).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for evolving with FITXXX. All bespoke items are crafted in limited batches.</p>
      <p>This is a computer-generated tax invoice and requires no physical signature.</p>
    </div>
  </body>
  </html>
  `;

  return new NextResponse(invoiceHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
