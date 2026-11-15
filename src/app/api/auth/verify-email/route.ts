import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { token, type } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Verification token required' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: (type as any) || 'email',
      });
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified. Your account is active.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
