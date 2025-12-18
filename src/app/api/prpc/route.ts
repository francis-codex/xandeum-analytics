/**
 * pRPC Proxy API Route
 *
 * This API route proxies requests to pNode endpoints to bypass
 * ERR_UNSAFE_PORT errors. Both browsers and Node.js fetch() block port 6000,
 * but we use axios which doesn't have these restrictions.
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PNODE_ENDPOINTS } from '@/lib/prpc-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface JsonRpcRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params?: any;
}

interface JsonRpcResponse<T = any> {
  jsonrpc: string;
  id: number | null;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * POST /api/prpc
 * Proxy JSON-RPC requests to pNode endpoints
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON-RPC request
    const rpcRequest: JsonRpcRequest = await request.json();

    // Validate JSON-RPC format
    if (!rpcRequest.jsonrpc || rpcRequest.jsonrpc !== '2.0') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: rpcRequest.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc version must be 2.0',
          },
        } as JsonRpcResponse,
        { status: 400 }
      );
    }

    if (!rpcRequest.method) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: rpcRequest.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: method is required',
          },
        } as JsonRpcResponse,
        { status: 400 }
      );
    }

    // Get endpoint from query param or use first one
    const searchParams = request.nextUrl.searchParams;
    const endpointParam = searchParams.get('endpoint');
    const endpoint = endpointParam || PNODE_ENDPOINTS[0];

    // Validate endpoint is in our allow-list
    if (!PNODE_ENDPOINTS.includes(endpoint)) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: rpcRequest.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: endpoint not in allow-list',
          },
        } as JsonRpcResponse,
        { status: 400 }
      );
    }

    console.log(`[pRPC Proxy] → ${rpcRequest.method} @ ${endpoint}`);

    // Make the request to the pNode endpoint using axios
    // (fetch() blocks port 6000, but axios doesn't)
    const response = await axios.post<JsonRpcResponse>(
      endpoint,
      rpcRequest,
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: () => true, // Don't throw on any HTTP status
      }
    );

    // Check for HTTP errors
    if (response.status !== 200) {
      console.error(`[pRPC Proxy] ✗ ${rpcRequest.method} failed: HTTP ${response.status}`);
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: rpcRequest.id,
          error: {
            code: -32000,
            message: `pNode request failed: HTTP ${response.status}`,
            data: {
              status: response.status,
              endpoint,
            },
          },
        } as JsonRpcResponse,
        { status: response.status }
      );
    }

    const rpcResponse: JsonRpcResponse = response.data;

    console.log(`[pRPC Proxy] ✓ ${rpcRequest.method} succeeded`);

    // Return the pNode response
    return NextResponse.json(rpcResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('[pRPC Proxy] Error:', error);

    // Handle axios timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Request timeout',
            data: { timeout: 30000 },
          },
        } as JsonRpcResponse,
        { status: 504 }
      );
    }

    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Network error: Unable to connect to pNode',
            data: {
              code: error.code,
              message: error.message,
            },
          },
        } as JsonRpcResponse,
        { status: 503 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal error',
          data: error.message,
        },
      } as JsonRpcResponse,
      { status: 500 }
    );
  }
}

/**
 * GET /api/prpc
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    service: 'pRPC Proxy',
    status: 'ok',
    endpoints: PNODE_ENDPOINTS.length,
    timestamp: new Date().toISOString(),
  });
}
