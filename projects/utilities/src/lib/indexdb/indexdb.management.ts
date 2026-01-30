import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

interface PreferenciasDB {
  preferencias: {
    key: string;
    value: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<PreferenciasDB>>;

  constructor() {
    this.dbPromise = openDB<PreferenciasDB>('app_config', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('preferencias')) {
          db.createObjectStore('preferencias');
        }
      },
    });
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const db = await this.dbPromise;
    await db.put('preferencias', value, key);
  }

  async getItem<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    return (await db.get('preferencias', key)) as T | null;
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('preferencias', key);
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('preferencias');
  }
}
