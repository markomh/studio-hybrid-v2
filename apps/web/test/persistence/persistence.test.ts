import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { createDocument, Document } from '@studio-hybrid/core';
import {
  StudioHybridDB,
  saveDocument,
  loadDocument,
  AutosaveManager,
  exportBook,
  importBook,
  SaveStatus,
} from '../../src/persistence';

describe('Persistence & Honest Status (I-4, I-7, P-1)', () => {
  let testDb: StudioHybridDB;

  beforeEach(async () => {
    testDb = new StudioHybridDB(`test_db_${Date.now()}_${Math.random()}`);
    await testDb.open();
  });

  it('saves and loads identical document; invalid schema rejects write without overwriting existing data', async () => {
    const doc = createDocument('letter');
    doc.meta.name = 'Buku Awal Valid';

    // 1. Save valid doc
    await saveDocument(doc, testDb);
    const loaded = await loadDocument(doc.id, testDb);
    expect(loaded).toEqual(doc);

    // 2. Attempt to save corrupted/invalid doc (opacity > 1)
    const corruptedDoc = JSON.parse(JSON.stringify(doc)) as Document;
    corruptedDoc.meta.name = 'Buku Rusak';
    corruptedDoc.pages[0].elements.push({
      id: 'el-bad',
      type: 'text',
      x: 0,
      y: 0,
      w: 10,
      h: 10,
      rotation: 0,
      opacity: 2.5, // INVALID opacity > 1
      locked: false,
      hidden: false,
      text: 'Bad',
      fontFamily: 'sans',
      fontSizePt: 12,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#000',
    });

    await expect(saveDocument(corruptedDoc, testDb)).rejects.toThrow();

    // 3. Verify existing data was NOT overwritten
    const persistedAfterError = await loadDocument(doc.id, testDb);
    expect(persistedAfterError).toEqual(doc);
    expect(persistedAfterError?.meta.name).toBe('Buku Awal Valid');
  });

  it('transitions status: saving -> saved on success, and saving -> error on simulated failure', async () => {
    const statuses: SaveStatus[] = [];
    const doc = createDocument('letter');

    const autosave = new AutosaveManager({
      debounceMs: 50,
      customDb: testDb,
      onStatusChange: (s) => statuses.push(s),
    });

    expect(autosave.getStatus()).toBe('idle');

    // Trigger save
    const triggerPromise = autosave.trigger(doc);
    expect(autosave.getStatus()).toBe('saving');

    await triggerPromise;
    expect(autosave.getStatus()).toBe('saved');
    expect(statuses).toEqual(['saving', 'saved']);

    // Simulated failure
    const errorStatuses: SaveStatus[] = [];
    const failingAutosave = new AutosaveManager({
      debounceMs: 50,
      saveFn: async () => {
        throw new Error('Disk IO Failure');
      },
      onStatusChange: (s) => errorStatuses.push(s),
    });

    const failingPromise = failingAutosave.trigger(doc);
    expect(failingAutosave.getStatus()).toBe('saving');

    await expect(failingPromise).rejects.toThrow('Disk IO Failure');
    expect(failingAutosave.getStatus()).toBe('error');
    expect(errorStatuses).toEqual(['saving', 'error']);
  });

  it('exports and imports .shbook archive preserving identical document and assets', async () => {
    const doc = createDocument('letter');
    doc.meta.name = 'Buku dengan Aset';

    // Store dummy asset
    const assetBlob = new Blob(['sample-image-bytes'], { type: 'image/png' });
    await testDb.assets.put({
      id: 'asset-1',
      blob: assetBlob,
      mime: 'image/png',
      bytes: 18,
      sha256: 'abc123sha',
      createdAt: new Date().toISOString(),
    });

    await saveDocument(doc, testDb);

    // Export .shbook
    const bookZipBlob = await exportBook(doc, testDb);
    expect(bookZipBlob).toBeInstanceOf(Blob);

    // Import into fresh database
    const targetDb = new StudioHybridDB(`target_db_${Date.now()}`);
    await targetDb.open();

    const { document: importedDoc, assets: importedAssets } = await importBook(
      bookZipBlob,
      targetDb
    );

    expect(importedDoc).toEqual(doc);
    expect(importedAssets.length).toBe(1);
    expect(importedAssets[0].id).toBe('asset-1');
    expect(importedAssets[0].mime).toBe('image/png');

    const dbLoaded = await loadDocument(doc.id, targetDb);
    expect(dbLoaded).toEqual(doc);
  });

  it('debounces rapid changes resulting in exactly one write', async () => {
    const doc = createDocument('letter');
    const autosave = new AutosaveManager({
      debounceMs: 100,
      customDb: testDb,
    });

    // Rapid successive triggers
    autosave.trigger({ ...doc, meta: { ...doc.meta, name: 'V1' } });
    autosave.trigger({ ...doc, meta: { ...doc.meta, name: 'V2' } });
    const finalPromise = autosave.trigger({ ...doc, meta: { ...doc.meta, name: 'V3 Final' } });

    await finalPromise;

    expect(autosave.getWriteCount()).toBe(1);
    const loaded = await loadDocument(doc.id, testDb);
    expect(loaded?.meta.name).toBe('V3 Final');
  });
});
