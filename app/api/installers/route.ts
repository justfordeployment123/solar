import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const installerSchema = z.object({
  companyName: z.string().min(1, 'Unternehmensname ist erforderlich'),
  contactName: z.string().min(1, 'Ansprechpartner ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = installerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Ungültige Eingabe', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Generate slug from company name
    const baseSlug = data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const randomString = Math.random().toString(36).substring(2, 6);
    const generatedSlug = `${baseSlug}-${randomString}`;

    const supabase = createServerSupabaseClient();

    const { error: dbError } = await supabase.from('installers').insert({
      company_name: data.companyName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone,
      logo_url: data.logoUrl,
      website_url: data.websiteUrl,
      generated_slug: generatedSlug,
    });

    if (dbError) {
      console.error('Supabase error inserting installer:', dbError);
      return NextResponse.json({ error: 'Registrierung des Installateurs fehlgeschlagen' }, { status: 500 });
    }

    try {
      const appUrl = 'https://batterystoragecalculator.vercel.app';
      const portalLink = `${appUrl}/i/${generatedSlug}/step-1`;

      // Send email to Stephan
      await resend.emails.send({
        from: 'System <onboarding@resend.dev>',
        to: 'stephan@mysolar-pv.de', // Placeholder for Stephan's actual email
        subject: 'New Installer Registered',
        html: `<p>A new installer has registered:</p>
               <ul>
                 <li>Company: ${data.companyName}</li>
                 <li>Contact: ${data.contactName}</li>
                 <li>Email: ${data.email}</li>
                 <li>Phone: ${data.phone || '-'}</li>
               </ul>
               <p>Their portal link is: <a href="${portalLink}">${portalLink}</a></p>`,
      });

      // Send email to Installer
      await resend.emails.send({
        from: 'System <onboarding@resend.dev>',
        to: data.email,
        subject: 'Your portal is live!',
        html: `<p>Hello ${data.contactName},</p>
               <p>Your portal is live! Here is your link:</p>
               <p><a href="${portalLink}">${portalLink}</a></p>
               <p>Your contact person is Stephan. Feel free to reach out if you have any questions.</p>`,
      });
    } catch (emailError) {
      console.error('Failed to send registration emails:', emailError);
    }

    return NextResponse.json({ 
        success: true, 
        url: `/installers/success?slug=${generatedSlug}` 
    });
  } catch (error) {
    console.error('Server error in /api/installers:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
