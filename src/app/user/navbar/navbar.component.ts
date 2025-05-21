import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../user.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { CartService } from '../../cart.service';
import { ToolboxService } from '../toolbox/toolbox.service';
import { OrderService, Order } from '../../order.service';  // Added import

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NavbarComponent implements OnInit {
  currentUser: User = { name: '', email: '', profilePicture: '' };
  isAccountOpen = false;
  isCategoriesOpen = false;
  isMobileMenuOpen = false;
  searchQuery: string = '';
  cartItemCount: number = 0;
  toolboxItemCount: number = 0;
  orderCount: number = 0;  // Added order count property

  categories = [
    { name: 'Power Tools', route: '/categories/power-tools' },
    { name: 'Hand Tools', route: '/categories/hand-tools' },
    { name: 'Electrical Materials', route: '/categories/electrical-materials' },
    { name: 'Building Materials', route: '/categories/building-materials' },
    { name: 'Gardening Tools', route: '/categories/gardening-tools' },
    { name: 'Paint & Supplies', route: '/categories/paint-supplies' },
    { name: 'Plumbing Supplies', route: '/categories/plumbing-supplies' },
    { name: 'Safety Tools', route: '/categories/safety-tools' }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private toolboxService: ToolboxService,
    private orderService: OrderService  // Injected OrderService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });

    this.toolboxService.toolboxItems$.subscribe(items => {
      this.toolboxItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });

    // Fetch orders and update orderCount
    this.updateOrderCount();

    // Optionally, set interval to refresh order count periodically (e.g., every 1 minute)
    setInterval(() => {
      this.updateOrderCount();
    }, 60000);
  }

  updateOrderCount(): void {
    const orders = this.orderService.getOrders();
    this.orderCount = orders.length;
  }

  toggleAccountDropdown(): void {
    this.isAccountOpen = !this.isAccountOpen;
  }

  toggleCategoriesDropdown(): void {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }

  closeAccountDropdown(): void {
    this.isAccountOpen = false;
  }

  closeCategoriesDropdown(): void {
    this.isCategoriesOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  navigateToProfile(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/profile']);
    this.closeAccountDropdown();
  }

  logout(): void {
    this.closeAccountDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const categoriesDropdown = document.querySelector('.categories-dropdown');
    const accountDropdown = document.querySelector('.account-dropdown');
    if (categoriesDropdown && !categoriesDropdown.contains(target)) {
      this.isCategoriesOpen = false;
    }
    if (accountDropdown && !accountDropdown.contains(target)) {
      this.isAccountOpen = false;
    }
  }
}
