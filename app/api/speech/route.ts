import { createClient } from "@deepgram/sdk";

const fs = require("fs");
const https = require("https");

export const POST = async (request: Request) => {
  const { text } = await request.json();
  if (!text) return new Response("No text provided", { status: 400 });

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");
  const speechResponse = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
      apiKey: process.env.DEEPGRAM_API_KEY ?? "",
    }
  );

  const stream = await speechResponse.getStream();
  const headers = await speechResponse.getHeaders();

  return new Response(stream);
};
