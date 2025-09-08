import { NextResponse } from 'next/server';
import { ENV } from '@shared/web';

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export async function GET() {
  const base = (ENV.API_URL || '').replace(/\/$/, '');
  const upstream = `${base}/health`;

  if (!isAbsoluteUrl(base)) {
    // Avoid self-calls when API_URL is relative (e.g., '/api').
    return NextResponse.json({ ok: true, apiUrl: base || null, mode: 'local' }, { status: 200 });
  }

  try {
    const res = await fetch(upstream, { cache: 'no-store' });
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json().catch(() => ({})) : { status: res.statusText };

    return NextResponse.json(
      {
        ok: res.ok,
        upstream,
        status: data?.status ?? (res.ok ? 'ok' : 'error'),
      },
      { status: res.ok ? 200 : res.status || 502 },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, upstream, error: (err as Error).message },
      { status: 503 },
    );
  }
}
