import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { ToolboxService, ToolboxItem } from '../toolbox/toolbox.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;
  recommendedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toolboxService: ToolboxService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProducts().find(p => p.id === id);
    this.loadRecommendedProducts();
  }

  goBack(): void {
    window.history.back();
  }

  loadRecommendedProducts(): void {
    if (this.product) {
      console.log('Product category:', this.product.category);
      const productsByCategory = this.productService.getProductsByCategory(this.product.category);
      console.log('Products by category:', productsByCategory);
      this.recommendedProducts = productsByCategory
        .filter(p => p.id !== this.product!.id && p.stock !== undefined && p.stock > 0)
        .slice(0, 5);
    }
  }

  getStarClass(rating: number, index: number): string {
    if (index < Math.floor(rating)) {
      return 'fas fa-star';
    } else if (index < rating) {
      return 'fas fa-star-half-alt';
    } else {
      return 'far fa-star';
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product): void {
    const cartItem = {
      id: product.id,
      name: product.name,
      thumbnail: (product as any).image ?? '/default-product-image.jpg',
      price: product.salePrice ?? product.price,
      quantity: 1,
      stock: product.stock ?? 0,
      subtotal: product.salePrice ?? product.price,
    };
    this.cartService.addItem(cartItem);
    alert(`${product.name} has been added to the cart.`);
  }

  addToToolbox (product: Product): void {
    if (!product) {
      return;
    }
    const item: ToolboxItem = {
      id: product.id,
      name: product.name ?? '',
      thumbnail: product.image ?? '',
      price: product.price,
      quantity: 1,
      stock: product.stock ?? 0,
      subtotal: product.price
    };
    this.toolboxService.addItem(item);
    alert(`Added ${product.name} to toolbox.`);
  }
}
