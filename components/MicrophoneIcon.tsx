import { motion } from 'framer-motion';

interface MicrophoneButtonProps {
	isRecording: boolean;
	isProcessing: boolean;
	onClick: () => void;
	size?: number; // New property to dynamically set the size
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
	isRecording,
	isProcessing,
	onClick,
	size = 150, // Default size is 64px
}) => {
	console.log(
		`MicrophoneButton: isRecording: ${isRecording}, isProcessing: ${isProcessing}, size: ${size}`
	);

	// Animation variants for the outer circle
	const pulseVariants = {
		recording: {
			scale: [1, 1.1, 1],
			opacity: [0.7, 1, 0.7],
			transition: {
				repeat: Infinity,
				duration: 1.5,
			},
		},
		idle: {
			scale: 1,
			opacity: 1,
		},
	};

	// Animation variants for the inner microphone icon
	const micVariants = {
		recording: {
			scale: [1, 1.1, 1],
			transition: {
				repeat: Infinity,
				duration: 1.5,
			},
		},
		idle: {
			scale: 1,
		},
	};

	return (
		<motion.div
			className="relative flex items-center justify-center"
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20 }}
		>
			<button
				className="focus:outline-none relative z-10"
				onClick={
					!isProcessing
						? () => {
								console.log('MicrophoneButton clicked');
								onClick();
						  }
						: undefined
				}
				disabled={isProcessing}
			>
				<motion.div
					className={`rounded-full flex items-center justify-center ${
						isRecording
							? 'bg-red-500 shadow-lg shadow-red-300 dark:shadow-red-900'
							: 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900'
					} cursor-pointer transition-colors duration-300`}
					style={{
						width: size,
						height: size,
					}}
					variants={pulseVariants}
					animate={isRecording ? 'recording' : 'idle'}
					whileTap={{ scale: 0.95 }}
				>
					<motion.div
						className="text-white"
						variants={micVariants}
						animate={isRecording ? 'recording' : 'idle'}
					>
						{isProcessing ? (
							<svg
								className="animate-spin"
								style={{
									width: size * 0.375, // Adjust icon size relative to button size
									height: size * 0.375,
								}}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						) : (
							<svg
								style={{
									width: size * 0.375, // Adjust icon size relative to button size
									height: size * 0.375,
								}}
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
									clipRule="evenodd"
								></path>
							</svg>
						)}
					</motion.div>
				</motion.div>
			</button>

			{isRecording && (
				<motion.div
					className="absolute inset-0 rounded-full border-2 border-red-500"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{
						opacity: [0.5, 0.2],
						scale: [1, 1.2],
					}}
					transition={{
						repeat: Infinity,
						duration: 1.5,
						repeatType: 'loop',
					}}
				/>
			)}
		</motion.div>
	);
};

export default MicrophoneButton;
