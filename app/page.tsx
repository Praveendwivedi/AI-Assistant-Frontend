'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/hooks/useChat';

function ChatPanel({
  rawMessages,
  imagePreview,
  handleFileChange,
  handleSubmit,
  handleInputChange,
  input,
  setImagePreview,
  darkMode,
  toggleVoiceAssist,
  isVoiceAssistActive,
  caption,
  isSpeaking,
}: {
  rawMessages: Message[];
  imagePreview: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
  setImagePreview: (value: string | null) => void;
  darkMode: boolean;
  toggleVoiceAssist: () => void;
  isVoiceAssistActive: boolean;
  caption: string | null;
  isSpeaking: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rawMessages]);

  return (
    <div className="lg:col-span-2 space-y-4">
      <div className={`p-6 rounded-xl shadow-sm h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <div className={`p-4 mb-4 rounded-lg border max-h-[60vh] overflow-y-auto ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          {rawMessages.length > 0 ? (
            rawMessages.map((m, index) => (
              <div className="mb-3 last:mb-0" key={index}>
                <div
                  className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                    m.role === 'user'
                      ? `${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-br-none`
                      : `${darkMode ? 'bg-gray-600' : 'bg-gray-100'} ${darkMode ? 'text-gray-100' : 'text-gray-800'} rounded-bl-none`
                  }`}
                >
                  {Array.isArray(m.content)
                    ? m.content.map((item, idx) => (
                        <div key={idx}>
                          {item.type === 'text' && <ReactMarkdown>{item.text}</ReactMarkdown>}
                          {item.type === 'image_url' && item.image_url?.url && (
                            <img
                              src={item.image_url.url}
                              alt="Uploaded"
                              className="mt-2 max-w-full rounded-lg"
                            />
                          )}
                        </div>
                      ))
                    : typeof m.content === 'string'
                    ? <ReactMarkdown>{m.content}</ReactMarkdown>
                    : JSON.stringify(m.content)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Welcome to VoiceFolow AI. How can I assist you today?
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg max-h-32 border border-gray-200"
              />
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
            <label className={`flex items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all border ${
              darkMode ? 'bg-blue-900 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </label>

            <input
              className={`flex-1 p-2 border rounded-lg focus:ring-1 transition-all ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
              disabled={isSpeaking}
            />

            <button
              type="button"
              onClick={toggleVoiceAssist}
              disabled={isSpeaking}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                isVoiceAssistActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : darkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isVoiceAssistActive ? (
                <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            <button
              type="submit"
              className={`p-2 rounded-lg disabled:opacity-50 transition-all flex items-center justify-center ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={(!input.trim() && !imagePreview) || isSpeaking}
            >
              {isSpeaking ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <div className={`p-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {isVoiceAssistActive ? (
              <p className="text-center font-medium text-blue-500">{caption || 'Listening...'}</p>
            ) : caption ? (
              <p className="text-center">{caption}</p>
            ) : (
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                VoiceFlow AI - Powered by Deepgram
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoiceFlowAI() {
  const {
    messages: rawMessages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    append,
  } = useChat();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isVoiceAssistActive, setIsVoiceAssistActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [caption, setCaption] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          setCaption(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setCaption(`Error: ${event.error}`);
          setIsVoiceAssistActive(false);
        };

        recognitionRef.current.onend = () => {
          if (isVoiceAssistActive) {
            recognitionRef.current?.start();
          }
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isVoiceAssistActive]);

  const toggleVoiceAssist = () => {
    if (!recognitionRef.current) {
      setCaption('Speech recognition not supported in your browser');
      return;
    }

    if (isVoiceAssistActive) {
      recognitionRef.current.stop();
      if (caption) {
        handleInputChange({ target: { value: caption } } as React.ChangeEvent<HTMLInputElement>);
      }
      setIsVoiceAssistActive(false);
      setCaption(null);
    } else {
      recognitionRef.current.start();
      setCaption('Listening...');
      setIsVoiceAssistActive(true);
    }
  };

  // Text-to-Speech Playback with Deepgram
  const playAIResponse = async (text: string) => {
    if (!text) return;

    setIsSpeaking(true);
    try {
      // Clear any previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed with status ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);

      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };

      audioRef.current.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };

      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing AI response:', error);
      setIsSpeaking(false);
    }
  };

  // Detect AI responses and play them
  useEffect(() => {
    if (rawMessages.length > 0 && !isSpeaking) {
      const lastMessage = rawMessages[rawMessages.length - 1];
      if (lastMessage.role === 'assistant' && typeof lastMessage.content === 'string') {
        playAIResponse(lastMessage.content);
      }
    }
  }, [rawMessages]);

  // Apply dark mode class to body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imagePreview) {
      await append({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imagePreview,
            },
          },
          ...(input.trim() ? [{ type: "text" as const, text: input }] : []),
        ],
      });
      setImagePreview(null);
    } else if (input.trim()) {
      originalHandleSubmit(e);
    }
  };

  // Toggle functions
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`min-h-screen font-poppins transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className={`fixed z-30 p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 ${
          isSidebarOpen ? 'left-64' : 'left-4'
        } top-4`}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-indigo-800 dark:bg-gray-800 shadow-lg z-20 transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-2xl font-bold text-white mb-8 mt-4">VoiceFlow AI</h2>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-indigo-700 dark:bg-gray-700 text-white font-medium flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 text-white font-medium flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 text-white font-medium flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Settings
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-auto">
            <button 
              onClick={toggleDarkMode}
              className="w-full px-4 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 text-white font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {darkMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                )}
              </svg>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-6`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChatPanel
            rawMessages={rawMessages}
            imagePreview={imagePreview}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            input={input}
            setImagePreview={setImagePreview}
            darkMode={darkMode}
            toggleVoiceAssist={toggleVoiceAssist}
            isVoiceAssistActive={isVoiceAssistActive}
            caption={caption}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* About Section */}
        <div className={`mt-8 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4">About VoiceFlow AI</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            VoiceFlow AI is your advanced conversational assistant with seamless voice interaction capabilities.
            Powered by Deepgram's state-of-the-art speech technology, it provides natural and responsive voice experiences.
          </p>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Current Features:</strong><br />
              • Real-time speech-to-text<br />
              • Natural sounding text-to-speech<br />
              • Multi-modal interactions (text + images)<br />
              • Dark/Light mode support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}