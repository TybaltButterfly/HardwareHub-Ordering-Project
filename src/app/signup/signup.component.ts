import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  username = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';

  emailError = '';
  usernameError = '';
  phoneNumberError = '';
  passwordError = '';
  confirmPasswordError = '';
  signUpError = '';
  signUpSuccess = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private userService: UserService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSignUp() {
    this.emailError = '';
    this.usernameError = '';
    this.phoneNumberError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.signUpError = '';

    if (!this.email) {
      this.emailError = 'Please enter your email.';
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address.';
    }

    if (!this.username) {
      this.usernameError = 'Please enter your username.';
    }

    if (!this.phoneNumber) {
      this.phoneNumberError = 'Please enter your phone number.';
    } else if (!this.validatePhoneNumber(this.phoneNumber)) {
      this.phoneNumberError = 'Please enter a valid phone number.';
    }

    if (!this.password) {
      this.passwordError = 'Please enter your password.';
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password.';
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
    }

    if (this.emailError || this.usernameError || this.phoneNumberError || this.passwordError || this.confirmPasswordError) {
      return;
    }

    // Save user data to localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email or username already exists
    const emailExists = users.some((user: any) => user.email === this.email);
    const usernameExists = users.some((user: any) => user.username === this.username);

    if (emailExists) {
      this.signUpError = 'Email already registered.';
      return;
    }

    if (usernameExists) {
      this.signUpError = 'Username already taken.';
      return;
    }

    users.push({
      email: this.email,
      username: this.username,
      phoneNumber: this.phoneNumber,
      password: this.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    const existingCurrentUser = localStorage.getItem('currentUser');
    if (!existingCurrentUser) {
      const newUser = {
        name: this.username,
        email: this.email,
        phoneNumber: this.phoneNumber
      };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.userService.updateUser(newUser);
    }
    this.router.navigate(['/signup-complete']);
  }

  validateEmail(email: string): boolean {
    const re = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  }

  validatePhoneNumber(phone: string): boolean {
    const re = /^(?:\+63|0)9\d{9}$/;
    return re.test(phone);
  }
}
