/**
 * IndexedDB helper for persisting generated sounds on the user's device.
 */

export interface SavedSound {
  id: string;
  prompt: string;
  createdAt: number; // timestamp ms
  durationSec: number;
  guidanceScale: number;
  blob: Blob;
}

const DB_NAME = "yousound";
const DB_VERSION = 1;
const STORE_NAME = "sounds";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSound(sound: SavedSound): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(sound);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllSounds(): Promise<SavedSound[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => {
      // Sort newest first
      const results = (request.result as SavedSound[]).sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSound(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
