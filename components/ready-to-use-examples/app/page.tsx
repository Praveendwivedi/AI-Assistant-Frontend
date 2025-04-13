// app/page.tsx
"use client";
import { useChat } from "ai/react";
import { useState } from "react";

type UIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

declare module "ai/react" {
  interface Message {
    image?: string;
  }
  interface CreateMessage extends Partial<Record<string, unknown>> {
    image?: string;
  }
}

export default function JarvisAssistant() {
  const { messages: rawMessages, input, handleInputChange, handleSubmit: originalHandleSubmit, append } = useChat<UIMessage>();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState<"vision" | "images" | "auto">("vision");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imagePreview) {
      await append({
        id: Date.now().toString(),
        role: 'user',
        content: input || 'Image shared',
        image: imagePreview
      });
      setImage(null);
      setImagePreview(null);
    }
    
    if (input.trim()) {
      originalHandleSubmit(e);
    }
  };

  return (
    <div className="jarvis-container p-4 min-h-screen font-poppins bg-gray-50">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">install-it.ai - Your Personal Assistant</h1>
        <p className="text-gray-600 mt-1 text-sm">
          An AI assistant that monitors your screen and helps you in real time
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Welcome & Controls */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Welcome back!</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            
            {/* Context Summary */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-700">Vision: UI ✗</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Vision: Analyzing...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  Status: {isMonitoring ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
              {(["vision", "images", "auto"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 text-sm rounded-lg transition-all ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab === "vision" ? "Vision" : tab === "images" ? "Images" : "Auto"}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            {/* Circular Start/Stop Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isMonitoring 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                <span className="text-white font-medium text-sm">
                  {isMonitoring ? 'Stop' : 'Start'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button className="py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Expanded Chat */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">How can I help you?</h2>
            
            <div className="jarvis-message-area bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200">
              {rawMessages.length > 0 ? (
                rawMessages.map((m) => (
                  <div key={m.id} className="mb-3 last:mb-0">
                    <div className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                      m.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {m.content}
                      {m.image && <img src={m.image} alt="Uploaded" className="mt-2 max-w-full rounded-lg" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500">No conversation yet</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="rounded-lg max-h-32 border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <label className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-100 transition-all">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </label>
                
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={input}
                  placeholder="Type your message..."
                  onChange={handleInputChange}
                />
                
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-all flex items-center justify-center"
                  disabled={!input.trim() && !imagePreview}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Code Editor */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Steps & Code Editor</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="text-sm text-gray-700 font-mono">
                {`// Code suggestions will appear here\n// Based on your current context`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}