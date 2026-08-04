import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ItemsComponent } from './items.component';
import { ItemsStoreService } from '../../services/items-store.service';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;

  beforeEach(async () => {
    const storeSpy = {
      getItems: vi.fn().mockReturnValue(of([])),
      filterItems: vi.fn((items: unknown[]) => items),
      sortItems: vi.fn((items: unknown[]) => items),
    };

    await TestBed.configureTestingModule({
      imports: [ItemsComponent],
      providers: [provideTranslateService(), { provide: ItemsStoreService, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
