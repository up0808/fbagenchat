'use client';

import { useChat, UIMessage } from '@ai-sdk/react';
import { useRef, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

interface ChatProps {
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
}

export default function Chat({ sessionId, onSessionCreated }: ChatProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [inputText, setInputText] = useState('');

  const { messages, status, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    body: {
      sessionId,
      data: uploadedImage ? { imageUrl: uploadedImage } : undefined,
    },
    onResponse: (response) => {
      const newSessionId = response.headers.get('X-Session-Id');
      if (newSessionId && newSessionId !== sessionId) {
        onSessionCreated(newSessionId);
      }
    },
    onFinish: () => {
      setUploadedImage(null);
      setInputText('');
    },
    // optionally you can pass id: sessionId to reuse chat instance
    id: sessionId ?? undefined,
    messages: [], // initial messages can be set when loading history below
  });

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load history on sessionId change
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          const formatted = (data.session.messages as any[]).map((msg) => ({
            id: msg.id,
            role: msg.role,
            parts: msg.imageUrl
              ? [{ type: 'image', url: msg.imageUrl }]
              : [{ type: 'text', text: msg.content }],
          })) as UIMessage[];
          setMessages(formatted);
        }
      } catch (e) {
        console.error('Failed to load history', e);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, [sessionId, setMessages]);

  const onImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputText.trim() || uploadedImage) {
      handleSubmit({
        text: inputText.trim(),
      });
    }
    // The onFinish handler will clear state
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {isLoadingHistory && <div>Loading chat history…</div>}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.parts.map((part, idx) => {
              if (part.type === 'text') {
                return <span key={idx}>{part.text}</span>;
              }
              if (part.type === 'image') {
                return (
                  <Image key={idx} src={part.url} alt="Uploaded image" width={200} height={150} />
                );
              }
              // handle other part types (tool results etc)
              return null;
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onFormSubmit} className="input-form">
        <input
          type="text"
          placeholder="Send a message"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            handleInputChange(e);
          }}
          disabled={status !== 'ready'}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
        />
        {uploadedImage && (
          <div className="preview">
            <Image src={uploadedImage} alt="Preview" width={100} height={75} />
          </div>
        )}
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>
      </form>
    </div>
  );
}