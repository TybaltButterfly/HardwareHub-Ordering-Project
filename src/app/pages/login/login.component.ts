import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  identifier = '';
  password = '';

  identifierError = '';
  passwordError = '';
  loginError = '';

  showPassword = false;

  constructor(private router: Router, private userService: UserService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.identifierError = '';
    this.passwordError = '';
    this.loginError = '';

    if (!this.identifier) {
      this.identifierError = 'Please enter your username or email.';
    }
    if (!this.password) {
      this.passwordError = 'Please enter your password.';
    }
    if (this.identifierError || this.passwordError) {
      return;
    }

    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user exists with matching identifier and password
    const user = users.find((user: any) =>
      (user.username === this.identifier || user.email === this.identifier) &&
      user.password === this.password
    );

    if (user) {
      // Clear errors on success
      this.identifierError = '';
      this.passwordError = '';
      this.loginError = '';
    
      // Set currentUser in localStorage for display in home component
      localStorage.setItem('currentUser', JSON.stringify({
        name: user.username,
        email: user.email
      }));

      // Update userService with new user info
      this.userService.updateUser({
        name: user.username,
        email: user.email
      });
    
      this.router.navigate(['/home']);
    } else {
      this.loginError = 'Invalid login credentials.';
    }
  }    

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  forgotPassword() {
    alert('Forgot password functionality is not implemented yet.');
  }
}
