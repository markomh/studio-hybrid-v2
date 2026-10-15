import { Document } from '@studio-hybrid/core';
import { saveDocument } from './storage';
import { StudioHybridDB } from './db';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutosaveOptions {
  debounceMs?: number;
  customDb?: StudioHybridDB;
  onStatusChange?: (status: SaveStatus) => void;
  saveFn?: (doc: Document) => Promise<void>;
}

export class AutosaveManager {
  private status: SaveStatus = 'idle';
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingDoc: Document | null = null;
  private listeners: Set<(status: SaveStatus) => void> = new Set();
  private debounceMs: number;
  private saveFn: (doc: Document) => Promise<void>;
  private writeCount = 0;

  constructor(options: AutosaveOptions = {}) {
    this.debounceMs = options.debounceMs ?? 800;
    this.saveFn = options.saveFn ?? ((doc) => saveDocument(doc, options.customDb));
    if (options.onStatusChange) {
      this.listeners.add(options.onStatusChange);
    }
  }

  public getStatus(): SaveStatus {
    return this.status;
  }

  public getWriteCount(): number {
    return this.writeCount;
  }

  public subscribe(cb: (status: SaveStatus) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private setStatus(newStatus: SaveStatus) {
    this.status = newStatus;
    for (const listener of this.listeners) {
      listener(this.status);
    }
  }

  public trigger(doc: Document): Promise<void> {
    this.pendingDoc = doc;
    this.setStatus('saving');

    if (this.timer) {
      clearTimeout(this.timer);
    }

    return new Promise<void>((resolve, reject) => {
      this.timer = setTimeout(async () => {
        const docToSave = this.pendingDoc;
        if (!docToSave) {
          resolve();
          return;
        }

        try {
          await this.saveFn(docToSave);
          this.writeCount++;
          this.setStatus('saved');
          resolve();
        } catch (err) {
          this.setStatus('error');
          reject(err);
        }
      }, this.debounceMs);
    });
  }

  public async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.pendingDoc) {
      const doc = this.pendingDoc;
      this.pendingDoc = null;
      try {
        await this.saveFn(doc);
        this.writeCount++;
        this.setStatus('saved');
      } catch (err) {
        this.setStatus('error');
        throw err;
      }
    }
  }

  public cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pendingDoc = null;
    this.setStatus('idle');
  }
}
