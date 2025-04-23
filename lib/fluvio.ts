import Fluvio from '@fluvio/client';

export const TOPIC = 'chat-topic'; // must match what exists in your Fluvio cluster

let fluvioInstance: Fluvio | null = null;

export async function getFluvio(): Promise<Fluvio> {
  if (!fluvioInstance) {
    fluvioInstance = await Fluvio.connect();
  }
  return fluvioInstance;
}
