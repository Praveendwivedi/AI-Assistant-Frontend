import { NextResponse } from "next/server";
import { DesktopUseClient, sleep } from "@/components/ts-sdk/src";

export async function GET() {
    const client = new DesktopUseClient();

    try {
        const calculatorWindow = client.locator("window:Calculator");
        await calculatorWindow.pressKey("%{F4}"); // Alt+F4 on Windows
        return NextResponse.json({ success: true, message: "Calculator closed successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
}