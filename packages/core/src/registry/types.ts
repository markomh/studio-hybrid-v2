import { Element } from '../schema';
import { LayoutPrimitive } from '../layout';

export interface ElementMargins {
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
}

export interface ElementContext {
  pageWidthMm: number;
  pageHeightMm: number;
  margins: ElementMargins;
  warnings?: string[];
}

export interface Capabilities {
  rotate: boolean;
  flipH: boolean;
  opacity: boolean;
  typography: boolean;
  fill: boolean;
  stroke: boolean;
  engine: { label: string } | null;
  solutionKey: boolean;
}

export type PropertyFieldKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'slider'
  | 'color'
  | 'switch'
  | 'number';

export type PropertyGroup = 'basic' | 'advanced';

export interface PropertySelectOption {
  value: string;
  labelKey: string;
}

export interface PropertyField {
  key: string;
  labelKey: string;
  kind: PropertyFieldKind;
  group: PropertyGroup;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: PropertySelectOption[];
  quick?: number;
  validate?: (value: unknown, el: unknown) => string | null | undefined;
}

export interface PaletteEntry<T extends Element = Element> {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  keywords: string[];
  create(ctx: ElementContext): T;
}

export interface ElementDefinition<T extends Element = Element> {
  type: T['type'];
  labelKey: string;
  capabilities: Capabilities;
  propertySchema: PropertyField[];
  palette: PaletteEntry<T>[];
  createDefault(ctx: ElementContext): T;
  layout(el: T, ctx: ElementContext): LayoutPrimitive[];
}

export class ElementDefinitionNotFoundError extends Error {
  constructor(type: string) {
    super(`Definisi elemen untuk tipe "${type}" tidak ditemukan di registry.`);
    this.name = 'ElementDefinitionNotFoundError';
  }
}

export class DuplicateElementDefinitionError extends Error {
  constructor(type: string) {
    super(`Tipe elemen "${type}" sudah terdaftar di registry.`);
    this.name = 'DuplicateElementDefinitionError';
  }
}

export interface ElementRegistry {
  registerElement<T extends Element = Element>(def: ElementDefinition<T>): void;
  getDefinition<T extends Element = Element>(type: string): ElementDefinition<T> | undefined;
  requireDefinition<T extends Element = Element>(type: string): ElementDefinition<T>;
  listDefinitions(): ElementDefinition[];
}
