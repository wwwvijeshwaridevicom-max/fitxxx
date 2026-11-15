import { NextRequest, NextResponse } from 'next/server';
import { adminStore } from '@/lib/server-admin';
import { SupportTicket, TicketCategory } from '@/types/admin';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email')?.toLowerCase();
  const ticketId = url.searchParams.get('ticketId');

  let tickets = Array.from(adminStore.tickets.values());

  if (ticketId) {
    const found = adminStore.tickets.get(ticketId);
    if (!found) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }
    // Filter out internal notes for customer view
    const customerSafeTicket = {
      ...found,
      messages: found.messages.filter(m => !m.isInternalNote),
    };
    return NextResponse.json({ success: true, ticket: customerSafeTicket });
  }

  if (email) {
    tickets = tickets.filter(t => t.customerEmail.toLowerCase() === email);
  }

  // Sanitize all tickets: omit internal notes
  const customerSafeTickets = tickets.map(t => ({
    ...t,
    messages: t.messages.filter(m => !m.isInternalNote),
  }));

  // Sort newest first
  customerSafeTickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({
    success: true,
    tickets: customerSafeTickets,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, orderId, subject, category, message, attachments } = body;

    if (!customerName || !customerEmail || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Generate consecutive sequential Ticket ID (e.g. FIT-SUPPORT-10002)
    adminStore.ticketSequence += 1;
    const ticketId = `FIT-SUPPORT-${adminStore.ticketSequence}`;

    const newTicket: SupportTicket = {
      id: ticketId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone ? customerPhone.trim() : '',
      orderId: orderId ? orderId.trim() : undefined,
      subject: subject.trim(),
      category: (category as TicketCategory) || 'order_status',
      status: 'new',
      priority: category === 'delivery' || category === 'return_refund' ? 'high' : 'normal',
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId,
          senderType: 'customer',
          senderName: customerName.trim(),
          senderEmail: customerEmail.trim().toLowerCase(),
          message: message.trim(),
          isInternalNote: false,
          attachments: attachments || [],
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    adminStore.tickets.set(ticketId, newTicket);

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: `Support ticket ${ticketId} created successfully. Our team will respond shortly.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Customer sends follow-up reply to existing ticket
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, message, senderName, senderEmail } = body;

    const ticket = adminStore.tickets.get(ticketId);
    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.status === 'closed') {
      return NextResponse.json({ success: false, error: 'This ticket is closed' }, { status: 400 });
    }

    const replyMsg = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderType: 'customer' as const,
      senderName: senderName || ticket.customerName,
      senderEmail: senderEmail || ticket.customerEmail,
      message: message.trim(),
      isInternalNote: false,
      createdAt: new Date().toISOString(),
    };

    ticket.messages.push(replyMsg);
    // Move ticket to 'open' when customer replies
    ticket.status = 'open';
    ticket.updatedAt = new Date().toISOString();

    adminStore.tickets.set(ticketId, ticket);

    return NextResponse.json({
      success: true,
      ticket: {
        ...ticket,
        messages: ticket.messages.filter(m => !m.isInternalNote),
      },
      message: 'Message delivered to support team',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
