import { Injectable } from '@angular/core';
import { Product } from '../../product.service';

@Injectable({
  providedIn: 'root'
})
export class AdminProductDetailsService {
  private productDetailsMap: Map<number, { detailsText: string; detailsList: string[] }> = new Map();

  constructor() {
    // Initialize with some default details if needed
  }

  getProductDetails(productId: number) {
    return this.productDetailsMap.get(productId);
  }

  setProductDetails(productId: number, detailsText: string, detailsList: string[]) {
    this.productDetailsMap.set(productId, { detailsText, detailsList });
  }

  // Additional methods for editing, deleting details can be added here
}
