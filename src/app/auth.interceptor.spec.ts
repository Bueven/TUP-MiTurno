import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from '@angular/fire/auth';
import { vi } from 'vitest';

import { authInterceptor } from './auth.interceptor';
import { API_BASE_URL } from './api.config';

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authStub: { currentUser: { getIdToken: ReturnType<typeof vi.fn> } | null };

  beforeEach(() => {
    authStub = { currentUser: { getIdToken: vi.fn().mockResolvedValue('fake-token') } };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: authStub },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds the Authorization header for requests to the API', async () => {
    http.get(`${API_BASE_URL}/items`).subscribe();
    await flushMicrotasks();

    const req = httpMock.expectOne(`${API_BASE_URL}/items`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush([]);
  });

  it('does not add the header for requests to other origins', () => {
    http.get('https://other-domain.com/data').subscribe();

    const req = httpMock.expectOne('https://other-domain.com/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('does not add the header when there is no logged in user', () => {
    authStub.currentUser = null;

    http.get(`${API_BASE_URL}/items`).subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/items`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
