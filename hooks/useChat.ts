import { useState, useRef } from 'react';

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
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setInput('');
		}
	};

	return {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
	};
}
// export function useChat() {
// 	const [messages, setMessages] = useState<Message[]>([]);
// 	const [input, setInput] = useState<string>('');

// 	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setInput(e.target.value);
// 	};

// 	const append = async (message: Message): Promise<Message[]> => {
// 		console.log('Appending message:', message);

// 		return new Promise((resolve) => {
// 			setMessages((prevMessages) => {
// 				const updatedMessages = [...prevMessages, message];
// 				resolve(updatedMessages);
// 				return updatedMessages;
// 			});
// 		});
// 	};

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		if (!input.trim()) return;

// 		// Add the user's message to the chat
// 		const userMessage: UserMessage = {
// 			role: 'user',
// 			content: [
// 				{
// 					type: 'text',
// 					text: input,
// 				},
// 			],
// 		};
// 		await append(userMessage);

// 		// Call the custom API
// 		try {
// 			const response = await fetch('/api/chat', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({ messages }),
// 			});

// 			if (!response.ok) {
// 				throw new Error('Failed to fetch response from the API');
// 			}

// 			const data = await response.json();

// 			// Add the assistant's response to the chat
// 			const assistantMessage: Message = {
// 				role: 'assistant',
// 				content: data.content,
// 			};
// 			append(assistantMessage);
// 		} catch (error) {
// 			console.error('Error fetching data:', error);
// 		} finally {
// 			setInput('');
// 		}
// 	};

// 	return {
// 		messages,
// 		input,
// 		handleInputChange,
// 		handleSubmit,
// 		append,
// 	};
// }
