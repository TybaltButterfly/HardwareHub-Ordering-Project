import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../user.service';

export interface ToolboxItem {
  id: number;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  stock: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToolboxService {
  private toolboxItemsSubject = new BehaviorSubject<ToolboxItem[]>([]);
  toolboxItems$ = this.toolboxItemsSubject.asObservable();

  private storageKeyPrefix = 'hardwarehub_toolbox_items_';

  constructor(private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.loadToolboxItems(user.userId);
    });
  }

  private loadToolboxItems(userId: string) {
    if (!userId) {
      this.toolboxItemsSubject.next([]);
      return;
    }
    const savedItems = localStorage.getItem(this.storageKeyPrefix + userId);
    if (savedItems) {
      try {
        this.toolboxItemsSubject.next(JSON.parse(savedItems));
      } catch {
        this.toolboxItemsSubject.next([]);
      }
    } else {
      this.toolboxItemsSubject.next([]);
    }
  }

  private updateLocalStorage(items: ToolboxItem[], userId: string) {
    if (!userId) return;
    localStorage.setItem(this.storageKeyPrefix + userId, JSON.stringify(items));
  }

  getToolboxItems(): ToolboxItem[] {
    return this.toolboxItemsSubject.getValue();
  }

  addItem(item: ToolboxItem): void {
    const items = this.getToolboxItems();
    const existingItem = items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      items.push(item);
    }
    this.toolboxItemsSubject.next(items);
    const userId = this.userService.getUser().userId;
    this.updateLocalStorage(items, userId);
  }

  removeItem(id: number): void {
    let items = this.getToolboxItems();
    items = items.filter(item => item.id !== id);
    this.toolboxItemsSubject.next(items);
    const userId = this.userService.getUser().userId;
    this.updateLocalStorage(items, userId);
  }

  clearToolbox(): void {
    this.toolboxItemsSubject.next([]);
    const userId = this.userService.getUser().userId;
    if (userId) {
      localStorage.removeItem(this.storageKeyPrefix + userId);
    }
  }
}
