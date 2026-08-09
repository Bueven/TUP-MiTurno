import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';

import { ItemsStoreService } from './items-store.service';
import { ItemsApiService } from './items-api.service';
import { ItemsStorageService } from './items-storage.service';
import { Item } from '../models/item.model';

describe('ItemsStoreService', () => {
  let service: ItemsStoreService;
  let apiSpy: { fetchItems: ReturnType<typeof vi.fn> };
  let storageSpy: {
    getCachedItems: ReturnType<typeof vi.fn>;
    saveItems: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  const apiItems: Item[] = [
    {
      id: '2',
      nombre: 'B',
      direccion: 'x',
      horario: 'x',
      telefono: 'x',
      descripcion: 'x',
      web: 'x',
      activo: true,
    },
  ];
  const cachedItems: Item[] = [
    {
      id: '1',
      nombre: 'A',
      direccion: 'x',
      horario: 'x',
      telefono: 'x',
      descripcion: 'x',
      web: 'x',
      activo: true,
    },
  ];

  beforeEach(() => {
    apiSpy = { fetchItems: vi.fn() };
    storageSpy = { getCachedItems: vi.fn(), saveItems: vi.fn(), clear: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ItemsApiService, useValue: apiSpy },
        { provide: ItemsStorageService, useValue: storageSpy },
      ],
    });
    service = TestBed.inject(ItemsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return cached items without calling the API when the cache is valid', async () => {
    storageSpy.getCachedItems.mockReturnValue(cachedItems);

    const items = await firstValueFrom(service.getItems());

    expect(items).toEqual(cachedItems);
    expect(apiSpy.fetchItems).not.toHaveBeenCalled();
  });

  it('should fetch from the API and persist the result when there is no cache', async () => {
    storageSpy.getCachedItems.mockReturnValue(null);
    apiSpy.fetchItems.mockReturnValue(of(apiItems));

    const items = await firstValueFrom(service.getItems());

    expect(items).toEqual(apiItems);
    expect(storageSpy.saveItems).toHaveBeenCalledWith(apiItems);
  });

  it('should call the API and skip the cache when forceRefresh is true', async () => {
    apiSpy.fetchItems.mockReturnValue(of(apiItems));

    await firstValueFrom(service.getItems(true));

    expect(storageSpy.getCachedItems).not.toHaveBeenCalled();
    expect(apiSpy.fetchItems).toHaveBeenCalled();
  });

  it('should filter out inactive items returned by the API', async () => {
    storageSpy.getCachedItems.mockReturnValue(null);
    apiSpy.fetchItems.mockReturnValue(
      of([...apiItems, { ...apiItems[0], id: '3', activo: false }]),
    );

    const items = await firstValueFrom(service.getItems());

    expect(items).toEqual(apiItems);
  });

  it('should filter items by name, address or description', () => {
    const items: Item[] = [
      {
        id: '1',
        nombre: 'Hospital Central',
        direccion: 'Av. Siempre Viva',
        horario: '',
        telefono: '',
        descripcion: '',
        web: '',
        activo: true,
      },
      {
        id: '2',
        nombre: 'Clínica Norte',
        direccion: 'Calle Falsa',
        horario: '',
        telefono: '',
        descripcion: '',
        web: '',
        activo: true,
      },
    ];

    expect(service.filterItems(items, 'hospital').length).toBe(1);
    expect(service.filterItems(items, '').length).toBe(2);
  });

  it('should sort items ascending and descending', () => {
    const items: Item[] = [
      {
        id: '1',
        nombre: 'B',
        direccion: '',
        horario: '',
        telefono: '',
        descripcion: '',
        web: '',
        activo: true,
      },
      {
        id: '2',
        nombre: 'A',
        direccion: '',
        horario: '',
        telefono: '',
        descripcion: '',
        web: '',
        activo: true,
      },
    ];

    expect(service.sortItems(items, 'nombre', true).map((i) => i.nombre)).toEqual(['A', 'B']);
    expect(service.sortItems(items, 'nombre', false).map((i) => i.nombre)).toEqual(['B', 'A']);
  });
});
