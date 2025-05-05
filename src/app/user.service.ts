import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  email: string;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>({ name: '', email: '', profilePicture: '' });
  user$ = this.userSubject.asObservable();

  constructor() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.userSubject.next(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    }
  }

  getUser(): User {
    return this.userSubject.getValue();
  }

  updateUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
