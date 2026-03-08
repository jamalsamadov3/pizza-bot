import { NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

// Create axios instance that accepts self-signed certificates
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export async function GET() {
  try {
    const response = await backendApi.get('/api/products');
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error fetching products:', message);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: message },
      { status: 500 }
    );
  }
}
