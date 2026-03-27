import { supabase } from '../../lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { error } = await supabase.from('now').select('id').limit(1)
  if (error) return NextResponse.json({ status: 'error' }, { status: 500 })
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() })
}
