import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/server-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Identifier (phone/email) and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(identifier, password);

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Set secure cookies
    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });

    response.cookies.set('fitxxx-admin-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400, // 24 hours
    });

    response.cookies.set('fitxxx-admin-session', '1', {
      httpOnly: false, // Accessible to client-side checks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
