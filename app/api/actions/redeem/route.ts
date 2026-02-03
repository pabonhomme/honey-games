import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const backendUrl = process.env.DEMO_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: 'DEMO_BACKEND_URL not set' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${backendUrl}/actions/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to redeem item' }, { status: 502 });
  }
}
