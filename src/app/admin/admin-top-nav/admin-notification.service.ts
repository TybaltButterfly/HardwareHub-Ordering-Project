import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {
  private notifications: Notification[] = [
    { id: 1, message: 'New order received', read: false },
    { id: 2, message: 'Low stock alert: Product XYZ', read: false }
  ];

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    // Simulate API call with Observable.of
    return of(this.notifications);
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
}
