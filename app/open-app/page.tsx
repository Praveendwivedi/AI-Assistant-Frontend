'use client';

import { useState } from 'react';

export default function OpenAppClient() {
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleOpenApp = async () => {
    if (!appName.trim()) {
      setMessage('Please enter an application name.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/open-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appName })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Application opened successfully.');
      } else {
        setMessage(data.error || 'Failed to open the application.');
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Open an Application</h1>
      <input
        type="text"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        placeholder="Enter application name"
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button
        onClick={handleOpenApp}
        disabled={loading}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
      >
        {loading ? 'Opening...' : 'Open App'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
