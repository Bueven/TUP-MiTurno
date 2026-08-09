import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Item } from '../models/item.model';
import { ItemsApiService } from './items-api.service';
import { ItemsStorageService } from './items-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ItemsStoreService {
  private api = inject(ItemsApiService);
  private storage = inject(ItemsStorageService);

  getItems(forceRefresh = false): Observable<Item[]> {
    if (!forceRefresh) {
      const cached = this.storage.getCachedItems();
      if (cached) {
        return of(cached);
      }
    }

    return this.api.fetchItems().pipe(
      map((items) => items.filter((item) => item.activo)),
      tap((items) => {
        if (items.length > 0) {
          this.storage.saveItems(items);
        }
      }),
    );
  }

  filterItems(items: Item[], search: string): Item[] {
    if (!search) return items;
    const term = search.toLowerCase();
    return items.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.direccion.toLowerCase().includes(term) ||
        item.descripcion.toLowerCase().includes(term),
    );
  }

  sortItems(items: Item[], prop: keyof Item, ascending = true): Item[] {
    return [...items].sort((a, b) => {
      const v1 = String(a[prop] ?? '').toLowerCase();
      const v2 = String(b[prop] ?? '').toLowerCase();
      if (v1 < v2) return ascending ? -1 : 1;
      if (v1 > v2) return ascending ? 1 : -1;
      return 0;
    });
  }
}
