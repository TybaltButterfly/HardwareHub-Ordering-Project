import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderHistoryEntry {
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Received';
  note?: string;
}

export interface Order {
  orderId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Received';
  orderDate: string;
  deliveryDate: string;
  shippingAddress: string;
  manualNote?: string;
  cancelReason?: string;
  courierInfo?: string;
  expired?: boolean;
  processed?: boolean;
  estimatedDelivery?: string;
  trackingNumber?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  history?: OrderHistoryEntry[];

  // New properties for checkout details
  billingDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street1: string;
    street2?: string;
    city: string;
    town: string;
    barangay: string;
    zip: string;
  };
  shippingDetails?: {
    street1: string;
    street2?: string;
    city: string;
    town: string;
    barangay: string;
    zip: string;
  } | null;
  shippingCost?: number;
  saveInfo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private storageKey = 'hardwarehub_orders';
  private expiryDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  // Subject to emit order changes
  private ordersChanged = new Subject<void>();

  ordersChanged$ = this.ordersChanged.asObservable();

  constructor() {}

  private getOrdersFromStorage(): Order[] {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const orders: Order[] = JSON.parse(stored);
        return orders.filter(order => !this.isOrderExpired(order));
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveOrdersToStorage(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    this.ordersChanged.next();  // Emit change event
  }

  private isOrderExpired(order: Order): boolean {
    const orderTime = new Date(order.orderDate).getTime();
    const now = Date.now();
    return now - orderTime > this.expiryDuration;
  }

  getOrders(): Order[] {
    const orders = this.getOrdersFromStorage();
    this.removeExpiredOrders();
    return orders;
  }

  getOrdersByUserId(userId: string): Order[] {
    const orders = this.getOrdersFromStorage();
    this.removeExpiredOrders();
    return orders.filter(order => order.userId === userId);
  }

  getOrdersByUserName(userName: string): Order[] {
    const orders = this.getOrdersFromStorage();
    this.removeExpiredOrders();
    return orders.filter(order => order.userName === userName);
  }

  getOrderById(orderId: string): Order | undefined {
    const orders = this.getOrdersFromStorage();
    return orders.find(order => order.orderId === orderId);
  }

  addOrder(order: Order): void {
    const orders = this.getOrdersFromStorage();
    const exists = orders.some(o => o.orderId === order.orderId);
    if (!exists) {
      orders.push(order);
      this.saveOrdersToStorage(orders);
    } else {
      console.warn(`Order with orderId ${order.orderId} already exists. Skipping add.`);
    }
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrdersFromStorage();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index].status = status;
      this.saveOrdersToStorage(orders);
    }
  }

  updateManualNote(orderId: string, note: string): void {
    const orders = this.getOrdersFromStorage();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index].manualNote = note;
      this.saveOrdersToStorage(orders);
    }
  }

  updateCancelReason(orderId: string, reason: string): void {
    const orders = this.getOrdersFromStorage();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index].cancelReason = reason;
      this.saveOrdersToStorage(orders);
    }
  }

  updateCourierInfo(orderId: string, info: string): void {
    const orders = this.getOrdersFromStorage();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index].courierInfo = info;
      this.saveOrdersToStorage(orders);
    }
  }

  removeExpiredOrders(): void {
    let orders = this.getOrdersFromStorage();
    orders = orders.filter(order => !this.isOrderExpired(order));
    this.saveOrdersToStorage(orders);
  }

  deleteOrder(orderId: string): void {
    let orders = this.getOrdersFromStorage();
    orders = orders.filter(order => order.orderId !== orderId);
    this.saveOrdersToStorage(orders);
  }
}
