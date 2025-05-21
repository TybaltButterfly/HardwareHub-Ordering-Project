import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListService, RegisteredUser } from './user-list.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: RegisteredUser[] = [];

  constructor(private userListService: UserListService) {}

  ngOnInit(): void {
    this.userListService.getRegisteredUsers().subscribe(users => {
      this.users = users;
    });
  }
}
