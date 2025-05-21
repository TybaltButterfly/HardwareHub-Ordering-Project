import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../cart.service';
import { OrderService, Order, OrderItem } from '../../order.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  // Billing details
  billingFirstName: string = '';
  billingLastName: string = '';
  billingEmail: string = '';
  billingPhone: string = '';
  billingStreet1: string = '';
  billingStreet2: string = '';
  billingCity: string = '';
  billingTown: string = '';
  billingBarangay: string = '';
  billingZip: string = '';

  // Shipping address
  shipToDifferentAddress: boolean = false;
  shippingOption: string = 'same'; // 'same' or 'different'
  shippingStreet1: string = '';
  shippingStreet2: string = '';
  shippingCity: string = '';
  shippingTown: string = '';
  shippingBarangay: string = '';
  shippingZip: string = '';

  shippingCost: number = 5.00;

  userName: string = 'Guest'; // Default user name
  paymentMethod: string = ''; // New payment method property
  saveInfo: boolean = false; // New property for save info checkbox

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getSelectedCartItems();
    this.calculateTotal();
    const user = this.userService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  }

    placeOrder(): void {
        // Validate billing details
        if (!this.billingFirstName.trim() || !this.billingLastName.trim() || !this.billingEmail.trim() || !this.billingPhone.trim() ||
            !this.billingStreet1.trim() || !this.billingBarangay.trim() || !this.billingTown.trim() || !this.billingCity.trim() || !this.billingZip.trim()) {
          alert('Please complete all billing details.');
          return;
        }

        // Validate shipping address if different
        if (this.shipToDifferentAddress && this.shippingOption === 'different') {
          if (!this.shippingStreet1.trim() || !this.shippingBarangay.trim() || !this.shippingTown.trim() || !this.shippingCity.trim() || !this.shippingZip.trim()) {
            alert('Please complete all shipping address details.');
            return;
          }
        }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!this.paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

        // Determine shipping address to use
        let finalShippingAddress = '';
        if (this.shipToDifferentAddress && this.shippingOption === 'different') {
          finalShippingAddress = `${this.shippingStreet1}, ${this.shippingStreet2}, ${this.shippingBarangay}, ${this.shippingTown}, ${this.shippingCity}, ${this.shippingZip}`;
        } else {
          finalShippingAddress = `${this.billingStreet1}, ${this.billingStreet2}, ${this.billingBarangay}, ${this.billingTown}, ${this.billingCity}, ${this.billingZip}`;
        }

        const newOrder: Order = {
          orderId: uuidv4(),
          userName: this.userName,
          items: orderItems,
          totalPrice: this.totalPrice + this.shippingCost,
          status: 'Pending',
          orderDate: new Date().toISOString(),
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days later
          shippingAddress: finalShippingAddress,
          paymentMethod: this.paymentMethod, // Include payment method
          billingDetails: {
            firstName: this.billingFirstName,
            lastName: this.billingLastName,
            email: this.billingEmail,
            phone: this.billingPhone,
            street1: this.billingStreet1,
            street2: this.billingStreet2,
            barangay: this.billingBarangay,
            town: this.billingTown,
            city: this.billingCity,
            zip: this.billingZip
          },
          shippingDetails: this.shipToDifferentAddress && this.shippingOption === 'different' ? {
            street1: this.shippingStreet1,
            street2: this.shippingStreet2,
            barangay: this.shippingBarangay,
            town: this.shippingTown,
            city: this.shippingCity,
            zip: this.shippingZip
          } : null,
          shippingCost: this.shippingCost,
          saveInfo: this.saveInfo
        };

    this.orderService.addOrder(newOrder);
    this.cartService.clearCart();
    alert('Order placed successfully!');
    this.router.navigate(['/my-orders']);
  }
    goBack(): void {
    window.history.back();
  }

}
