import screenshot from 'screenshot-desktop'; // Optional: For taking screenshots

export async function GET() {
	try {
		const image = await screenshot({ format: 'png' });
		return new Response(image, {
			headers: {
				'Content-Type': 'image/png',
				'Content-Disposition': 'attachment; filename="screenshot.png"',
			},
		});
	} catch (error) {
		return new Response('Error taking screenshot', { status: 500 });
	}
}
