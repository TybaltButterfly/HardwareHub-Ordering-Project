import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { ToolboxService, ToolboxItem } from '../toolbox/toolbox.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  quantity: number = 1;
  recommendedProducts: Product[] = [];
  private subscription: Subscription | undefined;
  private productId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toolboxService: ToolboxService,
    private cartService: CartService
  ) {}

ngOnInit(): void {
  this.productId = Number(this.route.snapshot.paramMap.get('id'));

  this.subscription = this.productService.products$.subscribe(products => {
    const foundProduct = products.find(p => p.id === this.productId);
    if (foundProduct) {
      this.product = {
        ...foundProduct,
        stock: Number(foundProduct.stock ?? 0)
      };
      this.quantity = 1;
      this.loadRecommendedProducts();
    }
  });
}


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getStock(): number {
  return Number(this.product?.stock ?? 0);
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
  console.log('Current quantity:', this.quantity);
  console.log('Product stock:', this.product?.stock);

  if (this.product && this.quantity < (this.product.stock ?? 0)) {
    this.quantity++;
  }
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
      quantity: this.quantity,
      stock: product.stock ?? 0,
      subtotal: (product.salePrice ?? product.price) * this.quantity,
    };
    this.cartService.addItem(cartItem);
    alert(`${product.name} (Quantity: ${this.quantity}) has been added to the cart.`);
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
