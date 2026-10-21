import { describe, it, expect } from 'vitest';
import { listDefinitions } from '@studio-hybrid/core';
import { t } from '../src/i18n';

describe('Registry i18n Dictionary Parity (F2-6a)', () => {
  it('ensures every labelKey and descriptionKey across all element definitions exists in the i18n dictionary', () => {
    const definitions = listDefinitions();
    expect(definitions.length).toBeGreaterThan(0);

    for (const def of definitions) {
      // 1. Definition labelKey
      expect(def.labelKey).toBeDefined();
      const defLabel = t(def.labelKey);
      expect(defLabel).not.toBe(def.labelKey);
      expect(typeof defLabel).toBe('string');
      expect(defLabel.length).toBeGreaterThan(0);

      // 2. Property schema fields
      for (const field of def.propertySchema) {
        expect(field.labelKey).toBeDefined();
        const fieldLabel = t(field.labelKey);
        expect(fieldLabel).not.toBe(field.labelKey);
        expect(typeof fieldLabel).toBe('string');
        expect(fieldLabel.length).toBeGreaterThan(0);

        if (field.options) {
          for (const opt of field.options) {
            expect(opt.labelKey).toBeDefined();
            const optLabel = t(opt.labelKey);
            expect(optLabel).not.toBe(opt.labelKey);
            expect(typeof optLabel).toBe('string');
            expect(optLabel.length).toBeGreaterThan(0);
          }
        }
      }

      // 3. Palette entries
      for (const entry of def.palette) {
        expect(entry.labelKey).toBeDefined();
        const entryLabel = t(entry.labelKey);
        expect(entryLabel).not.toBe(entry.labelKey);
        expect(typeof entryLabel).toBe('string');
        expect(entryLabel.length).toBeGreaterThan(0);

        expect(entry.descriptionKey).toBeDefined();
        const entryDesc = t(entry.descriptionKey);
        expect(entryDesc).not.toBe(entry.descriptionKey);
        expect(typeof entryDesc).toBe('string');
        expect(entryDesc.length).toBeGreaterThan(0);
      }
    }
  });
});
