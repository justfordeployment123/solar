export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/i/${slug}/step-1`);
}
