import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const referralSchema = z.object({
  yourName: z.string().min(1, 'Ihr Name ist erforderlich'),
  friendName: z.string().min(1, 'Name des Freundes ist erforderlich'),
  friendEmail: z.string().email('Ungültige E-Mail-Adresse'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = referralSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ungültige Eingabe', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { yourName, friendName, friendEmail } = parsed.data;

    // Send email to Admin
    await resend.emails.send({
      from: 'System <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'stephan@mysolar-pv.de',
      subject: 'Neue Weiterempfehlung!',
      html: `<p>Hallo,</p><p>Ein Nutzer namens <strong>${yourName}</strong> hat den Rechner gerade an <strong>${friendName}</strong> (${friendEmail}) weiterempfohlen.</p>`,
    });

    // Send email to Friend
    await resend.emails.send({
      from: 'MySolar-PV <onboarding@resend.dev>',
      to: friendEmail,
      subject: `${yourName} empfiehlt den Batteriespeicher-Rechner`,
      html: `<p>Hallo ${friendName},</p>
             <p>Dein Freund ${yourName} hat unseren Batteriespeicher-Rechner ausprobiert und denkt, das könnte auch für dich interessant sein!</p>
             <p>Hier kannst du dein eigenes System berechnen: <a href="https://batterystoragecalculator.vercel.app">Zum Rechner</a></p>
             <p>Mit freundlichen Grüßen,<br/>MySolar-PV Team</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error in /api/referral:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
