import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminSettingsService {
  private storageKey = 'adminSettings';

  constructor() {}

  private getStoredSettings(): any {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  public getAllSettings(): any {
    return this.getStoredSettings();
  }

  public saveStoredSettings(settings: any): void {
  localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  saveProfile(profileData: any): void {
    const settings = this.getStoredSettings();
    settings.profile = profileData;
    this.saveStoredSettings(settings);
  }

  saveStoreConfig(storeConfigData: any): void {
    const settings = this.getStoredSettings();
    settings.storeConfig = storeConfigData;
    this.saveStoredSettings(settings);
  }

  saveShippingDelivery(shippingDeliveryData: any): void {
    const settings = this.getStoredSettings();
    settings.shippingDelivery = shippingDeliveryData;
    this.saveStoredSettings(settings);
  }

  savePaymentSetup(paymentSetupData: any): void {
    const settings = this.getStoredSettings();
    settings.paymentSetup = paymentSetupData;
    this.saveStoredSettings(settings);
  }

  saveNotifications(notificationsData: any): void {
    const settings = this.getStoredSettings();
    settings.notifications = notificationsData;
    this.saveStoredSettings(settings);
  }

  saveSystemPreferences(systemPreferencesData: any): void {
    const settings = this.getStoredSettings();
    settings.systemPreferences = systemPreferencesData;
    this.saveStoredSettings(settings);
  }

  getAdmins(): { email: string; password: string; accessLevel: string }[] {
    const settings = this.getStoredSettings();
    return settings.admins || [];
  }

  getProfilePhoto(): string | null {
    const settings = this.getStoredSettings();
    if (settings.profile && settings.profile.profilePhoto) {
      const file = settings.profile.profilePhoto;
      if (typeof file === 'string') {
        return file; // If stored as string (e.g., data URL)
      } else if (file.name) {
        return file.name; // Return file name if available
      }
    }
    return null;
  }

  getStoreLogo(): string | null {
    const settings = this.getStoredSettings();
    if (settings.storeConfig && settings.storeConfig.storeLogo) {
      const file = settings.storeConfig.storeLogo;
      if (typeof file === 'string') {
        return file; // If stored as string (e.g., data URL)
      } else if (file.name) {
        return file.name; // Return file name if available
      }
    }
    return null;
  }

  addAdmin(adminEmail: string, adminPassword: string): void {
    const settings = this.getStoredSettings();
    if (!settings.admins) {
      settings.admins = [];
    }
    settings.admins.push({ email: adminEmail, password: adminPassword, accessLevel: 'viewer' });
    this.saveStoredSettings(settings);
  }

  removeAdmin(adminEmail: string): void {
    const settings = this.getStoredSettings();
    if (settings.admins) {
      settings.admins = settings.admins.filter((admin: any) => admin.email !== adminEmail);
      this.saveStoredSettings(settings);
    }
  }

  updateAdminAccessLevel(adminEmail: string, accessLevel: string): void {
    const settings = this.getStoredSettings();
    if (settings.admins) {
      const admin = settings.admins.find((a: any) => a.email === adminEmail);
      if (admin) {
        admin.accessLevel = accessLevel;
        this.saveStoredSettings(settings);
      }
    }
  }

  updateAdminPassword(adminEmail: string, newPassword: string): void {
    const settings = this.getStoredSettings();
    if (settings.admins) {
      const admin = settings.admins.find((a: any) => a.email === adminEmail);
      if (admin) {
        admin.password = newPassword;
        this.saveStoredSettings(settings);
      }
    }
  }
}
