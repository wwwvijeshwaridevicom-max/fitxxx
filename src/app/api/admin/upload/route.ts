import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/server-admin';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN, SUPPORT_STAFF allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN', 'SUPPORT_STAFF']);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'products';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // MIME type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WEBP, AVIF` },
        { status: 400 }
      );
    }

    // Size check (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${bucket}_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${fileExt}`;

    if (isSupabaseConfigured) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data, error } = await supabase.storage
        .from('fitxxx-assets')
        .upload(`${bucket}/${cleanFileName}`, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from('fitxxx-assets')
        .getPublicUrl(`${bucket}/${cleanFileName}`);

      return NextResponse.json({
        success: true,
        url: publicUrlData.publicUrl,
        fileName: cleanFileName,
      });
    }

    // Fallback URL for local testing
    return NextResponse.json({
      success: true,
      url: `/Clothes images/${cleanFileName}`,
      fileName: cleanFileName,
      message: 'Local upload simulated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
