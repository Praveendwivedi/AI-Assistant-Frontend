"use client";

import { useEffect, useState } from "react";
import ChatGroq from "groq-sdk";
import { DeepgramClient } from "@deepgram/sdk";
import * as fs from "fs";

export default function GrowqAgentResponse({
  caption,
  isFinal,
  deepgram,
}: {
  caption: string | undefined | null;
  isFinal: boolean;
  deepgram: DeepgramClient | undefined | null;
}) {
  const [response, setResponse] = useState<string | null>();
  const [request, setRequest] = useState<string | null>();
  const [groqClient, setGroqClient] = useState<ChatGroq>();
  const [responseAudio, setResponseAudio] = useState<string | null>();

  useEffect(() => {
    if (caption?.endsWith("?") || isFinal) {
      setResponse("");
      setRequest(caption);
    }
  }, [caption, isFinal]);

  useEffect(() => {
    if (!groqClient) {
      console.log("getting a new api key");
      fetch("/api/groq", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("apiKey" in object)) throw new Error("No api key returned");
          const groq = new ChatGroq({
            apiKey: object.apiKey,
            dangerouslyAllowBrowser: true,
          });

          setGroqClient(groq);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [groqClient]);

  useEffect(() => {
    if (!groqClient) return;
    if (!request) return;

    console.log("Request", request);
    const completion = groqClient.chat.completions
      .create({
        messages: [
          {
            role: "assistant",
            content:
              "You are an AI Assistant who helps users to install softwares, " +
              "your answers should be very short, one sentence max, and to the point.",
          },
          {
            role: "user",
            content: request,
          },
        ],
        model: "llama3-8b-8192",
      })
      .then((chatCompletion) => {
        setResponse(chatCompletion.choices[0]?.message?.content);
      });
  }, [request, groqClient]);

  useEffect(() => {
    async function getSpeech() {
      if (!response) {
      console.log("No response available, skipping speech generation.");
      return;
      }
      if (!deepgram) {
      console.log("Deepgram client is not available, skipping speech generation.");
      return;
      }
      if (response === responseAudio) {
      console.log("Response has not changed, skipping speech generation.");
      return;
      }

      console.log("Setting responseAudio to the current response.");
      setResponseAudio(response);

      console.log("Sending request to /api/speech to generate speech audio.");
      const httpResp = await fetch("/api/speech", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: response }),
      cache: "no-store",
      });

      if (!httpResp.ok) {
      const errorText = await httpResp.text();
      console.error("Failed to generate speech audio:", errorText);
      throw new Error(errorText);
      }

      console.log("Received response from /api/speech.");
      if (httpResp.body) {
      console.log("Reading audio data from response body.");
      const buffer = await getAudioBuffer(httpResp.body);

      console.log("Converting audio buffer to Blob.");
      const blob = new Blob([buffer], { type: "audio/mp3" });

      console.log("Creating object URL for the audio Blob.");
      const url = URL.createObjectURL(blob);

      console.log("Playing generated audio.");
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      console.log("Audio playback started.");
      } else {
      console.error("Error: Response body is empty, unable to generate audio.");
      } 
    }
    getSpeech();
  }, [response, groqClient, deepgram, responseAudio]);

  return (
    <div>
      <div className="mt-1 mb-10 italic p-6 text-xl text-center">
        {response ? response : "..."}
      </div>
    </div>
  );
}

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response: any) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};
