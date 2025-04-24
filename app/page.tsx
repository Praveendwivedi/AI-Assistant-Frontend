'use client';

import { useChat } from '@/hooks/useChat';
import { use, useEffect, useState } from 'react';
import Header from '@/components/Header';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';

export default function AIAssistant() {
	const {
		messages: rawMessages,
		input,
		handleInputChange,
		handleSubmit: originalHandleSubmit,
		append,
		lastAIResponse,
		setUseOCR,
		setUseScreenshot,
	} = useChat();
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isMonitoring, setIsMonitoring] = useState(false);
	const [activeTab, setActiveTab] = useState<
		'screenshot' | 'ocr' | 'screenshot+ocr' | 'none'
	>('ocr');
	const [caption, setCaption] = useState<string | null>(null);
	const [isFinal, setIsFinal] = useState(false);

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
				role: 'user',
				content: [
					{
						type: 'image_url',
						image_url: {
							url: imagePreview,
						},
					},
				],
			});
			setImage(null);
			setImagePreview(null);
		}

		if (input.trim()) {
			originalHandleSubmit(e);
		}
	};

	useEffect(() => {
		if (activeTab === 'screenshot') {
			setUseScreenshot(true);
			setUseOCR(false);
		}
		if (activeTab === 'ocr') {
			setUseScreenshot(false);
			setUseOCR(true);
		}
		if (activeTab === 'screenshot+ocr') {
			setUseScreenshot(true);
			setUseOCR(true);
		}
		if (activeTab === 'none') {
			setUseScreenshot(false);
			setUseOCR(false);
		}
	}, [activeTab, setUseScreenshot, setUseOCR]);
	return (
		<div className="jarvis-container p-4 min-h-screen font-poppins bg-gray-50">
			<Header />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<LeftPanel
					isMonitoring={isMonitoring}
					setIsMonitoring={setIsMonitoring}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					caption={caption}
					setCaption={setCaption}
					isFinal={isFinal}
					setIsFinal={setIsFinal}
				/>
				<RightPanel
					rawMessages={rawMessages}
					imagePreview={imagePreview}
					handleFileChange={handleFileChange}
					handleSubmit={handleSubmit}
					handleInputChange={handleInputChange}
					input={input}
					setImagePreview={setImagePreview}
					caption={caption}
					isFinal={isFinal}
					lastAIResponse={lastAIResponse}
				/>
			</div>
		</div>
	);
}
