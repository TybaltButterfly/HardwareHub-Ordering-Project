import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { OrderService, Order } from '../../order.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  filterStatus: string = 'All Orders';
  currentUserId: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.currentUserId = user.userId;
      console.log('Current User ID:', this.currentUserId);
      this.loadOrders();
    });
  }
  
  loadOrders(): void {
    const userOrders = this.orderService.getOrdersByUserId(this.currentUserId);
    console.log('User Orders:', userOrders);
    this.orders = userOrders;
    this.applyFilter();
  }

  // Add a method to refresh orders manually if needed
  refreshOrders(): void {
    this.loadOrders();
  }


  applyFilter(): void {
    if (this.filterStatus === 'All Orders') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.filterStatus);
    }
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-details', orderId]);
  }

  getProductNames(order: Order): string {
    if (!order || !order.items) {
      return '';
    }
    return order.items.map(i => i.name).join(', ');
  }

  cancelOrder(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'Cancelled');
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      order.processed = true;
    }
    this.applyFilter();
  }

  markAsReceived(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'Received');
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      order.processed = true;
    }
    this.applyFilter();
  }

  reorder(order: Order): void {
    alert('Reorder feature is not implemented yet.');
  }

  goBack(): void {
    this.location.back();
  }
}
