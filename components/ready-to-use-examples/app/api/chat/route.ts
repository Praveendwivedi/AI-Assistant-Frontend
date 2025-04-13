import { createOpenAI } from "@ai-sdk/openai"; 
import { streamText } from "ai"; 
export const maxDuration = 30; 

const groq = createOpenAI({ 
baseURL: "https://api.groq.com/openai/v1", 
apiKey: "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", 
}); 

export async function POST(req: Request) { 
    console.log("Request received");
const { messages } = await req.json(); 
const result = streamText({ 
	model: groq("llama3-8b-8192"), 
	messages, 
});

return result.toDataStreamResponse();
}
