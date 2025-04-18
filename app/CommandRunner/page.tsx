"use client";

import React, { useState } from "react";

const CommandRunner = () => {
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunCommand = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/execute-cmd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
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
      <h1>Open a Command Propmt, and execute what ever command you wants to RUN !!! </h1>
      <input
        type="text"
        placeholder="Enter command..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
      />
      <button
        onClick={handleRunCommand}
        disabled={loading || !command}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Command"}
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
