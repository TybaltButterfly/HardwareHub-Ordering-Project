import { Injectable } from '@angular/core';
import { ProductService, Product } from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  constructor(private productService: ProductService) {}

  searchProducts(query: string) {
    return this.productService.searchProducts(query);
  }

  getProductsByCategory(category: string) {
    if (!category.trim()) {
      return this.productService.getProducts();
    }
    return this.productService.getProductsByCategory(category);
  }

  createProduct(product: Product): Product {
    const products = this.productService.getProducts();
    products.push(product);
    this.productService.updateProducts(products);
    return product;
  }

  updateProduct(updatedProduct: Product): boolean {
    const products = this.productService.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return false;
    }
    products[index] = { ...updatedProduct, lastUpdated: new Date() };
    this.productService.updateProducts(products);
    return true;
  }

  deleteProduct(productId: number): boolean {
    const products = this.productService.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
      return false;
    }
    products.splice(index, 1);
    this.productService.updateProducts(products);
    return true;
  }

  bulkDelete(productIds: number[]): number {
    let deletedCount = 0;
    const products = this.productService.getProducts();
    productIds.forEach(id => {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        deletedCount++;
      }
    });
    this.productService.updateProducts(products);
    return deletedCount;
  }

  bulkStatusChange(productIds: number[], status: boolean): number {
    let updatedCount = 0;
    const products = this.productService.getProducts();
    productIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        product.status = status;
        product.lastUpdated = new Date();
        updatedCount++;
      }
    });
    this.productService.updateProducts(products);
    return updatedCount;
  }

  bulkCategoryMove(productIds: number[], newCategory: string): number {
    let updatedCount = 0;
    const products = this.productService.getProducts();
    productIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        product.category = newCategory;
        product.lastUpdated = new Date();
        updatedCount++;
      }
    });
    this.productService.updateProducts(products);
    return updatedCount;
  }
}
