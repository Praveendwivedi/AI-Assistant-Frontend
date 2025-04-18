// hooks/useInstructionParser.ts
import { useMemo } from 'react';

export function useInstructionParser(text?: string) {

  console.log("Text : ",text);
  return useMemo(() => {
    const shell = text?.includes('OPEN COMMAND PROMPT') ? 'cmd.exe' : null;

    const appMatch = text?.match(/OPEN APP ([\w\s]+)/i);
    const app = appMatch ? appMatch[1].trim() : null;

    // New regex to find all **commands**
    const rawMatches = text?.match(/\*\*(.*?)\*\*/g);
    const commands = rawMatches
      ? rawMatches.map(match =>
          // remove the surrounding ** and trim whitespace
          match.slice(2, -2).trim()
        )
      : [];

    return { shell, app, commands };
  }, [text]);
}
