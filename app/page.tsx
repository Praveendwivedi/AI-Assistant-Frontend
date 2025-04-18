'use client';

import { useChat } from '@/hooks/useChat';
import { useState } from 'react';
import Header from '@/components/Header';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';

export default function JarvisAssistant() {
	const {
		messages: rawMessages,
		input,
		handleInputChange,
		handleSubmit: originalHandleSubmit,
		append,
	} = useChat();
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isMonitoring, setIsMonitoring] = useState(false);
	const [activeTab, setActiveTab] = useState<'vision' | 'images' | 'auto'>(
		'vision'
	);

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

	return (
		<div className="jarvis-container p-4 min-h-screen font-poppins bg-gray-50">
			<Header />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<LeftPanel
					isMonitoring={isMonitoring}
					setIsMonitoring={setIsMonitoring}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
				<RightPanel
					rawMessages={rawMessages}
					imagePreview={imagePreview}
					handleFileChange={handleFileChange}
					handleSubmit={handleSubmit}
					handleInputChange={handleInputChange}
					input={input}
					setImagePreview={setImagePreview}
				/>
			</div>
		</div>
	);
}
