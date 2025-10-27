'use client';

import { useState, useEffect } from 'react';
import { Session } from '@/lib/types';

interface SidebarProps {
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({ currentSessionId, onSessionSelect, onNewChat }: SidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/sessions');
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const data = await resp.json();
      setSessions(data.sessions);
    } catch (err: any) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat?')) return;
    try {
      const resp = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      // Refresh list after deletion
      await loadSessions();
      if (currentSessionId === sessionId) {
        onNewChat();
      }
    } catch (err: any) {
      console.error('Failed to delete session:', err);
      setError('Failed to delete chat');
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 text-white p-2 rounded-lg shadow-lg"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => {
              onNewChat();
              loadSessions();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading…</div>
          ) : error ? (
            <div className="text-red-400 text-center py-8 text-sm">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="text-gray-400 text-center py-8 text-sm">
              No chats yet.<br />Start a new conversation!
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    onSessionSelect(session.id);
                    setIsOpen(false);
                  }}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800/50'
                  }`}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSessionSelect(session.id);
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">
                        {session.title || 'New Chat'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(session.createdAt)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity p-1"
                      title="Delete chat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Gemini 2.5-Flash
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}