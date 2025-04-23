import { NextResponse, NextRequest } from 'next/server';
import { DesktopUseClient } from 'desktop-use';
import { sleep } from '@/components/ts-sdk/src';

export async function POST(request: NextRequest) {
	const client = new DesktopUseClient();
	try {
		const { command } = await request.json();
		console.log(`Executing command: ${command}`);

		// check if command prompt is already open
		await client
			.findWindow({ titleContains: 'cmd' }, { timeout: 1000 })
			.then(async (window) => {
				await window.pressKey(command);
				await sleep(500);

				console.log('Pressing enter...');
				await window.pressKey('{enter}');
			})
			.catch(async (error) => {
				// Open Command Prompt
				await client.openApplication('cmd.exe');
				await sleep(2000);

				// Locate the Command Prompt window
				// const commandPromptWindow = client.locator('window:Command Prompt');
				const commandPromptLocator = await client.findWindow(
					{ titleContains: 'cmd' },
					{ timeout: 10000 }
				);
				await commandPromptLocator.pressKey(command);
				await sleep(500);

				console.log('Pressing enter...');
				await commandPromptLocator.pressKey('{enter}');
			});
		console.log('Command Prompt opened successfully.');
		console.log('Now executing command...');

		// Type directly using keyboard interface

		const ocrData = await client.captureScreen();
		console.log('Captured screen data:', ocrData);

		return NextResponse.json({
			success: true,
			data: ocrData,
			message: 'Command executed successfully.',
		});
	} catch (error) {
		console.error('Error executing command:', error);
		return NextResponse.json(
			{ error: 'An error occurred while executing the command.' },
			{ status: 500 }
		);
	}
}
