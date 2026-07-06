import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { skip } from 'rxjs/operators';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'mi-turno-web';

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.authService.user$.pipe(
      skip(1) // saltar la emisión inicial de Firebase al arrancar
    ).subscribe(user => {
      if (user) {
        this.router.navigate(['/main']);
      } else {
        sessionStorage.removeItem('session');
        sessionStorage.removeItem('items');
        sessionStorage.removeItem('itemsTimestamp');
        this.router.navigate(['/login']);
      }
    });
  }
}
