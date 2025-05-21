import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../order.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe]
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = '';
  order: Order | undefined;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.order = this.orderService.getOrderById(this.orderId);
    }
    if (!this.order) {
      alert('Order not found.');
      this.router.navigate(['/my-orders']);
    }
  }

  getFormattedShippingAddress(): string {
    if (!this.order) {
      return '';
    }
    const sd = this.order.shippingDetails;
    if (sd) {
      const parts = [
        sd.street1,
        sd.street2,
        sd.barangay,
        sd.town,
        sd.city,
        sd.zip
      ].filter(Boolean);
      return parts.join(', ');
    }
    return this.order.shippingAddress || '';
  }

  goBack(): void {
    this.location.back();
  }
}
