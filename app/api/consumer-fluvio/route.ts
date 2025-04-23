 // pages/api/consume.ts
 import type { NextApiRequest, NextApiResponse } from 'next';
 import { getFluvio, TOPIC } from '@/lib/fluvio';
 import { Offset } from '@fluvio/client'; // Adjust this import based on the correct source of Offset
 
 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
     const fluvio = await getFluvio();
     const consumer = await fluvio.partitionConsumer(TOPIC, 0);
     const records: string[] = [];
     let shouldStop = false;
     await consumer.stream(Offset.FromBeginning(), (record) => {
       if (shouldStop) return;
       records.push(record.value.toString());
       if (records.length >= 10) {
         // Stop streaming after collecting 10 records
         shouldStop = true;
       }
     });
     res.status(200).json({ records });
   } catch (error: any) {
     res.status(500).json({ success: false, error: error.message });
   }
 }