 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Item {
  nombre: string;
  direccion: string;
  horario: string;
  telefono: string;
  descripcion: string;
  web: string;
}

const LOCAL_STORAGE_KEY = 'items_data';
const LOCAL_STORAGE_EXP = 'items_data_exp';
const EXPIRATION_MINUTES = 5;

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private apiUrl = 'https://overpass-api.de/api/interpreter';


  constructor(private http: HttpClient) {}

  getItems(forceRefresh: boolean = false): Observable<Item[]> {
    const now = Date.now();
    const exp = Number(localStorage.getItem(LOCAL_STORAGE_EXP));
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (!forceRefresh && cached && exp && now < exp) {
      try {
        console.log('📦 Usando cache local');
        return of(JSON.parse(cached));
      } catch (e) {
        console.warn('⚠️ Error al parsear cache:', e);
      }
    }

    const query = `
      [out:json][timeout:25];
      node["amenity"~"hospital|clinic"](-34.95,-58.00,-34.85,-57.90);
      out body geom;
    `;
    
    console.log('🔄 Realizando solicitud a:', this.apiUrl);
    
    return this.http.post<any>(this.apiUrl, query, { 
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'json' as any
    }).pipe(
      map(res => {
        console.log('✅ Respuesta recibida de API:', res);
        return this.mapOverpassToItems(res);
      }),
      tap(items => {
        if (items.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
          localStorage.setItem(LOCAL_STORAGE_EXP, (now + EXPIRATION_MINUTES * 60 * 1000).toString());
          console.log('✅ Items guardados en cache:', items.length);
        } else {
          console.warn('⚠️ No se encontraron items en la respuesta');
        }
      }),
      catchError(err => {
        console.error('❌ ERROR al obtener items:');
        console.error('   Status HTTP:', err?.status);
        console.error('   Mensaje:', err?.error || err?.message);
        console.error('   URL solicitada:', this.apiUrl);
        console.error('   Error completo:', err);
        return throwError(() => new Error('No se pudieron obtener los items.'));
      })
    );
  }

  private mapOverpassToItems(res: any): Item[] {
    if (!res || !res.elements) {
      console.warn('⚠️ Respuesta sin elementos:', res);
      return [];
    }

    const items = res.elements
      .filter((el: any) => el.tags?.name)
      .map((el: any) => ({
        nombre: el.tags?.name || 'Sin información',
        direccion: el.tags?.['addr:street'] || el.tags?.address || 'Sin información',
        horario: el.tags?.opening_hours || 'Sin información',
        telefono: el.tags?.phone || 'Sin información',
        descripcion: el.tags?.description || 'Sin información',
        web: el.tags?.website || 'Sin información',
      }));

    console.log(`✅ Se mapearon ${items.length} items`);
    return items;
  }

  filterItems(items: Item[], search: string): Item[] {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(item =>
      item.nombre.toLowerCase().includes(s) ||
      item.direccion.toLowerCase().includes(s) ||
      item.descripcion.toLowerCase().includes(s)
    );
  }

  sortItems(items: Item[], prop: keyof Item, asc: boolean = true): Item[] {
    return [...items].sort((a, b) => {
      const v1 = (a[prop] || '').toLowerCase();
      const v2 = (b[prop] || '').toLowerCase();
      if (v1 < v2) return asc ? -1 : 1;
      if (v1 > v2) return asc ? 1 : -1;
      return 0;
    });
  }
}