import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order, OrderHistoryEntry } from '../../order.service';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
})
export class AdminOrderDetailsComponent implements OnInit {
  orderId: string = '';
  order: Order | undefined;
  newStatus: Order['status'] = 'Pending';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.order = this.orderService.getOrderById(this.orderId);
      if (this.order) {
        this.newStatus = this.order.status;
        // Initialize history if not present
        if (!this.order.history) {
          this.order.history = [];
        }
      }
    }
    if (!this.order) {
      alert('Order not found.');
      this.router.navigate(['/admin/orders']);
    }
  }

  updateStatus(): void {
    if (this.order) {
      // Add to history before updating status
      const historyEntry: OrderHistoryEntry = {
        date: new Date().toISOString(),
        status: this.newStatus,
        note: `Status changed to ${this.newStatus}`
      };
      this.order.history = this.order.history || [];
      this.order.history.push(historyEntry);

      this.orderService.updateOrderStatus(this.order.orderId, this.newStatus);
      alert('Order status updated.');
      this.router.navigate(['/admin/orders']);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }

  filterTruthy(values: (string | undefined)[]): string[] {
    return values.filter(value => !!value) as string[];
  }
}
