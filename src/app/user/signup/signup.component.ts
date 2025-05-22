import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { CartService } from '../../cart.service';
import { ToolboxService } from '../toolbox/toolbox.service';
import { v4 as uuidv4 } from 'uuid';

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

  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private toolboxService: ToolboxService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  closeSignUp() {
    this.router.navigate(['']);
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

    const newUserId = uuidv4();

    users.push({
      userId: newUserId,
      email: this.email,
      username: this.username,
      phoneNumber: this.phoneNumber,
      password: this.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    const existingCurrentUser = localStorage.getItem('currentUser');
    if (!existingCurrentUser) {
      const newUser = {
        userId: newUserId,
        name: this.username,
        email: this.email,
        phoneNumber: this.phoneNumber
      };

      // Clear cart and toolbox for new user
      this.cartService.clearCart();
      this.toolboxService.clearToolbox();

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.userService.updateUser({
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        profilePicture: ''
      });
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
