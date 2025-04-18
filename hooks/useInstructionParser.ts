// hooks/useInstructionParser.ts
import { useEffect, useMemo, useState } from 'react';

export function useInstructionParser() {
	const [text, setText] = useState<string | undefined>(undefined);
	const [shell, setShell] = useState<string | null>(null);
	const [app, setApp] = useState<string | null>(null);
	const [commands, setCommands] = useState<string[]>([]);

	useEffect(() => {
		console.log('Text:', text);

		const _shell = text?.includes('OPEN COMMAND PROMPT') ? 'cmd.exe' : null;
		setShell(_shell);

		const appMatch = text?.match(/OPEN APP ([\w\s]+)/i);
		const _app = appMatch ? appMatch[1].trim() : null;
		setApp(_app);

		// New regex to find all **commands**
		const rawMatches = text?.match(/\*\*(.*?)\*\*/g);
		const _commands = rawMatches
			? rawMatches.map((match) =>
					// remove the surrounding ** and trim whitespace
					match.slice(2, -2).trim()
			  )
			: [];
		setCommands(_commands);
	}, [text]);

	return { shell, app, commands, setText, text };
}
