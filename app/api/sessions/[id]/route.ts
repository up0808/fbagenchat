/**
 * Individual Session API Route
 * Handles getting and deleting specific sessions
 */

import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/db';

// GET /api/sessions/[id] - Get session with messages
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession(id);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('[Session API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Delete session
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteSession(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}