import { NextResponse } from 'next/server';
import { pipe } from '@screenpipe/js';
import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';

export async function POST(request: Request) {
	try {
		const { messages, model } = await request.json();

		console.log('model:', model);

		// query last 5 minutes of activity
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
		const results = await pipe.queryScreenpipe({
			startTime: fiveMinutesAgo,
			limit: 10,
			contentType: 'all',
		});

		// setup ollama with selected model
		const provider = ollama(model);

		const result = streamText({
			model: provider,
			messages: [
				...messages,
				{
					role: 'user',
					content: `analyze this activity data and summarize what i've been doing: ${JSON.stringify(
						results
					)}`,
				},
			],
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error('error:', error);
		return NextResponse.json(
			{ error: 'failed to analyze activity' },
			{ status: 500 }
		);
	}
}
