import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ItemsService, Item } from '../../services/items.service';
import { AnalyticsService } from '../../services/analytics.service';

type SortField = 'nombre' | 'direccion' | 'telefono' | 'none';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  filteredItems: Item[] = [];

  loading = true;
  error: string | null = null;

  searchTerm = '';
  sortField: SortField = 'none';
  sortOrder: SortOrder = 'asc';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  
  sortOptions = [
    { value: 'none', label: 'Sin ordenar' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'direccion', label: 'Dirección' },
    { value: 'telefono', label: 'Teléfono' },
  ];

  constructor(
    private itemsService: ItemsService,
    private cdr: ChangeDetectorRef,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadItems();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        if (searchTerm.trim()) {
          this.analytics.trackSearch(searchTerm);
        }
        this.applyFiltersAndSort();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadItems(): void {
    this.loading = true;
    this.error = null;

    this.itemsService
      .getItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Item[]) => {
          this.items = data;
          this.applyFiltersAndSort();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar items:', err);
          this.error =
            'No se pudieron cargar los items. Por favor, intenta más tarde.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  
  private applyFiltersAndSort(): void {
   
    let result = this.itemsService.filterItems(this.items, this.searchTerm);

   
    result = this.sortItems(result);

    this.filteredItems = result;
  }


  private sortItems(items: Item[]): Item[] {
    if (this.sortField === 'none') {
      return items;
    }

    return this.itemsService.sortItems(
      items,
      this.sortField as keyof Item,
      this.sortOrder === 'asc'
    );
  }

  onSearchChange(event: any): void {
    const value = event?.target?.value || '';
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFiltersAndSort();
  }


  onSortFieldChange(field: SortField): void {
    if (this.sortField === field) {
     
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSort();
  }

  
  refreshItems(): void {
    this.analytics.trackRefresh();
    this.itemsService
      .getItems(true) 
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Item[]) => {
          this.items = data;
          this.searchTerm = '';
          this.sortField = 'none';
          this.sortOrder = 'asc';
          this.error = null;
          this.applyFiltersAndSort();
        },
        error: (err) => {
          console.error('Error al recargar items:', err);
          this.error =
            'No se pudieron recargar los items. Por favor, intenta más tarde.';
        },
      });
  }
}