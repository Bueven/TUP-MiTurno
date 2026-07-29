import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';

const STORAGE_KEY = 'items_data';
const STORAGE_EXP_KEY = 'items_data_exp';
const EXPIRATION_MINUTES = 5;

@Injectable({
  providedIn: 'root',
})
export class ItemsStorageService {
  getCachedItems(): Item[] | null {
    const exp = Number(localStorage.getItem(STORAGE_EXP_KEY));
    const cached = localStorage.getItem(STORAGE_KEY);

    if (!cached || !exp || Date.now() >= exp) {
      return null;
    }

    try {
      return JSON.parse(cached) as Item[];
    } catch {
      return null;
    }
  }

  saveItems(items: Item[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(STORAGE_EXP_KEY, (Date.now() + EXPIRATION_MINUTES * 60 * 1000).toString());
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXP_KEY);
  }
}
