import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

const leadSchema = z.object({
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  persona: z.string().optional(),
  calculationSnapshot: z.any().optional(),
  honeypot: z.string().optional(),
  installerId: z.string().optional(),
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
      return NextResponse.json({ success: true, message: 'Anfrage erfolgreich gesendet' }, { status: 200 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl === 'your_supabase_url' || supabaseUrl.includes('mock.supabase')) {
      console.log('Mocking db insert for lead');
      return NextResponse.json({ success: true, message: 'Mock-Anfrage erfolgreich gesendet' }, { status: 200 });
    }
    const supabase = createServerSupabaseClient();

    const { error: dbError } = await supabase.from('leads').insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      persona: data.persona || 'homeowner',
      calculation_snapshot: data.calculationSnapshot || {},
      installer_id: data.installerId || null,
    });

    if (dbError) {
      console.error('Supabase error inserting lead:', dbError);
      return NextResponse.json({ error: 'Failed to insert lead' }, { status: 500 });
    }

    // Send confirmation email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Batterie-Rechner <onboarding@resend.dev>',
          to: [data.email],
          subject: 'Ihre Ergebnisse der Batteriespeicher-Berechnung',
          html: `<p>Hallo ${data.firstName},</p>
                 <p>vielen Dank für die Nutzung unseres Batteriespeicher-Rechners! Wir haben Ihre Anfrage erhalten und werden uns in Kürze bezüglich Ihrer Berechnung bei Ihnen melden.</p>
                 <p>Mit freundlichen Grüßen,<br/>SolarPV</p>`,
        });
      } catch (emailError) {
        console.error('Resend error:', emailError);
        // Do not block the request if email fails to send
      }
    } else {
      console.log('No RESEND_API_KEY found. Mock email sent to', data.email);
    }

    return NextResponse.json({ success: true, message: 'Anfrage erfolgreich gesendet' });
  } catch (error) {
    console.error('Server error in /api/leads:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
