import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

export async function GET() {
  try {
    // Disable SSL verification for self-signed certs in production
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const response = await fetch(`${BACKEND_URL}/api/products`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy error fetching products:', error?.message);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error?.message },
      { status: 500 }
    );
  }
}
