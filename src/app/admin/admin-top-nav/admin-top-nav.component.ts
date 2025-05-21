import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNotificationService, Notification } from './admin-notification.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AdminSettingsService } from '../admin-settings/admin-settings.service';

@Component({
  selector: 'app-admin-top-nav',
  imports: [CommonModule],
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.css']
})
export class AdminTopNavComponent implements OnInit {
  adminName = 'Admin'; 
  showNotifications = true; 

  notifications: Notification[] = [];
  isNotificationDropdownOpen = false; // Track dropdown visibility

  profilePhotoUrl: string | null = null;

  constructor(
    private notificationService: AdminNotificationService,
    private authService: AuthService,
    private router: Router,
    private adminSettingsService: AdminSettingsService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.profilePhotoUrl = this.adminSettingsService.getProfilePhoto();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    if (this.isNotificationDropdownOpen) {
      this.markAllAsRead();
    }
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
      notification.read = true;
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    this.notifications.forEach(n => n.read = true);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProfileSecurity() {
    this.router.navigate(['/admin/settings'], { queryParams: { open: 'profile' } });
  }
}
