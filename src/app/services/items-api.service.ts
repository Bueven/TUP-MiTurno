import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class ItemsApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/items`;

  fetchItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }
}
