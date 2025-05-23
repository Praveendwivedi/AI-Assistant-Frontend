import { useState, useEffect, useCallback } from 'react';
import {
	CreateProjectKeyResponse,
	DeepgramClient,
	LiveClient,
	LiveTranscriptionEvents,
	createClient,
} from '@deepgram/sdk';
import MicrophoneButton from './MicrophoneIcon';

interface LeftPanelProps {
	isMonitoring: boolean;
	setIsMonitoring: (value: boolean) => void;
	activeTab: 'screenshot' | 'ocr' | 'screenshot+ocr' | 'none';
	setActiveTab: (tab: 'screenshot' | 'ocr' | 'screenshot+ocr' | 'none') => void;
	caption: string | null;
	setCaption: (caption: string) => void;
	isFinal: boolean;
	setIsFinal: (isFinal: boolean) => void;
}

export default function LeftPanel({
	isMonitoring,
	setIsMonitoring,
	activeTab,
	setActiveTab,
	caption,
	setCaption,
	isFinal,
	setIsFinal,
}: LeftPanelProps) {
	const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
	const [connection, setConnection] = useState<LiveClient | null>();
	const [isListening, setListening] = useState(false);
	const [isLoadingKey, setLoadingKey] = useState(true);
	const [isLoading, setLoading] = useState(true);
	const [micOpen, setMicOpen] = useState(false);
	const [microphone, setMicrophone] = useState<MediaRecorder | null>();
	const [userMedia, setUserMedia] = useState<MediaStream | null>();

	const [deepgram, setDeepgram] = useState<DeepgramClient>();

	const toggleMicrophone = useCallback(async () => {
		if (microphone && userMedia) {
			setUserMedia(null);
			setMicrophone(null);
			microphone.stop();
		} else {
			const userMedia = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});

			const microphone = new MediaRecorder(userMedia);
			microphone.start(500);

			microphone.onstart = () => {
				setMicOpen(true);
			};

			microphone.onstop = () => {
				setMicOpen(false);
			};

			microphone.ondataavailable = (e) => {
				connection?.send(e.data);
			};

			setUserMedia(userMedia);
			setMicrophone(microphone);
		}
	}, [microphone, userMedia, connection]);

	useEffect(() => {
		if (!apiKey) {
			fetch('/api', { cache: 'no-store' })
				.then((res) => res.json())
				.then((object) => {
					if (!('key' in object)) throw new Error('No API key returned');
					setApiKey(object);
					setLoadingKey(false);
				})
				.catch((e) => console.error(e));
		}
	}, [apiKey]);

	useEffect(() => {
		if (apiKey && 'key' in apiKey) {
			const deepgram = createClient(apiKey.key);
			setDeepgram(deepgram);
			const connection = deepgram.listen.live({
				model: 'nova-3',
				interim_results: true,
				smart_format: true,
				utterance_end_ms: 1000,
			});

			connection.on(LiveTranscriptionEvents.Open, () => setListening(true));
			connection.on(LiveTranscriptionEvents.Close, () => {
				setListening(false);
				setApiKey(null);
				setConnection(null);
			});

			connection.on(LiveTranscriptionEvents.Transcript, (data) => {
				const words = data.channel.alternatives[0].words;
				const caption = words
					.map((word: any) => word.punctuated_word ?? word.word)
					.join(' ');
				if (caption !== '') {
					setIsFinal(data.is_final);
					setCaption(caption);
				}
			});

			setConnection(connection);
			setLoading(false);
		}
	}, [apiKey]);

	if (isLoadingKey)
		return (
			<span className="w-full text-center">Loading temporary API key...</span>
		);
	if (isLoading)
		return <span className="w-full text-center">Loading the app...</span>;

	return (
		<div className="space-y-4">
			{/* Toggle Buttons */}
			<div className="bg-white p-4 rounded-2xl border-2 border-blue-300 shadow-sm">
				<div className="grid grid-cols-1 gap-3 bg-gray-100 p-3 rounded-2xl">
					{(['screenshot', 'ocr', 'screenshot+ocr', 'none'] as const).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`py-4 text-lg font-medium rounded-full transition-all duration-300 transform ${
								activeTab === tab
									? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg scale-105'
									: 'bg-gray-50 text-gray-700 hover:bg-gray-200 hover:shadow-md'
							}`}
						>
							{tab === 'screenshot'
    ? '📸 Screenshot'
    : tab === 'ocr'
    ? '🔠 OCR'
    : tab === 'screenshot+ocr'
    ? '📸+🔠 Screenshot + OCR'
    : '⚙️ Mode: None'}
						</button>
					))}
				</div>
			</div>

			{/* Microphone Section */}
			<div className="bg-white p-4 rounded-2xl border-2 border-blue-300 shadow-sm space-y-4">
				<div className="flex flex-col items-center">
					<MicrophoneButton
						isRecording={!!userMedia && !!microphone && micOpen}
						onClick={toggleMicrophone}
						isProcessing={isLoading || isLoadingKey}
					/>
					<div className="mt-4 text-center text-sm italic text-gray-500">
						{caption && micOpen
							? caption
							: 'Conversations are transcribed live'}
					</div>
				</div>
			</div>
		</div>
	);
}
