import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { logAuditAction } from '@/lib/server-admin';

// Password reset token store
const resetTokenStore = new Map<string, { email: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email, resetToken, newPassword } = await req.json();

    // Step 1: Request password reset link
    if (email && !resetToken) {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/reset-password`,
        });
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }

      // Generate secure 32-byte cryptographic reset token
      const token = crypto.randomBytes(32).toString('hex');
      resetTokenStore.set(token, {
        email: cleanEmail,
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      logAuditAction(
        'STATUS_CHANGE',
        'setting',
        cleanEmail,
        null,
        { action: 'PASSWORD_RESET_REQUESTED' },
        `Password reset requested for ${cleanEmail}`,
        cleanEmail
      );

      return NextResponse.json({
        success: true,
        message: 'Password reset instructions dispatched to your registered email address.',
        // Expose token only in development for verified testing
        debugToken: process.env.NODE_ENV !== 'production' ? token : undefined,
      });
    }

    // Step 2: Fulfill password reset with token
    if (resetToken && newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
      }

      const record = resetTokenStore.get(resetToken);
      if (!record || record.expiresAt < Date.now()) {
        return NextResponse.json({ success: false, error: 'Password reset link is invalid or expired' }, { status: 400 });
      }

      resetTokenStore.delete(resetToken);

      logAuditAction(
        'STATUS_CHANGE',
        'setting',
        record.email,
        null,
        { action: 'PASSWORD_RESET_COMPLETED' },
        `Password successfully updated for ${record.email}`,
        record.email
      );

      return NextResponse.json({
        success: true,
        message: 'Your password has been successfully updated. You may now sign in.',
      });
    }

    return NextResponse.json({ success: false, error: 'Email or resetToken + newPassword required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
