import { Document, DocumentSchema } from './index';

export function migrate(doc: unknown): Document {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Dokumen tidak valid: harus berupa objek.');
  }

  const raw = doc as Record<string, unknown>;

  if (raw.schemaVersion === undefined || raw.schemaVersion === null) {
    throw new Error('Dokumen ditolak: properti schemaVersion tidak ditemukan.');
  }

  if (raw.schemaVersion !== 1) {
    throw new Error(`Migrasi untuk schemaVersion ${raw.schemaVersion} belum didukung.`);
  }

  // Validate and return schema version 1
  return DocumentSchema.parse(doc);
}
