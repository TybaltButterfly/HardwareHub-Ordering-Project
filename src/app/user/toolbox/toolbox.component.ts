import { Component, OnInit } from '@angular/core';
import { ToolboxService, ToolboxItem } from './toolbox.service';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../user.service';
import { CartService } from '../../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ToolboxComponent implements OnInit {
  toolboxItems: ToolboxItem[] = [];
  user: User | null = null;
  isLoggedIn = false;
  sortCriteria: string = 'Recent';

  constructor(
    private toolboxService: ToolboxService,
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.toolboxService.toolboxItems$.subscribe(items => {
      this.toolboxItems = items;
      this.sortToolbox(this.sortCriteria);
    });

    this.userService.user$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user && !!user.email && user.email.length > 0;
    });
  }

  removeItem(id: number): void {
    if (confirm('Are you sure you want to remove this item from the toolbox?')) {
      this.toolboxService.removeItem(id);
    }
  }

  clearToolbox(): void {
    if (confirm('Are you sure you want to clear all items from the toolbox?')) {
      this.toolboxService.clearToolbox();
    }
  }

  addToCart(item: ToolboxItem): void {
    this.cartService.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      thumbnail: item.thumbnail,
      stock: item.stock,
      subtotal: item.price * 1
    });
    this.toolboxService.removeItem(item.id);
    alert(`${item.name} has been added to the cart.`);
  }

  sortToolbox(criteria: string): void {
    this.sortCriteria = criteria;
    if (criteria === 'A-Z') {
      this.toolboxItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'Category') {
    } else {
    }
  }

  goBack(): void {
    window.history.back();
  }

  navigateToLogin(): void {
    window.location.href = '/login';
  }

  navigateToRegister(): void {
    window.location.href = '/signup';
  }

  startBrowsing(): void {
    window.location.href = '/home';
  }
}
