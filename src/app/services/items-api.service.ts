import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://tup-miturno-api.onrender.com/items';

  fetchItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }
}
