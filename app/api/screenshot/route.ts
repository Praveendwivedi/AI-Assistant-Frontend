// pages/api/capture.ts
import { DesktopUseClient } from "@/components/ts-sdk/src";
import { NextResponse } from "next/server";

export async function POST() {
  const client = new DesktopUseClient();

  try {
//     const ss = await client.captureScreen();
    const ss = await client.captureMonitorByName("\\\\.\\DISPLAY1");

    console.log("Screenshot taken successfully:", ss);
    return NextResponse.json({ success: true, data:ss });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
