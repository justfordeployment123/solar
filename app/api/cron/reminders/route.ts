import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function GET(request: Request) {
  // Protect cron endpoint with a secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    const supabase = createServerSupabaseClient();
    
    // Fetch all installers
    const { data: installers, error } = await supabase
      .from('installers')
      .select('*, leads(count)');

    if (error) {
      throw error;
    }

    const now = new Date();
    const results = {
      month2RemindersSent: 0,
      month3RemindersSent: 0,
    };

    for (const installer of installers) {
      if (!installer.created_at) continue;

      const createdAt = new Date(installer.created_at);
      const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // 60 Days: Month 2 Warning (Trial ends soon)
      if (daysDiff === 60) {
        await resend.emails.send({
          from: 'System <onboarding@resend.dev>',
          to: installer.email,
          bcc: ['info@mysolar-pv.de', 's.kluee@mysolar-pv.de'],
          subject: 'Erinnerung: Ihr Testmonat läuft bald ab',
          html: `<p>Hallo ${installer.contact_name},</p>
                 <p>Ihre kostenlose Testphase für die Batteriespeicher-Rechner Subpage endet in 30 Tagen.</p>
                 <p>Bitte antworten Sie auf diese E-Mail mit Ihrer bevorzugten Zahlungsmethode (SEPA/PayPal), ODER lassen Sie uns wissen, ob Sie Material bei uns bestellen, um die Gebühr zu erlassen.</p>
                 <p>Mit freundlichen Grüßen,<br/>Ihr MySolar-PV Team</p>`,
        });
        results.month2RemindersSent++;
      }

      // 90 Days: Month 3 Decision (Trial over)
      if (daysDiff === 90) {
        const leadCount = installer.leads && installer.leads[0] ? installer.leads[0].count : 0;
        
        await resend.emails.send({
          from: 'System <onboarding@resend.dev>',
          to: ['info@mysolar-pv.de', 's.kluee@mysolar-pv.de'],
          subject: `Entscheidung: Testphase von ${installer.company_name} beendet`,
          html: `<p>Hallo Team,</p>
                 <p>Die Subpage von <strong>${installer.company_name}</strong> läuft nun seit 3 Monaten.</p>
                 <p>In dieser Zeit hat die Seite <strong>${leadCount} Anfragen</strong> generiert.</p>
                 <p>Sind Sie mit diesem Kunden in Kontakt und entwickelt sich eine Geschäftsbeziehung, oder müssen wir die Abrechnung für diese Subpage einleiten?</p>
                 <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/admin/installers">Im Admin-Portal verwalten</a></p>`,
        });
        results.month3RemindersSent++;
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
