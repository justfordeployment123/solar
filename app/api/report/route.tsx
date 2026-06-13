import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ReportDocument } from '@/components/pdf/report-document';

// PDF must be rendered in the Node runtime — @react-pdf/renderer relies on
// Node-only APIs (font loading, Buffer, etc.) that aren't available on the
// edge.
export const runtime = 'nodejs';

// Generate the report PDF on the server. Doing this server-side avoids
// shipping ~1MB of @react-pdf/renderer to the browser bundle and sidesteps
// React 19 / Next 16 / Turbopack quirks that caused the client-side
// `pdf().toBlob()` path to fail silently for some users.
export async function POST(request: Request) {
  const body = await request.json();

  // @react-pdf/renderer's Image fetches URLs in Node, so a relative path
  // like "/solar-logo.png" needs to be resolved against the request origin.
  const origin = new URL(request.url).origin;
  const activeLogo = typeof body.activeLogo === 'string' && body.activeLogo.startsWith('/')
    ? `${origin}${body.activeLogo}`
    : body.activeLogo;

  // JSX must be constructed outside try/catch (react-hooks/error-boundaries rule).
  const element = (
    <ReportDocument
      technical={body.technical}
      financial={body.financial}
      derivedResults={body.derivedResults}
      pieChartImage={body.pieChartImage}
      barChartImage={body.barChartImage}
      activeLogo={activeLogo}
      companyName={body.companyName}
      autarkyPercent={body.autarkyPercent}
    />
  );

  try {
    const buffer = await renderToBuffer(element);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="mein-solar-batterie-bericht.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF generation failed', err);
    return NextResponse.json(
      { error: 'PDF generation failed', message: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    );
  }
}
