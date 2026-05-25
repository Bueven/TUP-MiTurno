import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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

      this.router.navigate(['/main']);
      this.isLoading = false;
    }, 2000);
  }
}