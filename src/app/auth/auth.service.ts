import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // Check if user is logged in
  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  // Check if logged-in user is an admin
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Static admin credentials
    const staticAdminEmail = 'admin@static.com';
    const staticAdminPassword = 'admin123';

    // Check if user matches static admin credentials
    const isStaticAdmin = user?.email === staticAdminEmail && user?.password === staticAdminPassword;

    return user?.role === 'admin' || isStaticAdmin;
  }

  // Get current user info
  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('user');
  }

  // Login method to check static admin credentials
  login(email: string, password: string): boolean {
    const staticAdminEmail = 'admin@gmail.com';
    const staticAdminPassword = 'admin123';

    if (email === staticAdminEmail && password === staticAdminPassword) {
      // Store user info without password for security
      localStorage.setItem('user', JSON.stringify({
        email: email,
        role: 'admin'
      }));
      return true;
    }
    return false;
  }
}
