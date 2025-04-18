function getOpenCommandPrompt(output: string): string | null {
     // If the AI says OPEN COMMAND PROMPT anywhere, we return the Windows shell
     return /\bOPEN COMMAND PROMPT\b/i.test(output) ? 'cmd.exe' : null;
   }



function getOpenApp(output: string): string | null {
     // Matches OPEN APP followed by one or more words (the app name)
     const m = output.match(/\bOPEN APP\s+([^\s.!,?]+)/i);
     return m ? m[1] : null;
   }

   function getInlineCommands(output: string): string[] {
     // Finds all occurrences of **command** and returns just the command text
     const commands: string[] = [];
     const re = /\*\*(.+?)\*\*/g;
     let match: RegExpExecArray | null;
     while ((match = re.exec(output)) !== null) {
       commands.push(match[1]);
     }
     return commands;
   }

export {
     getOpenCommandPrompt,
     getOpenApp,
     getInlineCommands
}