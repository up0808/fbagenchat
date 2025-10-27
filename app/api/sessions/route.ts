/**
 * Sessions API Route
 * Handles fetching all sessions and creating new ones
 */

import { NextResponse } from 'next/server';
import { getAllSessions, createSession } from '@/lib/db';

// GET /api/sessions - Get all sessions
export async function GET() {
  try {
    const sessions = await getAllSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('[Sessions API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new session
export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const session = await createSession(title || 'New Chat');
    return NextResponse.json({ session });
  } catch (error) {
    console.error('[Sessions API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}