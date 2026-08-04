import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, TranslatePipe],
  templateUrl: './settigns.component.html',
  styleUrls: ['./settigns.component.css'],
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  userData = {
    name: '',
    email: '',
    phone: '(0221) 123-4567',
    profileImage: 'assets/images/fotoperfil.jpg',
    jobTitle: '',
  };

  appInfo = {
    name: 'Mi Turno Web',
    version: '1.0.0',
    userAgent: navigator.userAgent,
  };

  ngOnInit(): void {
    this.loadUserDataFromFirebase();
  }

  private loadUserDataFromFirebase(): void {
    this.authService.userProfile$.subscribe((user) => {
      if (!user) return;

      this.userData.name = user.name;
      this.userData.email = user.email;
      this.userData.profileImage = user.profileImage;
      this.userData.jobTitle = user.jobTitle;
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('CONFIRM_DIALOG.LOGOUT_TITLE'),
        message: this.translate.instant('CONFIRM_DIALOG.LOGOUT_MESSAGE'),
        confirmText: this.translate.instant('SETTINGS.LOGOUT'),
        cancelText: this.translate.instant('COMMON.CANCEL'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // La limpieza de sessionStorage y la navegacion las hace AppComponent
        // cuando Firebase emite que ya no hay usuario.
        this.authService.logout().catch((error) => {
          console.error('Error al cerrar sesión:', error);
        });
      }
    });
  }

  copyUserAgent(): void {
    navigator.clipboard.writeText(this.appInfo.userAgent).then(() => {
      alert(this.translate.instant('SETTINGS.COPIED_ALERT'));
    });
  }
}
