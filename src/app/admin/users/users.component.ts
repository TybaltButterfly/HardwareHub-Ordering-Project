import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListService, RegisteredUser } from './user-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: RegisteredUser[] = [];

  constructor(private userListService: UserListService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userListService.getRegisteredUsers().subscribe(users => {
      this.users = users;
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userListService.deleteUser(userId).subscribe(success => {
        if (success) {
          this.loadUsers();
        } else {
          alert('Failed to delete user.');
        }
      });
    }
  }
}
