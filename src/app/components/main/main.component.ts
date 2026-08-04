import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ItemsComponent } from '../items/items.component';
import { SettingsComponent } from '../settigns/settigns.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth';

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
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  private translate = inject(TranslateService);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  currentView: 'items' | 'settings' = 'items';
  userInfo: UsuarioSistema | null = null;

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
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: this.translate.instant('CONFIRM_DIALOG.LOGOUT_TITLE'),
          message: this.translate.instant('CONFIRM_DIALOG.LOGOUT_MESSAGE'),
          confirmText: this.translate.instant('MAIN.LOGOUT'),
          cancelText: this.translate.instant('COMMON.CANCEL'),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // La limpieza de sessionStorage y la navegacion las hace AppComponent
          // cuando Firebase emite que ya no hay usuario.
          this.authService.logout().catch((error) => {
            console.error('Error al cerrar sesión:', error);
          });
        }
      });
  }
}
