import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemsComponent } from '../items/items.component';
import { SettingsComponent } from '../settigns/settigns.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface UsuarioSistema {
  id: string;
  name: string;
  email: string;
  loginAt: number;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    ItemsComponent,
    SettingsComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  
  isHandset$!: Observable<boolean>;
    

  
  currentView: 'items' | 'settings' = 'items';
  userInfo: UsuarioSistema | null = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches)
      );
    
    }

  ngOnInit(): void {
    const session = sessionStorage.getItem('session');
    if (session) {
      this.userInfo = JSON.parse(session);
    }
  }

  
  navigateTo(view: 'items' | 'settings'): void {
    this.currentView = view;
  }

  logout(): void {
  this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar'
    }
  }).afterClosed().subscribe(result => {
    if (result) {
      sessionStorage.removeItem('session');
      sessionStorage.removeItem('items');
      sessionStorage.removeItem('itemsTimestamp');
      this.router.navigate(['/login']);
    }
  });
}
}