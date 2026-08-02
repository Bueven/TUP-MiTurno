import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private router: Router,
    private analytics: AnalyticsService
  ) {}

  login(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    console.log('⏳ Iniciando sesión...');

    setTimeout(() => {
      const fakeUser = {
        id: 'user-123',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        loginAt: new Date().getTime(),
        jobTitle: 'Recepcionista'
      };

      sessionStorage.setItem('session', JSON.stringify(fakeUser));
      console.log('✅ Sesión guardada');

      this.analytics.trackLogin(fakeUser.email);

      Sentry.setUser({ email: fakeUser.email });

      this.router.navigate(['/main']);
      this.isLoading = false;

      
      setTimeout(() => {
        throw new Error(`No se pudo sincronizar el perfil del usuario tras el login - usuario: ${fakeUser.email}`);
      });
    }, 2000);
  }
}