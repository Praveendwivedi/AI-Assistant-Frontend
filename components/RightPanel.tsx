import ReactMarkdown from 'react-markdown';
import { Message } from '@/hooks/useChat';
import { it } from 'node:test';
import {getOpenApp} from '@/lib/parseInstructions';
import { useInstructionParser } from '@/hooks/useInstructionParser';
import { m } from 'framer-motion';
import { useEffect } from 'react';

interface RightPanelProps {
    rawMessages: Message[];
    imagePreview: string | null;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    input: string;
    setImagePreview: (value: string | null) => void;
}

export default function RightPanel({
    rawMessages,
    imagePreview,
    handleFileChange,
    handleSubmit,
    handleInputChange,
    input,
    setImagePreview,
}: RightPanelProps) {

    console.log("Texts : ",rawMessages.map((m) => m.content).join('\n\n'));
    const { shell, app, commands } = useInstructionParser(rawMessages[rawMessages.length - 1]?.content as string);
    console.log("Shell : ", shell);
    console.log("App : ", app);
    console.log("Commands : ", commands);
    
    useEffect(() => {
        const runActions = async () => {
          try {
            if (shell ) {
              console.log('Opening App:', app);
              const res = await fetch("/api/execute-cmd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command: commands[0] }),
              });
              const result = await res.json();
              console.log('App Result:', result);
              handleInputChange({
                target: { value: result.data.text },
              } as React.ChangeEvent<HTMLInputElement>);
        
                handleSubmit(new Event('submit') as unknown as React.FormEvent);

            }
          } catch (err) {
            console.error('Error opening app:', err);
          }
        };
      
        runActions();
      }, [shell,commands]);
      
    


    return (
        <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    How can I help you?
                </h2>
                <div className="jarvis-message-area bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200">
  {rawMessages.length > 0 ? (
    rawMessages.map((m, index) => (
      // 1) Wrap each message in a flex container:
      <div
        key={index}
        className={`mb-3 last:mb-0 flex ${
          m.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        {/* 2) Inner bubble */}
        <div
          className={`
            inline-block px-4 py-2 rounded-xl max-w-[80%]
            ${m.role === 'user'
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'}
          `}
        >
          {/* 3) Render text or images */}
          {Array.isArray(m.content)
            ? m.content.map((item, idx) => (
                <div key={idx}>
                  {item.type === 'text' && (
                    <ReactMarkdown>{item.text}</ReactMarkdown>
                  )}
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
      <p className="text-gray-500">No conversation yet</p>
    </div>
  )}
</div>


                {/* Form */}
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
                        <label className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-100 transition-all">
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
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}