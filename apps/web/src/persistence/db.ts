import Dexie, { Table } from 'dexie';
import { Document } from '@studio-hybrid/core';

export interface ProjectRecord {
  id: string;
  name: string;
  updatedAt: string;
  document: Document;
}

export interface AssetRecord {
  id: string;
  blob: Blob;
  mime: string;
  bytes: number;
  sha256: string;
  widthPx?: number;
  heightPx?: number;
  createdAt: string;
}

export class StudioHybridDB extends Dexie {
  projects!: Table<ProjectRecord, string>;
  assets!: Table<AssetRecord, string>;

  constructor(dbName = 'studio_hybrid_db') {
    super(dbName);
    this.version(1).stores({
      projects: 'id, name, updatedAt',
      assets: 'id, mime, createdAt',
    });
  }
}

export const db = new StudioHybridDB();
