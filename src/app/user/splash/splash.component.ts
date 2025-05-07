import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent {
  showRolePopup: boolean = false;
  backgroundImage = 'assets/background.jpg';

  constructor(private router: Router) {}

  goToLogin() {
    this.showRolePopup = true;
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  selectRole(role: string) {
    this.showRolePopup = false;
    if (role === 'admin') {
      // Navigate to admin login or admin route
      this.router.navigate(['/admin/login']);
    } else if (role === 'user') {
      this.router.navigate(['/login']);
    }
  }

  cancelRoleSelection() {
    this.showRolePopup = false;
  }
}
