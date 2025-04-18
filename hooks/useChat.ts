import { useState, useRef, useEffect } from 'react';

interface TextContent {
	type: 'text';
	text: string;
}

interface ImageUrlContent {
	type: 'image_url';
	image_url: {
		url: string;
	};
}

type UserMessageContent = TextContent | ImageUrlContent;
type SystemMessageContent = string;

interface UserMessage {
	role: 'user';
	content: UserMessageContent[];
}

interface SystemMessage {
	role: 'assistant' | 'system';
	content: SystemMessageContent;
}

export type Message = UserMessage | SystemMessage;

export function useChat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>('');
	const [responseAudio, setResponseAudio] = useState<string | null>(null); // For audio response
	const messagesRef = useRef<Message[]>([]); // Ref to track the latest messages

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const append = async (message: Message): Promise<Message[]> => {
		console.log('Appending message:', message);

		return new Promise((resolve) => {
			setMessages((prevMessages) => {
				const updatedMessages = [...prevMessages, message];
				messagesRef.current = updatedMessages; // Update the ref
				resolve(updatedMessages);
				return updatedMessages;
			});
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim()) return;

		// Add the user's message to the chat
		const userMessage: UserMessage = {
			role: 'user',
			content: [
				{
					type: 'text',
					text: input,
				},
			],
		};
		await append(userMessage);

		// Call the custom API with the latest messages from the ref
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ messages: messagesRef.current }),
			});

			if (!response.ok) {
				throw new Error('Failed to fetch response from the API');
			}

			const data = await response.json();

			// Add the assistant's response to the chat
			const assistantMessage: Message = {
				role: 'assistant',
				content: data.content,
			};
			append(assistantMessage);

			// Generate and play audio for the assistant's response
			await generateAndPlayAudio(data.content);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setInput('');
		}
	};

	// Function to generate and play audio for the assistant's response
	const generateAndPlayAudio = async (response: string) => {
		if (!response) {
			console.log('No response available, skipping speech generation.');
			return;
		}

		if (response === responseAudio) {
			console.log('Response has not changed, skipping speech generation.');
			return;
		}

		console.log('Setting responseAudio to the current response.');
		setResponseAudio(response);

		console.log('Sending request to /api/speech to generate speech audio.');
		const httpResp = await fetch('/api/speech', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text: response }),
			cache: 'no-store',
		});

		if (!httpResp.ok) {
			const errorText = await httpResp.text();
			console.error('Failed to generate speech audio:', errorText);
			throw new Error(errorText);
		}

		console.log('Received response from /api/speech.');
		if (httpResp.body) {
			console.log('Reading audio data from response body.');
			const buffer = await getAudioBuffer(httpResp.body);

			console.log('Converting audio buffer to Blob.');
			const blob = new Blob([buffer], { type: 'audio/mp3' });

			console.log('Creating object URL for the audio Blob.');
			const audio = new Audio(URL.createObjectURL(blob));

			console.log('Playing generated audio.');
			audio.play();
			console.log('Audio playback started.');
		} else {
			console.error('Error: Response body is empty, unable to generate audio.');
		}
	};

	// Helper function to convert stream to audio buffer
	const getAudioBuffer = async (response: any) => {
		const reader = response.getReader();
		const chunks = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			chunks.push(value);
		}

		const dataArray = chunks.reduce(
			(acc, chunk) => Uint8Array.from([...acc, ...chunk]),
			new Uint8Array(0)
		);

		return Buffer.from(dataArray.buffer);
	};

	return {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
	};
}
