import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { name, email, projectType, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          project_type: projectType || 'General Inquiry',
          message,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to record submission in database.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Inquiry received successfully!', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('API Contact route error:', error)
    return NextResponse.json(
      { error: 'An unexpected server error occurred.' },
      { status: 500 }
    )
  }
}
