import { Component, OnInit } from '@angular/core';
import { AdminTopNavComponent } from '../admin-top-nav/admin-top-nav.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../product.service';
import { OrderService, Order } from '../../order.service';
import { UserListService, RegisteredUser } from '../users/user-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AdminTopNavComponent, AdminSidebarComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed = false;

  totalProducts = 0;
  totalSalesThisMonth = 0;
  newOrdersToday = 0;
  lowStockAlerts = 0;
  newUsers = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private userListService: UserListService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  private loadDashboardData(): void {
    // Total products
    const products: Product[] = this.productService.getProducts();
    this.totalProducts = products.length;

    // Low stock alerts (stock <= 5)
    this.lowStockAlerts = products.filter(p => p.stock !== undefined && p.stock <= 5).length;

    // Orders data
    const orders: Order[] = this.orderService.getOrders();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Total sales this month
    this.totalSalesThisMonth = orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startOfMonth && orderDate <= now;
      })
      .reduce((sum, order) => sum + order.totalPrice, 0);

    // New orders today
    this.newOrdersToday = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= today && orderDate <= now;
    }).length;

    // New users (from observable)
    this.subscriptions.add(
      this.userListService.getRegisteredUsers().subscribe((users: RegisteredUser[]) => {
        this.newUsers = users.length;
      })
    );
  }

  navigateToSection(section: string) {
    console.log('navigateToSection called with section:', section);
    switch (section) {
      case 'products':
        this.router.navigate(['admin', 'products']);
        break;
      case 'sales':
        this.router.navigate(['admin', 'orders']);
        break;
      case 'orders':
        this.router.navigate(['admin', 'orders']);
        break;
      case 'stock':
        this.router.navigate(['admin', 'inventory']);
        break;
      case 'users':
        this.router.navigate(['admin', 'users']);
        break;
      default:
        this.router.navigate(['admin']);
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
