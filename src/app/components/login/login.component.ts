import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);

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

      this.router.navigate(['/main']);
      this.isLoading = false;
    }, 2000);
  }
}
