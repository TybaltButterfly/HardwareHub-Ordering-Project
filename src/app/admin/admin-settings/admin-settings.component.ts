import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // FIX: Added ActivatedRoute
import { AdminSettingsService } from './admin-settings.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  adminSettingsForm!: FormGroup;
  newAdminEmail: string = '';
  newAdminPassword: string = '';
  admins: { email: string; password?: string; accessLevel: string }[] = [];

  modalOpen: boolean = false;
  selectedSetting: string | null = null;

  profilePhotoName: string = '';

  currentAppInfo = {
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      contactNumber: '+63 912 345 6789',
      twoFactorAuth: true,
    },
    storeConfig: {
      storeName: 'HardwareHub',
      storeDescription: 'Your ultimate hardware store On-the-Go',
      storePhone: '+63 912 345 6789',
      supportEmail: 'support@hardwarehub.com',
      socialLinks: 'https://www.facebook.com/HardwareHub, https://www.instagram.com/HardwareHub, https://www.tiktok.com/@hardwarehubshop',
    },
    shippingDelivery: {
      freeShipping: true,
      flatRate: 50,
      deliveryRange: 'Local area',
      estimatedDeliveryTime: '3-5 days',
    },
    paymentSetup: {
      cod: true,
      gcash: true,
      paymentInstructions: 'Please pay upon delivery or use GCash.',
    },
    notifications: {
      orderConfirmationEmails: true,
      lowStockAlerts: true,
      customerInquiryAlerts: true,
    },
    systemPreferences: {
      dashboardLayoutStyle: 'card',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // FIX: Injected ActivatedRoute
    private adminSettingsService: AdminSettingsService
  ) {}

  ngOnInit() {
    this.adminSettingsForm = this.fb.group({
      profile: this.fb.group({
        name: [this.currentAppInfo.profile.name, Validators.required],
        email: [this.currentAppInfo.profile.email, [Validators.required, Validators.email]],
        contactNumber: [this.currentAppInfo.profile.contactNumber],
        profilePhoto: [null],
        passwordChange: this.fb.group({
          currentPassword: [''],
          newPassword: [''],
        }),
        twoFactorAuth: [this.currentAppInfo.profile.twoFactorAuth],
      }),
      storeConfig: this.fb.group({
        storeName: [this.currentAppInfo.storeConfig.storeName, Validators.required],
        storeDescription: [this.currentAppInfo.storeConfig.storeDescription],
        storePhone: [this.currentAppInfo.storeConfig.storePhone],
        supportEmail: [this.currentAppInfo.storeConfig.supportEmail, Validators.email],
        socialLinks: [this.currentAppInfo.storeConfig.socialLinks],
        storeLogo: ['assets/toolbox.png'] 
      }),
      shippingDelivery: this.fb.group({
        freeShipping: [false],
        flatRate: [0],
        deliveryRange: [''],
        estimatedDeliveryTime: [''],
      }),
      paymentSetup: this.fb.group({
        cod: [false],
        gcash: [false],
        paymentInstructions: [''],
      }),
      notifications: this.fb.group({
        orderConfirmationEmails: [false],
        lowStockAlerts: [false],
        customerInquiryAlerts: [false],
      }),
      adminManagement: this.fb.group({}),
      systemPreferences: this.fb.group({
        dashboardLayoutStyle: ['card'],
      }),
    });

    const savedSettings = this.adminSettingsService.getAllSettings();
    if (savedSettings) {
      if (savedSettings.profile) {
        this.adminSettingsForm.get('profile')?.patchValue(savedSettings.profile);
      }
      if (savedSettings.storeConfig) {
        this.adminSettingsForm.get('storeConfig')?.patchValue(savedSettings.storeConfig);
        if (!savedSettings.storeConfig.storeLogo) {
          this.adminSettingsForm.get('storeConfig')?.get('storeLogo')?.setValue('assets/toolbox.png');
        }
      }
      if (savedSettings.shippingDelivery) {
        this.adminSettingsForm.get('shippingDelivery')?.patchValue(savedSettings.shippingDelivery);
      }
      if (savedSettings.paymentSetup) {
        this.adminSettingsForm.get('paymentSetup')?.patchValue(savedSettings.paymentSetup);
      }
      if (savedSettings.notifications) {
        this.adminSettingsForm.get('notifications')?.patchValue(savedSettings.notifications);
      }
      if (savedSettings.systemPreferences) {
        this.adminSettingsForm.get('systemPreferences')?.patchValue(savedSettings.systemPreferences);
      }
      if (savedSettings.admins) {
        this.admins = savedSettings.admins;
      } else {
        this.admins = [
          { email: 'scatorccio@gmail.com', password: 'antlerqueen', accessLevel: 'superadmin' }
        ];
        this.adminSettingsService.saveStoredSettings({
          ...savedSettings,
          admins: this.admins
        });
      }

      const profilePhoto = this.adminSettingsService.getProfilePhoto();
      if (profilePhoto) {
        this.adminSettingsForm.get('profile')?.get('profilePhoto')?.setValue(profilePhoto);
      }

      const storeLogo = this.adminSettingsService.getStoreLogo(); // FIX: Removed optional chaining
      if (storeLogo) {
        const storeConfigControl = this.adminSettingsForm.get('storeConfig');
        if (storeConfigControl) {
          storeConfigControl.get('storeLogo')?.setValue(storeLogo);
        }
      }
    }

    // FIX: Use ActivatedRoute instead of Router for queryParams
    this.route.queryParams.subscribe(params => {
      if (params['open'] === 'profile') {
        this.openModal('profile');
      }
    });
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file for the profile photo.');
        event.target.value = '';
        return;
      }
      const maxSizeMB = 2;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Profile photo must be smaller than ${maxSizeMB}MB.`);
        event.target.value = '';
        return;
      }
      this.profilePhotoName = file.name; 

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const controlPath = controlName.split('.');
        let control: AbstractControl | null = this.adminSettingsForm;
        for (let i = 0; i < controlPath.length - 1; i++) {
          control = control.get(controlPath[i]);
          if (!control) {
            return;
          }
        }
        control.get(controlPath[controlPath.length - 1])?.setValue(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  get profileFormGroup(): FormGroup | null {
    return this.getFormGroup('profile');
  }

  get passwordChangeGroup(): FormGroup | null {
    const control = this.profileFormGroup?.get('passwordChange');
    return control instanceof FormGroup ? control : null;
  }

  get storeConfigFormGroup(): FormGroup | null {
    return this.getFormGroup('storeConfig');
  }

  get shippingDeliveryFormGroup(): FormGroup | null {
    return this.getFormGroup('shippingDelivery');
  }

  get paymentSetupFormGroup(): FormGroup | null {
    return this.getFormGroup('paymentSetup');
  }

  get notificationsFormGroup(): FormGroup | null {
    return this.getFormGroup('notifications');
  }

  get systemPreferencesFormGroup(): FormGroup | null {
    return this.getFormGroup('systemPreferences');
  }

  openModal(setting: string) {
    this.selectedSetting = setting;
    this.modalOpen = true;
    document.body.classList.add('modal-open');

    if (setting === 'profile') {
      const savedProfilePhoto = this.adminSettingsService.getProfilePhoto();
      if (savedProfilePhoto) {
        this.adminSettingsForm.get('profile')?.get('profilePhoto')?.setValue(savedProfilePhoto);
      }
    }
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedSetting = null;
    document.body.classList.remove('modal-open');
  }

  logout() {
    alert('Logout clicked');
  }

  saveAdmins() {
    const savedSettings = this.adminSettingsService.getAllSettings();
    this.adminSettingsService.saveStoredSettings({
      ...savedSettings,
      admins: this.admins
    });
  }

  addAdmin() {
    if (this.newAdminEmail && this.newAdminPassword) {
      this.adminSettingsService.addAdmin(this.newAdminEmail, this.newAdminPassword);
      this.admins = this.adminSettingsService.getAdmins();
      this.saveAdmins();
      this.newAdminEmail = '';
      this.newAdminPassword = '';
      alert('New admin added successfully!');
    } else {
      alert('Please enter both email and password for the new admin.');
    }
  }

  removeAdmin(index: number) {
    const adminEmail = this.admins[index].email;
    this.adminSettingsService.removeAdmin(adminEmail);
    this.admins = this.adminSettingsService.getAdmins();
    this.saveAdmins();
    alert('Admin removed successfully!');
  }

  updateAccessLevel(index: number, accessLevel: string) {
    const adminEmail = this.admins[index].email;
    this.adminSettingsService.updateAdminAccessLevel(adminEmail, accessLevel);
    this.admins = this.adminSettingsService.getAdmins();
    this.saveAdmins();
    alert('Admin access level updated successfully!');
  }

  getFormGroup(controlName: string): FormGroup | null {
    const control = this.adminSettingsForm.get(controlName);
    return control instanceof FormGroup ? control : null;
  }

  getFormGroupForSetting(setting: string | null): FormGroup {
    const safeSetting = setting || '';  
    return this.getFormGroup(safeSetting) || this.fb.group({});  
  }

  onSubmit() {
    const formGroup = this.selectedSetting ? this.getFormGroup(this.selectedSetting) : null;
    if (formGroup && formGroup.valid) {
      switch (this.selectedSetting) {
        case 'profile':
          this.adminSettingsService.saveProfile(formGroup.value);
          const savedProfilePhoto = this.adminSettingsService.getProfilePhoto();
          if (savedProfilePhoto) {
            this.adminSettingsForm.get('profile')?.get('profilePhoto')?.setValue(savedProfilePhoto);
          }
          break;
        case 'storeConfig':
          this.adminSettingsService.saveStoreConfig(formGroup.value);
          break;
        case 'shippingDelivery':
          this.adminSettingsService.saveShippingDelivery(formGroup.value);
          break;
        case 'paymentSetup':
          this.adminSettingsService.savePaymentSetup(formGroup.value);
          break;
        case 'notifications':
          this.adminSettingsService.saveNotifications(formGroup.value);
          break;
        case 'systemPreferences':
          this.adminSettingsService.saveSystemPreferences(formGroup.value);
          break;
      }
      alert('Settings saved successfully!');
      this.closeModal();
    }
  }

  navigateBack(): void {
    this.router.navigate(['/admin']);
  }

  get profilePhoto(): string | null {
    return this.adminSettingsForm.get('profile.profilePhoto')?.value ?? null;
  }
}
