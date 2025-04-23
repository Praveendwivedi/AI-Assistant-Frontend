import { NextResponse, NextRequest } from "next/server";
import { DesktopUseClient } from "desktop-use";
import { sleep } from "@/components/ts-sdk/src";

export async function POST(request: NextRequest) {
  const client = new DesktopUseClient();
  try {
  
    const ocrData = await client.captureScreen();
    console.log("Captured screen data:", ocrData);

    return NextResponse.json({ocrData
     
    });
  } catch (error) {
    console.error("Error executing command:", error);
    return NextResponse.json(
      { error: "An error occurred while executing the command." },
      { status: 500 }
    );
  }
}
