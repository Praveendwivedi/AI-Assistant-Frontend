import { createOpenAI } from '@ai-sdk/openai';
import { streamText, UIMessage } from 'ai';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';
import Groq from 'groq-sdk';
import type { NextRequest } from 'next/server';

export const maxDuration = 30;

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: 'https://api.groq.com',
});

export async function POST(req: NextRequest) {
	try {
		console.log('Request received');
		const { messages } = (await req.json()) as {
			messages: ChatCompletionMessageParam[];
		};

		// Append the system prompt to the messages array
		const systemPrompt: ChatCompletionMessageParam = {
			role: 'system',
			content: `You are DeskBot, a task automation assistant that only responds strictly with valid JSON matching the schema below. Your job is to convert user instructions and OCR input into a sequence of one-step desktop automation commands.

Schema:
{
  "action": "<one of: open_app | open_website | run_command | search_app | other>",
  "target": "<application name, URL or full shell command>",
  "steps": "<one human-readable instruction to perform this step>"
}

Rules:
1. Strictly Output **only** the JSON—no explanatory text, no trailing commas, no comments. . No extra explanations or comments.

2. Always give only one step at a time. 

3. If input cannot be mapped to open_app, open_website, or run_command, then use "action": "other" and copy the full input into "target".

4. Use OCR text (if provided) to inform your instructions.

5. Always include a valid "steps" field, even for "other" actions.

Important:
1. Do not repeat any previously issued step.
Input:
You will receive a user request, optionally with OCR text. Parse the user intent, use the OCR data if available, and respond with one JSON block according to the schema.
`,
		};

		const updatedMessages = [systemPrompt, ...messages];

		console.log('Updated messages:', updatedMessages);

		const res = await groq.chat.completions.create({
			model: 'meta-llama/llama-4-scout-17b-16e-instruct',
			messages: updatedMessages,
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
