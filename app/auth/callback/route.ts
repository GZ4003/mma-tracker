import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const urlResponse = request.nextUrl.clone();
      urlResponse.pathname = next;
      return NextResponse.redirect(urlResponse);
    }
  }

  // return the user to an error page with instructions
  const urlResponse = request.nextUrl.clone();
  urlResponse.pathname = '/auth-error';
  return NextResponse.redirect(urlResponse);
}
