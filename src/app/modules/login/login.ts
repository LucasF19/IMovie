import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  showPassword = false;
  isLoading = false;

  constructor(private authService: AuthService) {}

  async login() {
    this.errorMessage = null;
    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.errorMessage = 'Email ou senha incorretos. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}