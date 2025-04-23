export async function handleResponse(responseObject: any) {
	// console.log("Response String: ",responseString);
	//  const responseObject = JSON.parse(responseString);
	console.log('Use Terminator : ', responseObject);

	if (responseObject.action === 'open_app') {
		console.log('Opening app:', responseObject.target);
		// Add logic to open the app here

		const apps_executables = {
			'Windows Terminal': 'wt.exe',
			'Microsoft Edge': 'msedge.exe',
			'Google Chrome': 'chrome.exe',
			'Mozilla Firefox': 'firefox.exe',
			'VLC Media Player': 'vlc.exe',
			'Adobe Reader': 'AcroRd32.exe',
			Skype: 'skype.exe',
			Spotify: 'spotify.exe',
			'Visual Studio Code': 'Code.exe',
			Notepad: 'notepad.exe',
			Calculator: 'calc.exe',
			Paint: 'mspaint.exe',
			'File Explorer': 'explorer.exe',
			'Command Prompt': 'cmd.exe',
			PowerShell: 'powershell.exe',
			WordPad: 'write.exe',
			'Task Manager': 'taskmgr.exe',
			'Control Panel': 'control.exe',
			'Registry Editor': 'regedit.exe',
			'Snipping Tool': 'snippingtool.exe',
		};

		const appName = responseObject.target as keyof typeof apps_executables;
		const appPath = apps_executables[appName];
		console.log('App Path:', appPath);

		if (appPath) {
			try {
				const response = await fetch('/api/open-app', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ appName: appPath }),
				});

				const data = await response.json();

				if (response.ok) {
					console.log('Command executed successfully:', data);
				} else {
					console.log('Error executing command:', data.error);
				}
			} catch (error) {
				console.error('Error opening URL:', error);
			}
		} else {
			console.log('App not found in the list.');
		}
	} else if (responseObject.action === 'open_website') {
		const url = responseObject.target;
		console.log('Running command:', url);
		// Add logic to open the website here
		try {
			const response = await fetch('/api/open-url', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			});

			const data = await response.json();

			if (response.ok) {
				console.log('Command executed successfully:', data);
			} else {
				console.log('Error executing command:', data.error);
			}
		} catch (error) {
			console.error('Error opening URL:', error);
		}
	} else if (responseObject.action === 'run_command') {
		const command = responseObject.target;
		console.log('Running command:', command);

		if (responseObject.target) {
			try {
				const response = await fetch('/api/execute-cmd', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ command }),
				});

				const data = await response.json();

				if (response.ok) {
					console.log('Command executed successfully:', data);
				} else {
					console.log('Error executing command:', data.error);
				}
			} catch (error) {
				console.error('Error opening URL:', error);
			}
		} else {
			console.log('No command provided to run.');
		}
	} else if (responseObject.action === 'other') {
		console.log('Other action:', responseObject.target);
		// Add logic for other actions here
	} else {
		console.log('Unknown action:', responseObject.action);
		// Handle unknown action here
	}
}
