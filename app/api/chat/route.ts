/**
 * Chat API Route
 * Handles streaming chat requests with Gemini 2.5-Flash
 * Supports text, images, and tool calling
 */

import { streamText, convertToCoreMessages } from 'ai';
import { geminiFlash, modelConfig } from '@/lib/ai/provider';
import { tools } from '@/lib/ai/agent'; // ensure correct import path
import {
  saveMessage,
  getSession,
  createSession,
  updateSessionTitle,
} from '@/lib/db';

export const runtime = 'edge'; // ✅ ensures streaming compatibility on Vercel Edge
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sessionId: inputSessionId, data } = await req.json();

    // ✅ Ensure valid session
    let sessionId = inputSessionId;
    if (!sessionId) {
      const newSession = await createSession();
      sessionId = newSession.id;
    }

    const session = await getSession(sessionId);
    if (!session) {
      return new Response('Session not found', { status: 404 });
    }

    // ✅ Handle user message storage
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      const imageUrl = data?.imageUrl || null;
      await saveMessage(sessionId, 'user', lastMessage.content, imageUrl);

      // Auto-generate session title if first message
      if (session.title === 'New Chat' && session.messages.length === 0) {
        const titlePreview = lastMessage.content.slice(0, 50);
        await updateSessionTitle(sessionId, titlePreview);
      }
    }

    // ✅ Convert messages to AI SDK core format
    const coreMessages = convertToCoreMessages(messages);

    // ✅ Stream AI response
    const stream = await streamText({
      model: geminiFlash,
      messages: coreMessages,
      tools,
      temperature: modelConfig.temperature,
      topP: modelConfig.topP,
      maxOutputTokens: modelConfig.maxOutputTokens, // ✅ correct param name
      onFinish: async ({ text, finishReason }) => {
        if (text) {
          await saveMessage(sessionId, 'assistant', text);
        }
        console.log('[Chat] Finish reason:', finishReason);
      },
    });

    // ✅ Return live streaming response
    return stream.toDataStreamResponse({
      headers: {
        'X-Session-Id': sessionId,
      },
    });
  } catch (error: any) {
    console.error('[Chat API Error]:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error?.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}