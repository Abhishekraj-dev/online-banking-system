import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/auth';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    
    // Call Java backend
    const res = await fetch(`http://localhost:8081/api/transactions?userId=${userId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch transactions' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
