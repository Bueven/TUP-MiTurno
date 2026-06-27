import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './settigns.component.html',
  styleUrls: ['./settigns.component.css']
})
export class SettingsComponent implements OnInit {

  userData = {
    name: '',
    email: '',
    phone: '(0221) 123-4567',
    profileImage: 'assets/images/fotoperfil.jpg',
    jobTitle: ''
  };

  appInfo = {
    name: 'Mi Turno Web',
    version: '1.0.0',
    userAgent: navigator.userAgent
  };

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserDataFromFirebase();
  }

  
  private loadUserDataFromFirebase(): void {
    this.authService.userProfile$.subscribe(user => {
      if (!user) return;
      this.userData.name = user.name;
      this.userData.email = user.email;
      this.userData.jobTitle = user.jobTitle;
      this.cdr.detectChanges();
      
    });
  }

  
  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas cerrar sesión?',
        confirmText: 'Cerrar Sesión',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  
  copyUserAgent(): void {
    navigator.clipboard.writeText(this.appInfo.userAgent).then(() => {
      alert('User Agent copiado al portapapeles');
    });
  }
}