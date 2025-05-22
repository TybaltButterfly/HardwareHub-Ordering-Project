import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

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

  private storageKeyPrefix = 'hardwarehub_cart_items_';

  constructor(private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.loadCartItems(user.userId);
    });
  }

  private loadCartItems(userId: string) {
    if (!userId) {
      this.cartItemsSubject.next([]);
      return;
    }
    const storedItems = localStorage.getItem(this.storageKeyPrefix + userId);
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
  }

  private saveCartItems(userId: string, items: CartItem[]) {
    if (!userId) return;
    localStorage.setItem(this.storageKeyPrefix + userId, JSON.stringify(items));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  setCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    const userId = this.userService.getUser().userId;
    this.saveCartItems(userId, items);
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
    this.setCartItems([...items]);
  }

  removeItem(itemId: number): void {
    const items = this.getCartItems().filter(item => item.id !== itemId);
    this.setCartItems(items);
  }

  updateItemQuantity(itemId: number, quantity: number): void {
    const items = this.getCartItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      items[index].quantity = quantity;
      items[index].subtotal = items[index].price * quantity;
      this.setCartItems([...items]);
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    const userId = this.userService.getUser().userId;
    if (userId) {
      localStorage.removeItem(this.storageKeyPrefix + userId);
    }
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
