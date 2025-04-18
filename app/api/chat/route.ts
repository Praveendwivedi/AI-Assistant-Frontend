// File: app/api/chat/route.ts
import { NextResponse, NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';

// Initialize GROQ client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: 'https://api.groq.com',
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse incoming payload
    const { messages } = (await request.json()) as {
      role: string;
      content: any;            // could be array-of-blocks or plain string
    }[];

    // 2. System prompt with your defaults
    const systemPrompt = `
You are an instruction assistant. and instruction having for only desktop uses so gives reply accorgingly,Give very short, step-by-step answers.
• When you need to open an app, include: OPEN APP APPNAME  
• When you need a command prompt: OPEN COMMAND PROMPT  
• Highlight only commands prompt queries(only highlight that have acctucal command that we execcute in command prompt !) with **double asterisks**.
`.trim();

    // 3. Build the array for the LLM call
    const chatMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => {
        let text: string;

        if (Array.isArray(msg.content)) {
          // flatten blocks
          text = msg.content
            .map((block: any) => {
              if (block.type === 'text') {
                return block.text;
              }
              if (block.type === 'image_url') {
                return `Image: ${block.image_url.url}`;
              }
              // fallback for any other block
              return JSON.stringify(block);
            })
            .join('\n\n');
        } else if (typeof msg.content === 'string') {
          // already plain text
          text = msg.content;
        } else {
          // last resort: JSON‑serialize whatever it is
          text = JSON.stringify(msg.content);
        }

        return { role: msg.role as any, content: text };
      }),
    ];

    // 4. Call the LLM
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: chatMessages,
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    // 5. Return the AI’s reply
    const content = response.choices?.[0]?.message?.content ?? '';
    console.log('AI Response:', content);
    return NextResponse.json({ content });
  } catch (err: any) {
    console.error('Chat Route Error:', err);
    return NextResponse.json(
      { error: err.message || 'Unknown server error' },
      { status: 500 }
    );
  }
}
