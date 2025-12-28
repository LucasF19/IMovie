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
    if(email === 'admin@admin.com' && password === '123123') {
      this.router.navigate(['/home']);
    } else {
      throw new Error('Email ou senha inválidos.');
    }
    // try {
    //   await this.afAuth.signInWithEmailAndPassword(email, password);
    //   this.router.navigate(['/home']);
    // } catch (error) {
    //   console.error('Erro ao fazer login: ', error);
    //   throw new Error('Email ou senha inválidos.');
    // }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
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
