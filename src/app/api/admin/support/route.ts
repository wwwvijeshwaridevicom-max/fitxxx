import { NextRequest, NextResponse } from 'next/server';
import { adminStore, logAuditAction, verifyAdminAccess } from '@/lib/server-admin';
import { TicketStatus, TicketPriority } from '@/types/admin';

export async function GET(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN, SUPPORT_STAFF allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN', 'SUPPORT_STAFF']);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const priority = url.searchParams.get('priority');

  let tickets = Array.from(adminStore.tickets.values());

  if (status && status !== 'all') {
    tickets = tickets.filter(t => t.status === status);
  }

  if (priority && priority !== 'all') {
    tickets = tickets.filter(t => t.priority === priority);
  }

  // Sort newest first
  tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({
    success: true,
    tickets,
    count: tickets.length,
  });
}

export async function POST(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN, SUPPORT_STAFF allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN', 'SUPPORT_STAFF']);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const body = await req.json();
    const { ticketId, message, isInternalNote, statusChange, assignedTo } = body;

    const ticket = adminStore.tickets.get(ticketId);
    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Support ticket not found' }, { status: 404 });
    }

    // Add Staff Message or Internal Note
    if (message && message.trim()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        ticketId,
        senderType: 'staff' as const,
        senderName: user?.email ? user.email.split('@')[0].toUpperCase() : 'FITXXX Support Staff',
        message: message.trim(),
        isInternalNote: Boolean(isInternalNote),
        createdAt: new Date().toISOString(),
      };
      ticket.messages.push(newMessage);
    }

    if (statusChange) {
      const oldStatus = ticket.status;
      ticket.status = statusChange as TicketStatus;
      logAuditAction(
        'STATUS_CHANGE',
        'ticket',
        ticketId,
        { status: oldStatus },
        { status: statusChange },
        `Ticket marked ${statusChange}`,
        user?.email
      );
    }

    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo;
      ticket.assignedToName = assignedTo === 'admin-owner' ? 'Owner Shiv' : assignedTo;
    }

    ticket.updatedAt = new Date().toISOString();
    adminStore.tickets.set(ticketId, ticket);

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
