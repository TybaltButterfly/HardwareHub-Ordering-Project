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

  private selectedItemIdsSubject: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set());
  selectedItemIds$: Observable<Set<number>> = this.selectedItemIdsSubject.asObservable();

  private storageKey = 'hardwarehub_cart_items';

  constructor() {
    // Load cart items from localStorage if available
    const storedItems = localStorage.getItem(this.storageKey);
    if (storedItems) {
      try {
        const items: CartItem[] = JSON.parse(storedItems);
        this.cartItemsSubject.next(items);
      } catch {
        this.cartItemsSubject.next([]);
      }
    } else {
      this.cartItemsSubject.next([]);
    }

    // Subscribe to changes and persist to localStorage
    this.cartItems$.subscribe(items => {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    });
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  setCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
  }

  setSelectedItemIds(ids: Set<number>): void {
    this.selectedItemIdsSubject.next(new Set(ids));
  }

  getSelectedItemIds(): Set<number> {
    return this.selectedItemIdsSubject.getValue();
  }

  getSelectedCartItems(): CartItem[] {
    const selectedIds = this.getSelectedItemIds();
    return this.getCartItems().filter(item => selectedIds.has(item.id));
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
