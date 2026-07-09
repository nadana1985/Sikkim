import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET() {
  // Check backend health
  let backendStatus: 'healthy' | 'unhealthy' | 'unreachable' = 'unreachable';
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    backendStatus = response.ok ? 'healthy' : 'unhealthy';
  } catch {
    backendStatus = 'unreachable';
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    services: {
      frontend: 'healthy',
      backend: backendStatus,
    },
    uptime: process.uptime(),
  });
}
