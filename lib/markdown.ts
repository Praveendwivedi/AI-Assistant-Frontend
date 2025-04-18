/**
 * Splits a string into an array of segments:
 *  - { type: 'bold', text: string }
 *  - { type: 'text', text: string }
 *
 * Anything wrapped in **…** becomes a bold segment.
 */
export function parseBoldSegments(input: string) {
     const parts: { type: 'bold' | 'text'; text: string }[] = [];
     const regex = /\*\*(.+?)\*\*/g;
     let lastIndex = 0;
     let match: RegExpExecArray | null;
   
     while ((match = regex.exec(input)) !== null) {
       // text before the **
       if (match.index > lastIndex) {
         parts.push({ type: 'text', text: input.slice(lastIndex, match.index) });
       }
       // the bold text
       parts.push({ type: 'bold', text: match[1] });
       lastIndex = match.index + match[0].length;
     }
   
     // any trailing text
     if (lastIndex < input.length) {
       parts.push({ type: 'text', text: input.slice(lastIndex) });
     }
   
     return parts;
   }
   