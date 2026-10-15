import type { Font } from 'fontkit';

export type FontFamily = 'sans' | 'serif' | 'comic' | 'mono';
export type FontWeight = 'normal' | 'bold';
export type FontStyle = 'normal' | 'italic';

export interface FontDescriptor {
  family: FontFamily;
  weight?: FontWeight;
  style?: FontStyle;
}

export function getFontFilePath(
  family: FontFamily,
  weight: FontWeight = 'normal',
  style: FontStyle = 'normal'
): string {
  const isBold = weight === 'bold';
  const isItalic = style === 'italic';

  let subDir = 'sans';
  let file = 'LiberationSans-Regular.ttf';

  switch (family) {
    case 'sans':
      subDir = 'sans';
      file = isBold
        ? 'LiberationSans-Bold.ttf'
        : isItalic
        ? 'LiberationSans-Italic.ttf'
        : 'LiberationSans-Regular.ttf';
      break;
    case 'serif':
      subDir = 'serif';
      file = isBold
        ? 'LiberationSerif-Bold.ttf'
        : isItalic
        ? 'LiberationSerif-Italic.ttf'
        : 'LiberationSerif-Regular.ttf';
      break;
    case 'mono':
      subDir = 'mono';
      file = isBold
        ? 'LiberationMono-Bold.ttf'
        : isItalic
        ? 'LiberationMono-Italic.ttf'
        : 'LiberationMono-Regular.ttf';
      break;
    case 'comic':
      subDir = 'comic';
      file = isBold ? 'ComicNeue-Bold.ttf' : 'ComicNeue-Regular.ttf';
      break;
  }

  if (typeof process !== 'undefined' && process.cwd) {
    const cwd = process.cwd();
    if (cwd.endsWith('packages/core')) {
      return `${cwd}/src/fonts/${subDir}/${file}`;
    }
    return `${cwd}/packages/core/src/fonts/${subDir}/${file}`;
  }

  return `${subDir}/${file}`;
}

const fontCache = new Map<string, Font>();

export function registerFont(key: string, font: Font): void {
  fontCache.set(key, font);
}

// Browser fallback font metrics
export function createFallbackFont(family: FontFamily, weight: FontWeight = 'normal') {
  const unitsPerEm = 1000;
  const isBold = weight === 'bold';
  const weightFactor = isBold ? 1.05 : 1.0;

  const getCharWidth = (char: string): number => {
    if (family === 'mono') {
      return 600;
    }
    if (char === ' ') return 278;
    if (/[ijlI1.,;:'!]/.test(char)) return 280 * weightFactor;
    if (/[mwMW@%&]/.test(char)) return 850 * weightFactor;
    if (/[A-Z]/.test(char)) return 680 * weightFactor;
    if (/[0-9]/.test(char)) return 550 * weightFactor;
    return 520 * weightFactor;
  };

  return {
    unitsPerEm,
    familyName: family,
    layout: (text: string) => {
      let advanceWidth = 0;
      const glyphs = [];
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const w = getCharWidth(char);
        advanceWidth += w;
        glyphs.push({
          id: i + 1,
          codePoints: [char.charCodeAt(0)],
          advanceWidth: w,
        });
      }
      return {
        advanceWidth,
        glyphs,
      };
    },
  };
}

export function loadFont(
  family: FontFamily,
  weight: FontWeight = 'normal',
  style: FontStyle = 'normal'
): Font {
  const key = `${family}-${weight}-${style}`;
  if (fontCache.has(key)) {
    return fontCache.get(key) as Font;
  }

  // In browser environments where filesystem is unavailable, provide accurate fallback metrics
  const fallback = createFallbackFont(family, weight);
  fontCache.set(key, fallback as unknown as Font);
  return fallback as unknown as Font;
}
