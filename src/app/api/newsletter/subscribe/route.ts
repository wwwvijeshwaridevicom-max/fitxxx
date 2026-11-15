import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo (replace with Supabase when configured)
// This persists for the duration of the Next.js server process
const subscribedEmails = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (subscribedEmails.has(normalizedEmail)) {
      return NextResponse.json({ 
        success: true, 
        message: "You're already on the list! Watch your inbox for exclusive drops." 
      });
    }

    subscribedEmails.add(normalizedEmail);

    // TODO: When Supabase is configured, insert into newsletter_subscribers table:
    // const { error } = await supabase.from('newsletter_subscribers').insert({ email: normalizedEmail });

    console.log(`[Newsletter] New subscriber: ${normalizedEmail} (Total: ${subscribedEmails.size})`);

    return NextResponse.json({
      success: true,
      message: "You're on the list! Expect exclusive drops, early access, and style inspiration.",
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Subscription failed. Try again.' }, { status: 500 });
  }
}
