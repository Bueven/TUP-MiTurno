import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private analytics = inject(AnalyticsService);

  isLoading = false;

  login(): void {
    if (this.isLoading) return;

    this.isLoading = true;

    setTimeout(() => {
      const fakeUser = {
        id: 'user-123',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        loginAt: new Date().getTime(),
        jobTitle: 'Recepcionista',
      };

      sessionStorage.setItem('session', JSON.stringify(fakeUser));

      this.analytics.trackLogin(fakeUser.email);

      Sentry.setUser({ email: fakeUser.email });

      this.router.navigate(['/main']);
      this.isLoading = false;

      setTimeout(() => {
        throw new Error(
          `No se pudo sincronizar el perfil del usuario tras el login - usuario: ${fakeUser.email}`,
        );
      });
    }, 2000);
  }
}
