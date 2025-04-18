import { NextResponse, NextRequest } from 'next/server';
import { DesktopUseClient, sleep } from '@/components/ts-sdk/src';

export async function POST(request: NextRequest) {
  try {
    const { appName } = await request.json();
    const client = new DesktopUseClient();
    console.log(`Opening ${appName}...`);

    await client.openApplication(appName);
    await sleep(2000);

    return NextResponse.json({ success: true, message: `${appName} opened successfully` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while opening the application.' },
      { status: 500 }
    );
  }
}
