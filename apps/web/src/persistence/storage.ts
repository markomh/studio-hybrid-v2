import { Document, DocumentSchema } from '@studio-hybrid/core';
import { db, StudioHybridDB } from './db';

export async function saveDocument(doc: Document, customDb?: StudioHybridDB): Promise<void> {
  // I-7: Validate document against Zod schema first.
  // If invalid, throws immediately and NEVER corrupts or overwrites existing data!
  const validated = DocumentSchema.parse(doc);

  const database = customDb || db;
  const now = new Date().toISOString();

  await database.projects.put({
    id: validated.id,
    name: validated.meta.name,
    updatedAt: now,
    document: validated,
  });
}

export async function loadDocument(id: string, customDb?: StudioHybridDB): Promise<Document | null> {
  const database = customDb || db;
  const record = await database.projects.get(id);
  if (!record) return null;

  // Validate loaded data
  return DocumentSchema.parse(record.document);
}

export async function listProjects(
  customDb?: StudioHybridDB
): Promise<Array<{ id: string; name: string; updatedAt: string }>> {
  const database = customDb || db;
  const all = await database.projects.toArray();
  return all
    .map((p) => ({
      id: p.id,
      name: p.name,
      updatedAt: p.updatedAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      return await navigator.storage.persist();
    } catch {
      return false;
    }
  }
  return false;
}
