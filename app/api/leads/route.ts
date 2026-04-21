import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  persona: z.string().optional(),
  calculationSnapshot: z.any().optional(),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Honeypot spam protection
    if (data.honeypot) {
      // Return 200 early to fool bots
      return NextResponse.json({ success: true, message: 'Lead submitted successfully' }, { status: 200 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl === 'your_supabase_url' || supabaseUrl.includes('mock.supabase')) {
      console.log('Mocking db insert for lead');
      return NextResponse.json({ success: true, message: 'Mock Lead submitted successfully' }, { status: 200 });
    }
    const supabase = createServerSupabaseClient();

    const { error: dbError } = await supabase.from('leads').insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      persona: data.persona || 'homeowner',
      calculation_snapshot: data.calculationSnapshot || {},
    });

    if (dbError) {
      console.error('Supabase error inserting lead:', dbError);
      return NextResponse.json({ error: 'Failed to insert lead' }, { status: 500 });
    }

    // Send confirmation email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Battery Calculator <onboarding@resend.dev>',
          to: [data.email],
          subject: 'Your Battery Storage Calculation Results',
          html: `<p>Hi ${data.firstName},</p>
                 <p>Thank you for using our Battery Storage Calculator! We have received your request and will follow up with you shortly regarding you calculation.</p>
                 <p>Best regards,<br/>SolarPV</p>`,
        });
      } catch (emailError) {
        console.error('Resend error:', emailError);
        // Do not block the request if email fails to send
      }
    } else {
      console.log('No RESEND_API_KEY found. Mock email sent to', data.email);
    }

    return NextResponse.json({ success: true, message: 'Lead submitted successfully' });
  } catch (error) {
    console.error('Server error in /api/leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
