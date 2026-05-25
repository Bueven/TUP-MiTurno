import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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

  // Información de la aplicación
  appInfo = {
    name: 'Mi Turno Web',
    version: '1.0.0',
    userAgent: navigator.userAgent
  };

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserDataFromSession();
  }

  // Cargar información del usuario desde sessionStorage
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
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas cerrar sesión?',
        confirmText: 'Cerrar Sesión',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Limpiar sesión del sessionStorage
        sessionStorage.removeItem('userSession');
        sessionStorage.removeItem('items');
        sessionStorage.removeItem('itemsTimestamp');
        
        // Navegar al login
        this.router.navigate(['/login']);
      }
    });
  }

  // Método para copiar User Agent al portapapeles
  copyUserAgent(): void {
    navigator.clipboard.writeText(this.appInfo.userAgent).then(() => {
      alert('User Agent copiado al portapapeles');
    });
  }
}