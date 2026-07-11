import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'mi-turno-web';

  private readonly swUpdate = inject(SwUpdate);

  constructor() {
    
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm('Hay una nueva versión disponible. ¿Deseás actualizar?')) {
            document.location.reload();
          }
        });
    }
  }
}