import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="fa fa-times close-icon" (click)="close()"></div>
          <img src="assets/toolbox.png" alt="Toolbox" class="login-image" />
          <h2 class="welcome-text">Admin Login</h2>
        <form (ngSubmit)="login()" #loginForm="ngForm" novalidate>
          <div class="input-group">
            <label for="email">Email:</label>
            <i class="fa-solid fa-user input-icon"></i>
            <input type="email" id="email" required [(ngModel)]="email" name="email" placeholder="Enter your email" />
          </div>
          <div class="input-group">
            <label for="password">Password:</label>
            <i class="fa-solid fa-lock input-icon"></i>
            <input [type]="showPassword ? 'text' : 'password'" id="password" required [(ngModel)]="password" name="password" placeholder="Enter your password" />
            <i class="fa-solid fa-eye toggle-password" [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'" (click)="togglePasswordVisibility()" style="cursor:pointer;"></i>
          </div>
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <button type="submit" class="login-btn" [disabled]="!loginForm.form.valid || loading">Login</button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMessage = '';
    this.loading = true;
    try {
      const success = this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.router.navigate(['/']);
  }
}
