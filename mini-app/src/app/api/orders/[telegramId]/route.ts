import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ telegramId: string }> }
) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const { telegramId } = await params;
    const response = await fetch(`${BACKEND_URL}/api/orders/${telegramId}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy error fetching orders:', error?.message);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error?.message },
      { status: 500 }
    );
  }
}
