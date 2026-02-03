import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.DEMO_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: 'DEMO_BACKEND_URL not set' }, { status: 500 });
  }

  try {
    // In a real app we'd fetch specific user. For demo, we get state.users or just the first user
    // Or we can assume backend has a /user endpoint. 
    // Since backend "state.users" is a map, let's just fetch state and return the relevant user mock from backend
    // Or simpler: fetch /state and extract user.
    
    // For now, let's proxy to /state. If the frontend wants "user", it can select it.
    // However, to keep it clean, let's assume we want to return a single User object.
    
    const res = await fetch(`${backendUrl}/state`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    
    // Return first user or empty if none (for demo simplicity)
    const users = Object.values(data.users || {});
    return NextResponse.json(users[0] || null);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 502 });
  }
}
