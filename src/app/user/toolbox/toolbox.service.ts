import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  constructor() {
    const savedItems = localStorage.getItem('toolboxItems');
    if (savedItems) {
      this.toolboxItemsSubject.next(JSON.parse(savedItems));
    }
  }

  private updateLocalStorage(items: ToolboxItem[]) {
    localStorage.setItem('toolboxItems', JSON.stringify(items));
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
    this.updateLocalStorage(items);
  }

  removeItem(id: number): void {
    let items = this.getToolboxItems();
    items = items.filter(item => item.id !== id);
    this.toolboxItemsSubject.next(items);
    this.updateLocalStorage(items);
  }

  clearToolbox(): void {
    this.toolboxItemsSubject.next([]);
    localStorage.removeItem('toolboxItems');
  }
}
