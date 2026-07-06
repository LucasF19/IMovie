import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.html',
  styleUrls: ['registro.scss'],
})
export class RegistroPage {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  errorMessage: string | null = null;
  isLoading = false;
  showSenha = false;
  showConfirmar = false;

  constructor(private authService: AuthService) {}

  async registrarUsuario(registroForm: NgForm) {
    if (registroForm.invalid || this.senha !== this.confirmarSenha) return;
  
    this.errorMessage = null;
    this.isLoading = true;
  
    try {
      await this.authService.registrarUsuario(this.email, this.senha, this.nome);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  getErrorMessage(code: string): string {
    const errors: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
      'auth/invalid-email':        'E-mail inválido. Verifique e tente novamente.',
      'auth/weak-password':        'Senha fraca. Use pelo menos 6 caracteres.',
      'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
    };
  
    return errors[code] ?? 'Erro ao criar conta. Tente novamente.';
  }
}