import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.DEMO_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: 'DEMO_BACKEND_URL not set' }, { status: 500 });
  }

  try {
    const res = await fetch(`${backendUrl}/state`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch state' }, { status: 502 });
  }
}
