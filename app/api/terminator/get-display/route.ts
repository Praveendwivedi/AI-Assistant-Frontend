import { NextResponse } from "next/server";
import { DesktopUseClient, sleep } from "@/components/ts-sdk/src";


export async function GET() {
    const client = new DesktopUseClient();

    try {
        const calculatorWindow = client.locator("window:Calculator");
        const displayElement = calculatorWindow.locator("Id:CalculatorResults");

        // Wait for the display to be visible and get the text
        await displayElement.expectVisible(3000);
        const displayText = await displayElement.getText();
        return NextResponse.json({ success: true, displayText: displayText?.text });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
}