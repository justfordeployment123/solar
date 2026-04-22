import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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

    return NextResponse.json({ 
        success: true, 
        url: `/installers/success?slug=${generatedSlug}` 
    });
  } catch (error) {
    console.error('Server error in /api/installers:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
