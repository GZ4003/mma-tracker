import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { GoatModeData } from '@/types';

// GET /api/user-data - Read user's data from Supabase
export async function GET() {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read user data from database
    const { data, error } = await supabase
      .from('user_data')
      .select('data')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no data exists yet, return empty object (first time user)
      if (error.code === 'PGRST116') {
        return NextResponse.json({});
      }
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json(data?.data || {});
  } catch (error) {
    console.error('Error in GET /api/user-data:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/user-data - Write user's data to Supabase
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const payload: GoatModeData = await request.json();

    // Upsert user data (insert if not exists, update if exists)
    const { error } = await supabase
      .from('user_data')
      .upsert(
        {
          user_id: user.id,
          data: payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/user-data:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
