import { NextRequest, NextResponse } from 'next/server';

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

// In-memory store for demo
const messages: ContactMessage[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const entry: ContactMessage = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject || 'General Inquiry').trim(),
      message: String(message).trim(),
      timestamp: new Date().toISOString(),
    };

    messages.push(entry);
    
    console.log(`[Contact] New message from ${entry.name} <${entry.email}>: ${entry.subject}`);

    return NextResponse.json({
      success: true,
      message: "Message received! Our team will respond within 24 hours.",
      ticketId: `FX-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

export async function GET() {
  // Admin-only endpoint to view messages (no auth in demo mode)
  return NextResponse.json({ 
    total: messages.length,
    messages: messages.slice(-20) // Last 20 messages
  });
}
