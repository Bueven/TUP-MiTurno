import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as Sentry from '@sentry/angular';
import { AuthService } from '../../services/auth';
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
  private authService = inject(AuthService);
  private analytics = inject(AnalyticsService);

  isLoading = false;

  login() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.loginWithGoogle()
      .then(result => {
        const email = result.user.email ?? '';

        this.analytics.trackLogin(email);
        Sentry.setUser({ email });

        this.isLoading = false;

        setTimeout(() => {
          throw new Error(`No se pudo sincronizar el perfil del usuario tras el login - usuario: ${email}`);
        });
      })
      .catch(error => {
        this.isLoading = false;
      });
  }
}