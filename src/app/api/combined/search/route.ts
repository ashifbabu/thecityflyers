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
    
    // Log the complete request details
    console.log('API Route - Request details:', {
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/combined/search`,
      method: 'POST',
      body: JSON.stringify(body, null, 2)
    });

    // First check if we have the API URL
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL is not configured');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/combined/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Origin': process.env.NEXT_PUBLIC_API_URL,
          'Referer': `${process.env.NEXT_PUBLIC_API_URL}/`,
          'Host': new URL(process.env.NEXT_PUBLIC_API_URL).host,
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({
          ...body,
          // Add any additional required fields
          clientInfo: {
            deviceType: 'Desktop',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
            userAgent: request.headers.get('user-agent') || 'Mozilla/5.0'
          }
        }),
        cache: 'no-store',
        mode: 'cors',
        credentials: 'omit'
      });

      // Log the response status and headers
      console.log('API Route - Response details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails;
        try {
          // Try to parse as JSON first
          errorDetails = await response.json();
        } catch {
          try {
            // If not JSON, get as text
            errorDetails = await response.text();
          } catch {
            // If all else fails
            errorDetails = 'Unable to get error details';
          }
        }

        console.error('API Route - Error response:', {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails
        });

        return new NextResponse(
          JSON.stringify({
            error: 'External API error',
            details: typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails),
            status: response.status,
            statusText: response.statusText
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
      console.log('API Route - Successful response data preview:', 
        JSON.stringify(data).slice(0, 200) + '...'
      );

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
    } catch (fetchError) {
      console.error('API Route - Fetch error:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('API Route - Top level error:', error);
    
    const origin = getOrigin(request);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
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