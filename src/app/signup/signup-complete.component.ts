import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-complete',
  standalone: true,
  templateUrl: './signup-complete.component.html',
  styleUrls: ['./signup-complete.component.css']
})
export class SignupCompleteComponent {
  constructor(private router: Router) {}

  continueToLogin() {
    this.router.navigate(['/login']);
  }
}
