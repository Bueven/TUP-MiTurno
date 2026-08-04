import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../models/item.model';

interface OverpassTags {
  name?: string;
  'addr:street'?: string;
  address?: string;
  opening_hours?: string;
  phone?: string;
  description?: string;
  website?: string;
}

interface OverpassElement {
  tags?: OverpassTags;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

const NO_DATA = 'Sin información';

@Injectable({
  providedIn: 'root',
})
export class ItemsApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://overpass-api.de/api/interpreter';

  fetchItems(): Observable<Item[]> {
    const query = `
      [out:json][timeout:25];
      node["amenity"~"hospital|clinic"](-34.95,-58.00,-34.85,-57.90);
      out body geom;
    `;

    return this.http
      .post<OverpassResponse>(this.apiUrl, query, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .pipe(map((res) => this.mapOverpassToItems(res)));
  }

  private mapOverpassToItems(res: OverpassResponse): Item[] {
    if (!res?.elements) {
      return [];
    }

    return res.elements
      .filter((el) => el.tags?.name)
      .map((el) => ({
        nombre: el.tags?.name || NO_DATA,
        direccion: el.tags?.['addr:street'] || el.tags?.address || NO_DATA,
        horario: el.tags?.opening_hours || NO_DATA,
        telefono: el.tags?.phone || NO_DATA,
        descripcion: el.tags?.description || NO_DATA,
        web: el.tags?.website || NO_DATA,
      }));
  }
}
