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

    // API Call Functions
    const openCalculator = async () => {
        try {
			console.log("Opening calculator...");
            const response = await fetch('/api/terminator/open-calculator');
            const data = await response.json();
            if (data.success) {
                alert('Calculator opened successfully!');
            } else {
                alert(`Failed to open calculator: ${data.error}`);
            }
        } catch (error) {
            console.error('Error opening calculator:', error);
        }
    };

    const performCalculation = async () => {
        try {
            const response = await fetch('/api/terminator/calculate', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                alert(`Calculation result: ${data.result}`);
            } else {
                alert(`Failed to perform calculation: ${data.error}`);
            }
        } catch (error) {
            console.error('Error performing calculation:', error);
        }
    };

    const getDisplayText = async () => {
        try {
            const response = await fetch('/api/terminator/get-display');
            const data = await response.json();
            if (data.success) {
                alert(`Calculator display text: ${data.displayText}`);
            } else {
                alert(`Failed to get display text: ${data.error}`);
            }
        } catch (error) {
            console.error('Error getting display text:', error);
        }
    };

    const closeCalculator = async () => {
        try {
            const response = await fetch('/api/terminator/close-calculator');
            const data = await response.json();
            if (data.success) {
                alert('Calculator closed successfully!');
            } else {
                alert(`Failed to close calculator: ${data.error}`);
            }
        } catch (error) {
            console.error('Error closing calculator:', error);
        }
    };

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

            {/* Buttons to Trigger API Calls */}
            <div className="mt-4 space-y-2">
                <button
                    onClick={openCalculator}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Open Calculator
                </button>
                <button
                    onClick={performCalculation}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Perform Calculation (1 + 2)
                </button>
                <button
                    onClick={getDisplayText}
                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                    Get Display Text
                </button>
                <button
                    onClick={closeCalculator}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Close Calculator
                </button>
            </div>
        </div>
    );
}