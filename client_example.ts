import { DesktopUseClient, ApiError, sleep } from './ts-sdk/src/index';

// import { DesktopUseClient, ApiError, sleep } from 'terminator-ts-sdk';




(async() => {
    const client = new DesktopUseClient();

    console.log('opening notepad...');
    await client.openApplication('notepad');
    await sleep(1000);

    const notepadWindow = client.locator('window:Notepad');
    // const notepadWindow = notepadWindow.locator('name:RichEditD2DPT'); // adjust if necessary

    console.log('typing text...');
    await notepadWindow.typeText('hello from terminator!\nthis is a test.');
    await sleep(500);

    // press enter
    console.log('pressing enter...');
    await notepadWindow.pressKey('{enter}');
    await sleep(200);

    await notepadWindow.typeText('done.');

    const content = await notepadWindow.getText();
    console.log('notepad content retrieved:', content.text);
    console.log("\n--- Example Finished --- (Press Ctrl+C if server doesn't exit)");
})();