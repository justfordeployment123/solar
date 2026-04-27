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

    // Send emails using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        // Default to the main admin (Stephan) and official company name
        let adminEmail = process.env.ADMIN_EMAIL || 'stephan@mysolar-pv.de';
        let adminName = 'Stephan';
        let signatureCompany = 'MySolar-PV';

        // If this lead came from an installer's white-labeled calculator, fetch their details
        if (data.installerId) {
          const { data: installerData } = await supabase
            .from('installers')
            .select('email, contact_name, company_name')
            .eq('id', data.installerId)
            .single();
            
          if (installerData) {
            if (installerData.email) adminEmail = installerData.email;
            if (installerData.contact_name) adminName = installerData.contact_name;
            if (installerData.company_name) signatureCompany = installerData.company_name;
          }
        }

        // 1. Admin Notification
        await resend.emails.send({
          from: 'Batterie-Rechner Leads <onboarding@resend.dev>',
          to: [adminEmail],
          subject: 'Neuer Lead vom Batteriespeicher-Rechner!',
          html: `<p>Hallo ${adminName},</p>
                 <p>Es gibt einen neuen Lead aus dem Batteriespeicher-Rechner:</p>
                 <ul>
                    <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
                    <li><strong>E-Mail:</strong> ${data.email}</li>
                    <li><strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}</li>
                    <li><strong>Typ:</strong> ${data.persona || 'homeowner'}</li>
                 </ul>
                 <p>Bitte kontaktieren Sie den Interessenten zeitnah.</p>
                 <p>Mit freundlichen Grüßen,<br/>Ihr System</p>`,
        });

        // 2. Customer Confirmation
        await resend.emails.send({
          from: 'Batterie-Rechner <onboarding@resend.dev>',
          to: [data.email],
          subject: 'Ihre Anfrage zum Batteriespeicher',
          html: `<p>Hallo ${data.firstName},</p>
                 <p>vielen Dank für Ihre Anfrage. Wir haben Ihre Daten erhalten und werden uns in Kürze bei Ihnen melden.</p>
                 <p>Mit freundlichen Grüßen,<br/>${signatureCompany}</p>`,
        });

      } catch (emailError) {
        console.error('Resend error:', emailError);
        // Do not block the request if email fails to send
      }
    } else {
      console.log('No RESEND_API_KEY found. Mock emails sent to admin/installer and customer.');
    }

    return NextResponse.json({ success: true, message: 'Anfrage erfolgreich gesendet' });
  } catch (error) {
    console.error('Server error in /api/leads:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
