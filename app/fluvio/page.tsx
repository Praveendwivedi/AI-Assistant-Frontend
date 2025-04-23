"use client";
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (): Promise<void> => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      setMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (): Promise<void> => {
    try {
      const res = await fetch('/api/consume');
      const data: { records: string[] } = await res.json();
      setMessages(data.records || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🌀 Fluvio Chat Demo</h1>

      <div className="flex space-x-2 mb-4 w-full max-w-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <button
        onClick={fetchMessages}
        className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
      >
        Refresh Messages
      </button>

      <ul className="w-full max-w-md space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="bg-gray-800 p-3 rounded-lg shadow">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
