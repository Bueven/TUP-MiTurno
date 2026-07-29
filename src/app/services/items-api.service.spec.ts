import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ItemsApiService } from './items-api.service';

describe('ItemsApiService', () => {
  let service: ItemsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ItemsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map the Overpass response into items', async () => {
    const result = firstValueFrom(service.fetchItems());

    const req = httpMock.expectOne('https://overpass-api.de/api/interpreter');
    expect(req.request.method).toBe('POST');
    req.flush({
      elements: [{ tags: { name: 'Clínica Test', 'addr:street': 'Calle Falsa 123' } }],
    });

    expect(await result).toEqual([
      {
        nombre: 'Clínica Test',
        direccion: 'Calle Falsa 123',
        horario: 'Sin información',
        telefono: 'Sin información',
        descripcion: 'Sin información',
        web: 'Sin información',
      },
    ]);
  });

  it('should ignore elements without a name', async () => {
    const result = firstValueFrom(service.fetchItems());

    const req = httpMock.expectOne('https://overpass-api.de/api/interpreter');
    req.flush({ elements: [{ tags: {} }] });

    expect(await result).toEqual([]);
  });
});
