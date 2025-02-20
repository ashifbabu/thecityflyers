import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add this helper function to get the origin
function getOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  // In development, use localhost, in production use your actual domain
  return origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function POST(request: NextRequest) {
  try {
    const origin = getOrigin(request);
    const body = await request.json();
    
    const response = await fetch('https://connect.thecityflyers.com/api/combined/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required API headers here
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    const origin = getOrigin(request);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = getOrigin(request);
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
} 