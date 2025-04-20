import ReactMarkdown from 'react-markdown';
import { Message } from '@/hooks/useChat';
import { useEffect, useState } from 'react';
import { handleResponse } from '@/hooks/useTerminator';

interface RightPanelProps {
	rawMessages: Message[];
	imagePreview: string | null;
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.FormEvent) => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	input: string;
	setImagePreview: (value: string | null) => void;
	caption: string | null;
	isFinal: boolean;
}

export default function RightPanel({
	rawMessages,
	imagePreview,
	handleFileChange,
	handleSubmit,
	handleInputChange,
	input,
	setImagePreview,
	caption,
	isFinal,
}: RightPanelProps) {

	const [lastAiMessage, setLastAiMessage] = useState<String | null>(rawMessages[rawMessages.length - 1]?.role == 'assistant' ? rawMessages[rawMessages.length - 1].content as string : null );


	// useEffect(() => {
	// 	function validateInstruction(text: string) {
	// 		const patterns = [
	// 		  {
	// 		    type: 'openApp',
	// 		    // matches "OPEN APP <anything…>"  ⇒ match[1] = the app name (can include spaces)
	// 		    regex: /^\s*OPEN APP\s+(.+)$/i,
	// 		  },
	// 		  {
	// 		    type: 'openUrl',
	// 		    // matches "OPEN URL http(s)://<no‑spaces>" ⇒ match[1] = the URL
	// 		    regex: /^\s*OPEN URL\s+(https?:\/\/\S+)$/i,
	// 		  },
	// 		  {
	// 		    type: 'commandPrompt',
	// 		    // matches exactly "OPEN COMMAND PROMPT"       ⇒ no capture group
	// 		    regex: /^\s*OPEN COMMAND PROMPT\s*$/i,
	// 		  },
	// 		  {
	// 		    type: 'highlightCommand',
	// 		    // matches "**anything**"                      ⇒ match[1] = anything
	// 		    regex: /\*\*(.+?)\*\*/,
	// 		  },
	// 		];
		   
	// 		const result = {
	// 		  isValid: false,
	// 		  type: '' as string,
	// 		  extracted: '' as string,
	// 		};
		   
	// 		for (const { type, regex } of patterns) {
	// 		  const match = text?.match(regex);
	// 		  if (match) {
	// 		    result.isValid = true;
	// 		    result.type = type;
	// 		    // only assign extracted if there *is* a capture group
	// 		    if (match[1]) result.extracted = match[1].trim();
	// 		    break;
	// 		  }
	// 		}
		   
	// 		return result;
	// 	   }
		   
	// 	   let result = validateInstruction(lastAiMessage as string );
	// 	   console.log("Validation Result:", result);
	//    }, [lastAiMessage]);


	   // useEffect(() => {
	// 	// whenever rawMessages changes…
	// 	const last = rawMessages[rawMessages.length - 1];
	// 	if (last?.role !== 'assistant') return;
	   
	// 	// coerce content to a single string
	// 	const text = typeof last.content === 'string'
	// 	  ? last.content
	// 	  : last.content
	// 		 .filter(c => c.type === 'text')
	// 		 .map(c => (c as any).text)
	// 		 .join(' ');
	   
	// 	// look for **your-command-here**
	// 	const cmd = text.match(/\*\*(.*?)\*\*/)?.[1]?.trim();
	// 	if (!cmd) return;
	   
	// 	// fire it off
	// 	fetch('/api/execute-cmd', {
	// 	  method: 'POST',
	// 	  headers: { 'Content-Type': 'application/json' },
	// 	  body: JSON.stringify({ command: cmd }),
	// 	})
	// 	  .then(r => r.json())
	// 	  .then(d => {
	// 	    if (d.success) console.log('CMD ran:', cmd);
	// 	    else console.error('CMD failed:', d.error);
	// 	  })
	// 	  .catch(console.error);
	//    }, [rawMessages]);
	   


	// Function to handle the caption input change	
	// API Call Functions
	
	useEffect(() => {

				const lastMessageContent = rawMessages[rawMessages.length - 1]?.content;
				if (typeof lastMessageContent === 'string') {
					handleResponse(lastMessageContent);
				}
			
	},[rawMessages]);


	useEffect(() => {
		if (rawMessages.length > 0) {
			const lastMessage = rawMessages[rawMessages.length - 1];
			if (lastMessage.role === 'assistant') {
				setLastAiMessage(lastMessage.content as string);
			}
		}
		console.log("Raw Messages:", rawMessages);
	},[rawMessages]);

	useEffect(() => {
		if (caption) {
			handleInputChange({
				target: { value: caption },
			} as React.ChangeEvent<HTMLInputElement>);

			// Automatically submit the form if isFinal is true
			if (caption?.toLowerCase().includes('enter') && isFinal) {
				handleSubmit(new Event('submit') as unknown as React.FormEvent);
			}
		}
	}, [caption, isFinal]);

	return (
		<div className="lg:col-span-2 space-y-4">
			<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">
					How can I help you?
				</h2>
				<div className="jarvis-message-area bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200">
					{/* Render Messages */}
					{rawMessages.length > 0 ? (
						rawMessages.map((m, index) => (
							<div
								className={`mb-3 last:mb-0 flex ${
									m.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
								key={index}
							>
								<div
									className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
										m.role === 'user'
											? 'bg-blue-500 text-white rounded-br-none'
											: 'bg-gray-100 text-gray-800 rounded-bl-none'
									}`}
								>
									{Array.isArray(m.content) ? (
										m.content.map((item, idx) => (
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
									) : typeof m.content === 'string' ? (
										(() => {
											try {
												// Parse the JSON string
												const parsedContent = JSON.parse(m.content);

												// Check if 'steps' exists and is an array
												if (parsedContent.steps && Array.isArray(parsedContent.steps)) {
													return (
														<ul className="list-disc pl-5">
															{parsedContent.steps.map((step: string, idx: number) => (
																<li key={idx}>{step}</li>
															))}
														</ul>
													);
												} else {
													return <p>No steps available.</p>;
												}
											} catch (error) {
												console.error('Failed to parse content:', error);
												return <p>Invalid content format.</p>;
											}
										})()
									) : (
										JSON.stringify(m.content)
									)}
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
