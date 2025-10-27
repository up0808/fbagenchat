'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';

export default function Home() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const handleNewChat = () => {
    // Reset session so Chat will create new session on submit
    setCurrentSessionId(null);
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleSessionCreated = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />
      <div className="flex-1">
        <Chat
          key={currentSessionId ?? 'new-chat'}      // ensures component remount on new chat
          sessionId={currentSessionId}
          onSessionCreated={handleSessionCreated}
        />
      </div>
    </div>
  );
}