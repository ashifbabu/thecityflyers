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
    
    console.log('Sending request to external API:', {
      url: 'https://connect.thecityflyers.com/api/combined/search',
      method: 'POST',
      body: JSON.stringify(body, null, 2)
    });

    const response = await fetch('https://connect.thecityflyers.com/api/combined/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add any authentication headers if required
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('External API error:', {
        status: response.status,
        statusText: response.statusText,
      });
      
      const errorText = await response.text();
      console.error('Error response:', errorText);

      return new NextResponse(
        JSON.stringify({ 
          error: 'External API error', 
          details: `Status: ${response.status} ${response.statusText}` 
        }), 
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
          },
        }
      );
    }

    const data = await response.json();
    
    console.log('External API response:', {
      status: response.status,
      dataPreview: JSON.stringify(data).slice(0, 200) + '...'
    });

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
    console.error('API Route Error:', error);
    
    const origin = getOrigin(request);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
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