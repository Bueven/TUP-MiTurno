
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, skip, filter } from 'rxjs/operators';

interface SessionUser {
  uid: string;
  name: string;
  email: string;
  profileImage: string;
  jobTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private router = inject(Router);

  public user$ = user(this.auth);

  public userProfile$ = this.user$.pipe(
    map(firebaseUser => {
      if (!firebaseUser) return null;
      return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? 'Usuario',
        email: firebaseUser.email ?? '',
        profileImage: firebaseUser.photoURL ?? 'assets/images/fotoperfil.jpg',
        jobTitle: 'Recepcionista'
      } as SessionUser;
    })
  );

  constructor() {
    // Cuando user$ emite null (sesión cerrada), redirigir a /login
    this.user$.pipe(
      skip(1), // saltar la emisión inicial de Firebase al arrancar
      filter(u => u === null)
    ).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
  }
}