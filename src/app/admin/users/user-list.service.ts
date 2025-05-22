import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  constructor() {}

  // Fetch registered users from localStorage
  getRegisteredUsers(): Observable<RegisteredUser[]> {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Users data from localStorage:', usersData);
    const users: RegisteredUser[] = usersData.map((user: any, index: number) => ({
      id: index + 1,
      name: user.username || user.name || user.email || '',
      email: user.email || ''
    }));
    return of(users);
  }

  // Delete user by id from localStorage
  deleteUser(userId: number): Observable<boolean> {
    let usersData = JSON.parse(localStorage.getItem('users') || '[]');
    if (userId < 1 || userId > usersData.length) {
      return of(false);
    }
    usersData.splice(userId - 1, 1);
    localStorage.setItem('users', JSON.stringify(usersData));
    return of(true);
  }
}
