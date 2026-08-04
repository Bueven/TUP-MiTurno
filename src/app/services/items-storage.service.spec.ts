import { TestBed } from '@angular/core/testing';

import { ItemsStorageService } from './items-storage.service';
import { Item } from '../models/item.model';

describe('ItemsStorageService', () => {
  let service: ItemsStorageService;

  const mockItems: Item[] = [
    {
      nombre: 'Clínica Test',
      direccion: 'Calle Falsa 123',
      horario: '9 a 18',
      telefono: '123456',
      descripcion: 'Descripción de prueba',
      web: 'https://example.com',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsStorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when there is no cached data', () => {
    expect(service.getCachedItems()).toBeNull();
  });

  it('should return the saved items while the cache has not expired', () => {
    service.saveItems(mockItems);
    expect(service.getCachedItems()).toEqual(mockItems);
  });

  it('should return null once the cache has expired', () => {
    service.saveItems(mockItems);
    localStorage.setItem('items_data_exp', (Date.now() - 1000).toString());
    expect(service.getCachedItems()).toBeNull();
  });

  it('should clear the cached items', () => {
    service.saveItems(mockItems);
    service.clear();
    expect(service.getCachedItems()).toBeNull();
  });
});
