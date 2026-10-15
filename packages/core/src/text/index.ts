import { FontFamily, FontWeight, FontStyle, FontDescriptor, loadFont } from '../fonts';
import { ptToMm } from '../units';

export interface TextLine {
  text: string;
  widthMm: number;
  overflow?: boolean;
}

export function measureText(
  text: string,
  fontOrDescriptor: FontFamily | FontDescriptor,
  fontSizePt: number,
  letterSpacingPt = 0
): number {
  if (!text) return 0;

  const family: FontFamily =
    typeof fontOrDescriptor === 'string' ? fontOrDescriptor : fontOrDescriptor.family;
  const weight: FontWeight =
    typeof fontOrDescriptor === 'object' ? fontOrDescriptor.weight || 'normal' : 'normal';
  const style: FontStyle =
    typeof fontOrDescriptor === 'object' ? fontOrDescriptor.style || 'normal' : 'normal';

  const font = loadFont(family, weight, style);
  const run = font.layout(text);
  const glyphWidthPt = (run.advanceWidth * fontSizePt) / font.unitsPerEm;
  const spacingPt = text.length > 1 ? (text.length - 1) * letterSpacingPt : 0;
  const totalPt = glyphWidthPt + spacingPt;

  return ptToMm(totalPt);
}

export function wrapText(
  text: string,
  fontOrDescriptor: FontFamily | FontDescriptor,
  fontSizePt: number,
  widthMm: number,
  letterSpacingPt = 0
): TextLine[] {
  if (!text) return [];

  const lines: TextLine[] = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (para === '') {
      lines.push({ text: '', widthMm: 0 });
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordWidth = measureText(word, fontOrDescriptor, fontSizePt, letterSpacingPt);

      // Check if a single word is wider than the entire box
      if (wordWidth > widthMm) {
        if (currentLine.length > 0) {
          lines.push({
            text: currentLine,
            widthMm: measureText(currentLine, fontOrDescriptor, fontSizePt, letterSpacingPt),
          });
          currentLine = '';
        }

        // Break oversized word across lines character by character and mark overflow
        let chunk = '';
        for (let c = 0; c < word.length; c++) {
          const char = word[c];
          const testChunk = chunk + char;
          const testWidth = measureText(testChunk, fontOrDescriptor, fontSizePt, letterSpacingPt);

          if (testWidth > widthMm && chunk.length > 0) {
            lines.push({
              text: chunk,
              widthMm: measureText(chunk, fontOrDescriptor, fontSizePt, letterSpacingPt),
              overflow: true,
            });
            chunk = char;
          } else {
            chunk = testChunk;
          }
        }

        if (chunk.length > 0) {
          currentLine = chunk;
        }
        continue;
      }

      // Normal word packing
      const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      const testWidth = measureText(testLine, fontOrDescriptor, fontSizePt, letterSpacingPt);

      if (testWidth <= widthMm) {
        currentLine = testLine;
      } else {
        if (currentLine.length > 0) {
          lines.push({
            text: currentLine,
            widthMm: measureText(currentLine, fontOrDescriptor, fontSizePt, letterSpacingPt),
          });
        }
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      const lineW = measureText(currentLine, fontOrDescriptor, fontSizePt, letterSpacingPt);
      lines.push({
        text: currentLine,
        widthMm: lineW,
        overflow: lineW > widthMm ? true : undefined,
      });
    }
  }

  return lines;
}
