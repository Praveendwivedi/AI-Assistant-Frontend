import { NextResponse } from "next/server";
import { DesktopUseClient, sleep } from "@/components/ts-sdk/src";


export async function GET() {
    const client = new DesktopUseClient();
console.log("Opening calculator...");
    try {
        await client.openApplication("Calc"); // Adjust app name if necessary
        await sleep(2000); // Allow app to open
        return NextResponse.json({ success: true, message: "Calculator opened successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
}