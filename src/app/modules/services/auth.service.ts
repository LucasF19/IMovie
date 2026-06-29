import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

interface UserData {
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(
        email.trim(),
        password
      );
  
      await this.router.navigate(['/home']);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-credential':
          throw new Error('E-mail ou senha inválidos.');
  
        case 'auth/too-many-requests':
          throw new Error('Muitas tentativas de login. Tente novamente mais tarde.');
  
        case 'auth/network-request-failed':
          throw new Error('Verifique sua conexão com a internet.');
  
        default:
          console.error(error);
          throw new Error('Não foi possível realizar o login.');
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erro ao fazer logout: ', error);
    }
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  async registrarUsuario(
    email: string,
    senha: string,
    nome: string
  ): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        senha
      );
      const uid = userCredential.user?.uid;

      await this.firestore.collection('users').doc(uid).set({ nome, email });

      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);
    }
  }

  async getNomeUsuario(uid: string): Promise<string | null> {
    try {
      const doc = await this.firestore
        .collection('users')
        .doc(uid)
        .get()
        .toPromise();
      if (doc && doc.exists) {
        const data = doc.data() as UserData;
        return data.nome || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter nome do usuário:', error);
      return null;
    }
  }
}
