import { useState, useEffect, useCallback } from 'react';
import {
	CreateProjectKeyResponse,
	DeepgramClient,
	LiveClient,
	LiveTranscriptionEvents,
	createClient,
} from '@deepgram/sdk';
import Recording from './recording.svg';


interface LeftPanelProps {
	isMonitoring: boolean;
	setIsMonitoring: (value: boolean) => void;
	activeTab: 'vision' | 'images' | 'auto';
	setActiveTab: (tab: 'vision' | 'images' | 'auto') => void;
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
				model: 'nova',
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
			{/* Welcome Section */}
			<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-medium text-gray-800">Welcome back!</h2>
					<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
						Live
					</span>
				</div>
				<div className="mt-4 space-y-3">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-red-500"></div>
						<span className="text-sm font-medium text-gray-700">
							Vision: UI ✗
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
						<span className="text-sm font-medium text-gray-700">
							Vision: Analyzing...
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div
							className={`w-2 h-2 rounded-full ${
								isMonitoring ? 'bg-green-500' : 'bg-gray-400'
							}`}
						></div>
						<span className="text-sm font-medium text-gray-700">
							Status: {isMonitoring ? 'Active' : 'Inactive'}
						</span>
					</div>
				</div>
			</div>

			{/* Toggle Buttons */}
			<div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
				<div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
					{(['vision', 'images', 'auto'] as const).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`py-2 text-sm rounded-lg transition-all ${
								activeTab === tab
									? 'bg-blue-500 text-white shadow-md'
									: 'bg-white text-gray-700 hover:bg-gray-50'
							}`}
						>
							{tab === 'vision'
								? 'Vision'
								: tab === 'images'
								? 'Images'
								: 'Auto'}
						</button>
					))}
				</div>
			</div>

			{/* Microphone Section */}
			<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
				<div className="flex flex-col items-center">
					{!!userMedia && !!microphone && micOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="168"
							height="129"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-red-500"
						>
							<path d="M12 1v10"></path>
							<path d="M5 10a7 7 0 0 0 14 0"></path>
							<path d="M12 19v4"></path>
							<path d="M8 23h8"></path>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="168"
							height="129"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-gray-500"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12" y2="16"></line>
						</svg>
					)}

					<button className="w-24 h-24" onClick={() => toggleMicrophone()}>
						<Recording
							width="96"
							height="96"
							className={
								`cursor-pointer` +
								(!!userMedia && !!microphone && micOpen
									? ' fill-red-400 drop-shadow-glowRed'
									: ' fill-gray-600')
							}
						/>
					</button>
					<div className="mt-4 text-center">
						{caption && micOpen
							? caption
							: '** Realtime transcription by Deepgram **'}
					</div>
				</div>
				{/* <GrowqAgentResponse
					caption={caption}
					isFinal={isFinal}
					deepgram={deepgram}
				/> */}
			</div>
		</div>
	);
}
