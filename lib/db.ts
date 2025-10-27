/**
 * Database utilities using Prisma Client
 * Handles all database operations for sessions and messages
 */

import { PrismaClient } from '@prisma/client';

// Singleton pattern to prevent multiple Prisma instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Create a new chat session
 */
export async function createSession(title: string = 'New Chat') {
  return await prisma.session.create({
    data: { title },
  });
}

/**
 * Get all sessions ordered by most recent
 */
export async function getAllSessions() {
  return await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

/**
 * Get a specific session with all its messages
 */
export async function getSession(sessionId: string) {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

/**
 * Delete a session (cascade deletes messages)
 */
export async function deleteSession(sessionId: string) {
  return await prisma.session.delete({
    where: { id: sessionId },
  });
}

/**
 * Save a message to the database
 */
export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  imageUrl?: string
) {
  return await prisma.message.create({
    data: {
      sessionId,
      role,
      content,
      imageUrl,
    },
  });
}

/**
 * Update session title (useful for auto-generating titles from first message)
 */
export async function updateSessionTitle(sessionId: string, title: string) {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { title },
  });
}