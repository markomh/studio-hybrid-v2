import { Element, PuzzleElement } from '../schema';
import {
  ElementDefinition,
  ElementRegistry,
  ElementDefinitionNotFoundError,
  DuplicateElementDefinitionError,
} from './types';
import { textDefinition } from './text';
import {
  mazeDefinition,
  wordsearchDefinition,
  sudokuDefinition,
  worksheetDefinition,
  imageDefinition,
  shapeDefinition,
} from './puzzles';

export function createRegistry(): ElementRegistry {
  const definitions = new Map<string, ElementDefinition>();

  return {
    registerElement<T extends Element = Element>(def: ElementDefinition<T>): void {
      if (definitions.has(def.type)) {
        throw new DuplicateElementDefinitionError(def.type);
      }
      definitions.set(def.type, def as unknown as ElementDefinition);
    },

    getDefinition<T extends Element = Element>(type: string): ElementDefinition<T> | undefined {
      return definitions.get(type) as ElementDefinition<T> | undefined;
    },

    requireDefinition<T extends Element = Element>(type: string): ElementDefinition<T> {
      const def = definitions.get(type);
      if (!def) {
        throw new ElementDefinitionNotFoundError(type);
      }
      return def as ElementDefinition<T>;
    },

    listDefinitions(): ElementDefinition[] {
      return Array.from(definitions.values());
    },
  };
}

// Global default registry
const defaultRegistry = createRegistry();
defaultRegistry.registerElement(textDefinition);
defaultRegistry.registerElement(mazeDefinition);
defaultRegistry.registerElement(wordsearchDefinition);
defaultRegistry.registerElement(sudokuDefinition);
defaultRegistry.registerElement(worksheetDefinition);
defaultRegistry.registerElement(imageDefinition);
defaultRegistry.registerElement(shapeDefinition);

export function registerElement<T extends Element = Element>(def: ElementDefinition<T>): void {
  defaultRegistry.registerElement(def);
}

export function getDefinition<T extends Element = Element>(type: string): ElementDefinition<T> | undefined {
  return defaultRegistry.getDefinition(type);
}

export function requireDefinition<T extends Element = Element>(type: string): ElementDefinition<T> {
  return defaultRegistry.requireDefinition(type);
}

export function listDefinitions(): ElementDefinition[] {
  return defaultRegistry.listDefinitions();
}

/**
 * Resolves the appropriate ElementDefinition for an Element instance.
 * For puzzles, resolves by puzzle kind (e.g. 'maze', 'wordsearch').
 */
export function getElementDefinition(el: Element): ElementDefinition | undefined {
  if (el.type === 'puzzle') {
    const puzzle = el as PuzzleElement;
    const kind = puzzle.params?.kind || (puzzle.kind as unknown as { kind: string })?.kind;
    if (kind) {
      return getDefinition(kind);
    }
  }
  return getDefinition(el.type);
}

