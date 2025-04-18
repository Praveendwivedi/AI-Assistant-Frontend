import { NextResponse, NextRequest } from 'next/server';
import { DesktopUseClient, sleep } from '@/components/ts-sdk/src';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json(); // ✅ use `url` instead of `URL`
    const client = new DesktopUseClient();

    console.log('Opening URL...');
    await client.openUrl(url);
    console.log('URL opened.');

    return NextResponse.json({ success: true, message: `URL opened successfully: ${url}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while opening the URL.' },
      { status: 500 }
    );
  }
}
