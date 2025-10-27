/**
 * Type definitions for the chat application
 */

// Message type that matches our database schema
export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
}

// Session type for chat history
export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

// Request body for creating a new session
export interface CreateSessionRequest {
  title?: string;
}

// Tool result types
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}