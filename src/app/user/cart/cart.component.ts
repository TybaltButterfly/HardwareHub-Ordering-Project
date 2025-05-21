import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { CartService, CartItem } from '../../cart.service';
import { ToolboxService } from '../toolbox/toolbox.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
})

export class CartComponent {
  @ViewChild('emptyCart', { static: true }) emptyCart!: TemplateRef<any>;

  cartItems$: Observable<CartItem[]>;
  cartItems: CartItem[] = [];

  couponCode: string = '';
  couponFeedback: string = '';
  couponApplied: boolean = false;
  discountAmount: number = 0;
  freeShippingApplied: boolean = false;

  // Track selected item ids
  selectedItems: Set<number> = new Set();

  private cartItemsSubscription: Subscription | undefined;

  constructor(private router: Router, private cartService: CartService, private toolboxService: ToolboxService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.cartItemsSubscription = this.cartItems$.subscribe((items: CartItem[]) => {
      console.log('Cart items updated:', items);
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
  }

  get itemCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.stock) {
      this.cartService.updateItemQuantity(item.id, item.quantity + 1);
      this.updateSelectionAfterQuantityChange(item);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateItemQuantity(item.id, item.quantity - 1);
      this.updateSelectionAfterQuantityChange(item);
    }
  }

  updateSubtotal(item: CartItem): void {
    // subtotal is updated in service
  }

  removeItem(item: CartItem): void {
    if (confirm(`Are you sure you want to remove ${item.name} from the cart?`)) {
      this.cartService.removeItem(item.id);
      this.selectedItems.delete(item.id);
    }
  }

  moveToToolbox(item: CartItem): void {
    if (confirm(`Move ${item.name} to toolbox?`)) {
      this.toolboxService.addItem(item);
      this.cartService.removeItem(item.id);
      this.selectedItems.delete(item.id);
      console.log(`Moved item ${item.name} to toolbox`);
      this.router.navigate(['/toolbox']);
    }
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.couponFeedback = 'Please enter a coupon code.';
      this.couponApplied = false;
      this.discountAmount = 0;
      this.freeShippingApplied = false;
      return;
    }
    const code = this.couponCode.toUpperCase();
    switch (code) {
      case 'SAVE10':
        this.discountAmount = this.subtotal * 0.1;
        this.freeShippingApplied = true;
        this.couponApplied = true;
        this.couponFeedback = 'Coupon SAVE10 applied successfully!';
        break;
      case 'FREESHIP':
        this.discountAmount = 0;
        this.freeShippingApplied = true;
        this.couponApplied = true;
        this.couponFeedback = 'Free shipping coupon applied successfully!';
        break;
      default:
        this.couponFeedback = 'Invalid coupon code.';
        this.couponApplied = false;
        this.discountAmount = 0;
        this.freeShippingApplied = false;
        break;
    }
  }

  // Calculate subtotal based on selected items
  get subtotal(): number {
    return this.cartItems
      .filter(item => this.selectedItems.has(item.id))
      .reduce((acc, item) => acc + item.subtotal, 0);
  }

  // Calculate shipping based on selected items subtotal minus discount
  get shipping(): number {
    if (this.couponApplied && this.freeShippingApplied) {
      return 0;
    }
    // Remove free shipping based on subtotal threshold
    return this.subtotal > 0 ? 100 : 0;
  }

  // Calculate total based on selected items subtotal, shipping, and discount
  get total(): number {
    return this.subtotal + this.shipping - this.discountAmount;
  }

  // Check if any item is selected
  get hasSelectedItems(): boolean {
    return this.selectedItems.size > 0;
  }

  // Toggle selection of a single item
  toggleItemSelection(item: CartItem): void {
    if (this.selectedItems.has(item.id)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }
  }

  // Toggle select all items
  toggleSelectAll(): void {
    if (this.hasSelectedItems && this.selectedItems.size === this.cartItems.length) {
      this.selectedItems.clear();
    } else {
      this.cartItems.forEach(item => this.selectedItems.add(item.id));
    }
  }

  // Remove all unchecked items from cart
  removeUncheckedItems(): void {
    if (confirm('Are you sure you want to remove all unchecked items?')) {
      this.cartItems = this.cartItems.filter(item => this.selectedItems.has(item.id));
    }
  }

  // Update selection after quantity change (optional: keep selected if quantity > 0)
  updateSelectionAfterQuantityChange(item: CartItem): void {
    if (item.quantity <= 0) {
      this.selectedItems.delete(item.id);
    }
  }

  proceedToCheckout(): void {
    if (this.hasSelectedItems) {
      // Set selected items in cart service before navigating
      this.cartService.setSelectedItemIds(this.selectedItems);
      this.router.navigate(['/checkout']);
    }
  }

  returnToShop(): void {
    this.router.navigate(['/home']);
  }

  continueShopping(): void {
    this.router.navigate(['/categories']);
  }
}
