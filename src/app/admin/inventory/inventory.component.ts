import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  updateStock(product: Product): void {
    if (product.stock !== undefined && product.stock >= 0) {
      const products = this.productService.getProducts();
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products[index].stock = product.stock;
        products[index].status = product.stock > 0;
        products[index].lastUpdated = new Date();
        this.productService.updateProducts(products);
        alert(`Stock updated for ${product.name}`);
      }
    } else {
      alert('Invalid stock value');
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
