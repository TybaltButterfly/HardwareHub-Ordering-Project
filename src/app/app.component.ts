import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HardwareHub';

  ngOnInit() {
    const developerUser = {
      username: 'Shauna',
      email: 'yellowjackets@gmail.com',
      phoneNumber: '09123456789',
      password: 'buzz1996'
    };

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((user: any) => user.email === developerUser.email);
    if (!userExists) {
      users.push(developerUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(developerUser));
    }
  }
}
