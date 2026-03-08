import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy error creating order:', error?.message);
    return NextResponse.json(
      { error: 'Failed to create order', details: error?.message },
      { status: 500 }
    );
  }
}
