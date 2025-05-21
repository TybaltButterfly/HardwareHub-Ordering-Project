import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  // Filtered lists by status
  pendingOrders: Order[] = [];
  processingOrders: Order[] = [];
  shippedOrders: Order[] = [];
  deliveredOrders: Order[] = [];
  cancelledOrders: Order[] = [];

  // Active tab
  activeTab: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' = 'Pending';

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders = this.orderService.getOrders();
    this.pendingOrders = this.orders.filter(o => o.status === 'Pending');
    this.processingOrders = this.orders.filter(o => o.status === 'Processing');
    this.shippedOrders = this.orders.filter(o => o.status === 'Shipped');
    this.deliveredOrders = this.orders.filter(o => o.status === 'Delivered');
    this.cancelledOrders = this.orders.filter(o => o.status === 'Cancelled');
  }

  getOrderSummary(order: Order): string {
    if (!order.items) return '';
    const itemNames = order.items.map(i => i.name).filter(Boolean);
    return `${order.items.length} items – ${itemNames.join(', ')}`;
  }

  updateManualNote(orderId: string, note: string | undefined): void {
    this.orderService.updateManualNote(orderId, note ?? '');
    this.loadOrders();
  }

  updateCourierInfo(orderId: string, info: string | undefined): void {
    this.orderService.updateCourierInfo(orderId, info ?? '');
    this.loadOrders();
  }

  updateCancelReason(orderId: string, reason: string | undefined): void {
    this.orderService.updateCancelReason(orderId, reason ?? '');
    this.loadOrders();
  }

  updateStatus(orderId: string, newStatus: Order['status']): void {
    this.orderService.updateOrderStatus(orderId, newStatus);
    this.loadOrders();
  }

  markAsProcessing(orderId: string): void {
    this.updateStatus(orderId, 'Processing');
  }

  markAsShipped(orderId: string): void {
    this.updateStatus(orderId, 'Shipped');
  }

  markAsDelivered(orderId: string): void {
    this.updateStatus(orderId, 'Delivered');
  }

  cancelOrder(orderId: string): void {
    this.updateStatus(orderId, 'Cancelled');
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.orderService.deleteOrder(orderId);
      this.loadOrders();
    }
  }
  
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/admin/orders', orderId]);
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }
  
  confirmCancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.cancelOrder(orderId);
    }
  }
}
