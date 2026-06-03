
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

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

  constructor() { }

  
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
  try {
    await signOut(this.auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}
}