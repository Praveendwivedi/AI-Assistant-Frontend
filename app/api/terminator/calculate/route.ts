import { DesktopUseClient, sleep } from "@/components/ts-sdk/src";
import { NextResponse } from "next/server";
//import { DesktopUseClient, sleep } from "your-sdk-path"; // Replace with the correct SDK path

export async function POST() {
    const client = new DesktopUseClient();

    try {
        const calculatorWindow = client.locator("window:Calculator");
        const displayElement = calculatorWindow.locator("Id:CalculatorResults");
        const button1 = calculatorWindow.locator("Name:One");
        const buttonPlus = calculatorWindow.locator("Name:Plus");
        const button2 = calculatorWindow.locator("Name:Two");
        const buttonEquals = calculatorWindow.locator("Name:Equals");

        // Perform the calculation: 1 + 2 =
        await button1.click();
        await sleep(500);
        await buttonPlus.click();
        await sleep(500);
        await button2.click();
        await sleep(500);
        await buttonEquals.click();
        await sleep(1000);

        // Get the result
        const result = await displayElement.getText();
        return NextResponse.json({ success: true, result: result?.text });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
}