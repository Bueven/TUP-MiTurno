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

  it('should fetch items from the REST API', async () => {
    const result = firstValueFrom(service.fetchItems());

    const req = httpMock.expectOne('https://tup-miturno-api.onrender.com/items');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: '1',
        nombre: 'Clínica Test',
        direccion: 'Calle Falsa 123',
        horario: 'Sin información',
        telefono: 'Sin información',
        descripcion: 'Sin información',
        web: 'Sin información',
        activo: true,
      },
    ]);

    expect(await result).toEqual([
      {
        id: '1',
        nombre: 'Clínica Test',
        direccion: 'Calle Falsa 123',
        horario: 'Sin información',
        telefono: 'Sin información',
        descripcion: 'Sin información',
        web: 'Sin información',
        activo: true,
      },
    ]);
  });
});
