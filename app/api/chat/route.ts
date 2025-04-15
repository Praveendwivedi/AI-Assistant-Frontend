import { createOpenAI } from '@ai-sdk/openai';
import { streamText, UIMessage } from 'ai';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';
import Groq from 'groq-sdk';
import type { NextRequest } from 'next/server';

export const maxDuration = 30;

const groq = new Groq({
	apiKey: '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',
	baseURL: 'https://api.groq.com',
});

export async function POST(req: NextRequest) {
	try {
		console.log('Request received');
		const { messages } = (await req.json()) as {
			messages: ChatCompletionMessageParam[];
		};

		console.log('messsages:', messages);
		const res = await groq.chat.completions.create({
			model: 'meta-llama/llama-4-scout-17b-16e-instruct',
			messages,
			temperature: 1,
			max_completion_tokens: 1024,
			top_p: 1,
			stream: false,
		});

		console.log('Response:', res);

		const content = res.choices?.[0]?.message?.content ?? '';

		return new Response(JSON.stringify({ content }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err: any) {
		console.error(err);
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
