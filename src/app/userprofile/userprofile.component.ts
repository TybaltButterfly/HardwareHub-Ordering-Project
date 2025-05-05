import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  user: User = { name: '', email: '', profilePicture: '' };

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.userService.updateUser(this.user);
    alert('Profile saved successfully!');
    window.location.reload();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
