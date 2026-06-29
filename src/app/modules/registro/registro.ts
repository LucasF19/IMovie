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
      this.errorMessage = 'Erro ao criar conta. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}