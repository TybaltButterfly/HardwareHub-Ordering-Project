import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  stock: number;
  subtotal: number;
  savedForLater?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    // Initialize with empty or persisted cart items if needed
    this.cartItemsSubject.next([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  setCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
  }

  addItem(item: CartItem): void {
    const items = this.getCartItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      items[index].quantity += item.quantity;
      items[index].subtotal = items[index].price * items[index].quantity;
    } else {
      items.push(item);
    }
    this.cartItemsSubject.next([...items]);
  }

  removeItem(itemId: number): void {
    const items = this.getCartItems().filter(item => item.id !== itemId);
    this.cartItemsSubject.next(items);
  }

  updateItemQuantity(itemId: number, quantity: number): void {
    const items = this.getCartItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      items[index].quantity = quantity;
      items[index].subtotal = items[index].price * quantity;
      this.cartItemsSubject.next([...items]);
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getItemCount(): number {
    return this.getCartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  getItemCountObservable(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        observer.next(count);
      });
    });
  }
}
