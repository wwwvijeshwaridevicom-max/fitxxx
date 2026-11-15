import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/server-admin';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('fitxxx-admin-token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { valid, user } = verifyAdminToken(token);
  if (!valid || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
      fullName: 'SHIV (FITXXX OWNER)',
      isOwner: user.role === 'OWNER',
    }
  });
}
