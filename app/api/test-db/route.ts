import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: insertData, error: insertError } = await supabase.from('leads').insert([
      {
        id: 'test_123',
        name: 'Test Name',
        email: 'test@example.com',
        phone: '123456',
        project_details: 'test details',
        required_data: [],
        deliverables: [],
        execution_steps: [],
        language: 'fa',
        created_at: new Date().toISOString()
      }
    ]).select();
    
    return NextResponse.json({ success: true, insertData, insertError });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
