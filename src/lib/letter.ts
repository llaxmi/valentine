import type { LetterData } from "../components/ComposeLetter";
import { defaultLetter } from "../components/ComposeLetter";
import type { LetterRow } from "./api";

export function letterRowToData(row: LetterRow): LetterData {
  const { recipient, opening, body, signature, postscript, sticker, tone } =
    row;
  return { recipient, opening, body, signature, postscript, sticker, tone };
}

export function formatLetter(letter: LetterData): string {
  const parts = [
    letter.recipient ? `Hey ${letter.recipient.trim()}!` : "Hey there!",
    letter.opening || defaultLetter.opening,
    letter.body || defaultLetter.body,
    letter.signature
      ? `❤️ ${letter.signature.trim()}`
      : defaultLetter.signature,
  ];

  if (letter.postscript) parts.push(`P.S. ${letter.postscript}`);
  if (letter.sticker) parts.push(letter.sticker);

  return parts.join("\n\n");
}
