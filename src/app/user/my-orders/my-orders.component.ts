import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { OrderService, Order } from '../../order.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private orderService: OrderService, private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders = this.orderService.getOrders();
    this.applyFilter();
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
    // Assuming a cart service exists to add items to cart
    // This is a placeholder implementation
    // You may need to inject CartService and call its addItems method
    alert('Reorder feature is not implemented yet.');
  }

  goBack(): void {
    this.location.back();
  }
}
