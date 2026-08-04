import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, TranslatePipe],
  templateUrl: './settigns.component.html',
  styleUrls: ['./settigns.component.css'],
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

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
    this.loadUserDataFromSession();
  }

  private loadUserDataFromSession(): void {
    const sessionData = sessionStorage.getItem('session');
    if (sessionData) {
      const user = JSON.parse(sessionData);
      this.userData.name = user.name;
      this.userData.email = user.email;
      this.userData.jobTitle = user.jobTitle;
    }
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
        sessionStorage.removeItem('userSession');
        sessionStorage.removeItem('items');
        sessionStorage.removeItem('itemsTimestamp');

        this.router.navigate(['/login']);
      }
    });
  }

  copyUserAgent(): void {
    navigator.clipboard.writeText(this.appInfo.userAgent).then(() => {
      alert(this.translate.instant('SETTINGS.COPIED_ALERT'));
    });
  }
}
