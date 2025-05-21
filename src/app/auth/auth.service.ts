import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private defaultAdmins = [
    { email: 'scatorccio@gmail.com', password: 'antlerqueen', accessLevel: 'superadmin' },
    { email: 'taylor@gmail.com', password: 'jackiefruit', accessLevel: 'admin' },
    { email: 'admin@gmail.com', password: 'admin123', accessLevel: 'superadmin' }
  ];

  constructor() {}

  // Check if user is logged in
  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  // Check if logged-in user is an admin
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'admin';
  }

  // Get current user info
  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('user');
  }

  // Login method to check credentials against stored admins or default admins
  login(email: string, password: string): boolean {
    const settings = localStorage.getItem('adminSettings');
    let admins: any[] = [];
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      admins = parsedSettings.admins || [];
    }
    // Check stored admins first
    let admin = admins.find((a: any) => a.email === email && a.password === password);
    // If not found, check default admins
    if (!admin) {
      admin = this.defaultAdmins.find(a => a.email === email && a.password === password);
    }
    if (admin) {
      localStorage.setItem('user', JSON.stringify({
        email: admin.email,
        role: 'admin',
        accessLevel: admin.accessLevel
      }));
      return true;
    }
    return false;
  }
}
