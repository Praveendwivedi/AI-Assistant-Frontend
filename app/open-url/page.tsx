"use client";

import React, { useState } from "react";

const CommandRunner = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunCommand = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/open-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }), // ✅ match the server-side key
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.message);
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("Failed to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Open a URL</h1>
      <input
        type="text"
        placeholder="Enter URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
      />
      <button
        onClick={handleRunCommand}
        disabled={loading || !url}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Opening..." : "Open URL"}
      </button>

      {status && (
        <div
          className={`text-sm mt-2 ${
            status.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};

export default CommandRunner;
