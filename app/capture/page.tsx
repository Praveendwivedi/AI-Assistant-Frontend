"use client";
import { useState } from 'react';

export default function HomePage() {
  // State hooks for loading indicator, status message, and image URL
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Handler for button click: POST to API and process response
  const handleCapture = async () => {
    setLoading(true);
    setMessage(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/screenshot', { method: 'POST' });
      const data = await response.json() as {
        success: boolean;
        message: string;
        imageUrl?: string;
      };

      setMessage(data.message);
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Screen OCR → Image</h1>
      <button
        onClick={handleCapture}
        disabled={loading}
        style={{
          padding: '8px 16px',
          fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Rendering…' : 'Capture & Render Image'}
      </button>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}

      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <img
            src={imageUrl}
            alt="OCR rendered as image"
            style={{ maxWidth: '100%', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
}
