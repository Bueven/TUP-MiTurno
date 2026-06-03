import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { take } from 'rxjs/operators';

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
  private router = inject(Router);

  isLoading = false;
constructor() {
  

  this.authService.user$.subscribe(user => {
    

    if (user) {
      
      this.router.navigate(['/main']);
    }
  });
}


login() {
  if (this.isLoading) return;

  this.isLoading = true;


  this.authService.loginWithGoogle().catch(error => {
   
    this.isLoading = false;
  });
}
}