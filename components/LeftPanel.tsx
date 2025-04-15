interface LeftPanelProps {
	isMonitoring: boolean;
	setIsMonitoring: (value: boolean) => void;
	activeTab: 'vision' | 'images' | 'auto';
	setActiveTab: (tab: 'vision' | 'images' | 'auto') => void;
}

export default function LeftPanel({
	isMonitoring,
	setIsMonitoring,
	activeTab,
	setActiveTab,
}: LeftPanelProps) {
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

			{/* Action Buttons */}
			<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
				<div className="flex justify-center">
					<button
						onClick={() => setIsMonitoring(!isMonitoring)}
						className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
							isMonitoring
								? 'bg-red-500 hover:bg-red-600 animate-pulse'
								: 'bg-green-500 hover:bg-green-600'
						}`}
					>
						<span className="text-white font-medium text-sm">
							{isMonitoring ? 'Stop' : 'Start'}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
