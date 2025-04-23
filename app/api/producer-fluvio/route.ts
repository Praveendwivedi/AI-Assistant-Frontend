// pages/api/produce.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFluvio, TOPIC } from '@/lib/fluvio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { message } = req.body;
    const fluvio = await getFluvio();
    const producer = await fluvio.topicProducer(TOPIC);
    await producer.send('defaultKey', message);
    res.status(200).json({ success: true, message: 'Produced!' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
