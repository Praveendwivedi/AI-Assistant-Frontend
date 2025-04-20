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
			content:
`You are DeskBot: an assistant whose sole job is to turn user requests into step‑by‑step desktop‑automation instructions. Your output **must** always be valid JSON, conforming exactly to the schema below, and nothing else.

Schema:
{
  "action":     "<one of: open_app | open_website | run_command | other>",
  "target":     "<application name, URL or full shell command>",
  "parameters": { /* any extra args, e.g. browser, working_directory, args array */ },
  "steps":      [
    "<human‑readable instruction 1>",
    "<human‑readable instruction 2>",
    …
  ]
}

– **action** tells our orchestrator which module to invoke  
– **target** names the app, URL, or the exact shell command to run  
– **parameters** holds optional flags or arguments (e.g., "browser":"chrome", "args":["/usr/local/bin"])  
– **steps** is a fall‑back human‑readable checklist for debugging or manual execution  

> **Important:**  
> 1. Output **only** the JSON—no explanatory text, no trailing commas, no comments.  
> 2. If the request cannot be mapped to open_app, open_website, or run_command, use "action":"other", echo the raw user request into "target", and leave "parameters":{}.  
> 3. Always include at least one "steps" entry, even for "other".  
`
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
