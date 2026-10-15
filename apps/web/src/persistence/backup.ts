import JSZip from 'jszip';
import { Document, DocumentSchema } from '@studio-hybrid/core';
import { db, StudioHybridDB, AssetRecord } from './db';
import { saveDocument } from './storage';

export async function exportBook(doc: Document, customDb?: StudioHybridDB): Promise<Blob> {
  const validated = DocumentSchema.parse(doc);
  const database = customDb || db;

  const zip = new JSZip();
  zip.file('document.json', JSON.stringify(validated, null, 2));

  const assetsFolder = zip.folder('assets');
  if (assetsFolder) {
    const assets = await database.assets.toArray();
    for (const asset of assets) {
      assetsFolder.file(asset.id, asset.blob);
      assetsFolder.file(
        `${asset.id}.meta.json`,
        JSON.stringify({
          id: asset.id,
          mime: asset.mime,
          bytes: asset.bytes,
          sha256: asset.sha256,
          widthPx: asset.widthPx,
          heightPx: asset.heightPx,
          createdAt: asset.createdAt,
        })
      );
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export async function importBook(
  data: Blob | ArrayBuffer,
  customDb?: StudioHybridDB
): Promise<{ document: Document; assets: AssetRecord[] }> {
  const database = customDb || db;
  const zip = await JSZip.loadAsync(data);

  const docFile = zip.file('document.json');
  if (!docFile) {
    throw new Error('Berkas .shbook tidak valid: document.json tidak ditemukan.');
  }

  const docJsonText = await docFile.async('text');
  const parsedDoc = JSON.parse(docJsonText);
  const validatedDoc = DocumentSchema.parse(parsedDoc);

  const restoredAssets: AssetRecord[] = [];
  const assetsFolder = zip.folder('assets');
  if (assetsFolder) {
    const metaFiles = assetsFolder.file(/\.meta\.json$/);
    for (const metaFile of metaFiles) {
      const metaText = await metaFile.async('text');
      const meta = JSON.parse(metaText);
      const blobFile = assetsFolder.file(meta.id);
      if (blobFile) {
        const arrayBuffer = await blobFile.async('arraybuffer');
        const blob = new Blob([arrayBuffer], { type: meta.mime });
        const record: AssetRecord = {
          ...meta,
          blob,
        };
        restoredAssets.push(record);
        await database.assets.put(record);
      }
    }
  }

  await saveDocument(validatedDoc, database);

  return {
    document: validatedDoc,
    assets: restoredAssets,
  };
}
