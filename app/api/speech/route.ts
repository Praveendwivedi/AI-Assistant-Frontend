// import { createClient } from "@deepgram/sdk";

// const fs = require("fs");
// const https = require("https");

// export const POST = async (request: Request) => {
//   const { text } = await request.json();
//   if (!text) return new Response("No text provided", { status: 400 });

//   const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");
//   const speechResponse = await deepgram.speak.request(
//     { text },
//     {
//       model: "aura-asteria-en",
//       apiKey: process.env.DEEPGRAM_API_KEY ?? "",
//     }
//   );

//   const stream = await speechResponse.getStream();
//   const headers = await speechResponse.getHeaders();

//   return new Response(stream);
// };


import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export const runtime = 'edge'; // Enable Edge runtime for better performance

export async function POST(request: Request) {
  try {
    const { text, voiceModel = "aura-asteria-en" } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Valid text is required" },
        { status: 400 }
      );
    }

    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error("Deepgram API key not configured");
    }

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    const response = await deepgram.speak.request(
      { text },
      {
        model: voiceModel,
      }
    );

    const stream = await response.getStream();
    const headers = await response.getHeaders();

    if (!stream) {
      throw new Error("No audio stream received from Deepgram");
    }

    return new Response(stream, { headers });
  } catch (error) {
    console.error("VoiceFlow AI TTS Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}