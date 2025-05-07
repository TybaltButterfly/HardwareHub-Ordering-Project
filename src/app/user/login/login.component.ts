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

  closeLogin() {
    this.router.navigate(['']);
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
    console.log('Users from localStorage:', users);

    const identifierLower = this.identifier.toLowerCase();

    // Find user by username or email (case-insensitive)
    const userByIdentifier = users.find((user: any) =>
      (user.username && user.username.toLowerCase() === identifierLower) ||
      (user.name && user.name.toLowerCase() === identifierLower) ||
      (user.email && user.email.toLowerCase() === identifierLower)
    );

    if (!userByIdentifier) {
      this.loginError = 'Username or email not found.';
      console.warn('Login failed: username/email not found:', this.identifier);
      return;
    }

    // Check if password matches
    if (userByIdentifier.password !== this.password) {
      this.loginError = 'Incorrect password.';
      console.warn('Login failed: incorrect password for user:', this.identifier);
      return;
    }

    // Successful login
    this.identifierError = '';
    this.passwordError = '';
    this.loginError = '';

    // Set currentUser in localStorage for display in home component
    localStorage.setItem('currentUser', JSON.stringify({
      name: userByIdentifier.username || userByIdentifier.name || userByIdentifier.email,
      email: userByIdentifier.email
    }));

    // Update userService with new user info
    this.userService.updateUser({
      name: userByIdentifier.username || userByIdentifier.name || userByIdentifier.email,
      email: userByIdentifier.email
    });

    this.router.navigate(['/home']);
  }    

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  forgotPassword() {
    alert('Forgot password functionality is not implemented yet.');
  }
}
