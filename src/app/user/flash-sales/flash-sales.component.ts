import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService, Product } from '../../product.service';
import { CartService, CartItem } from '../../cart.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flash-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './flash-sales.component.html',
  styleUrls: ['./flash-sales.component.css']
})
export class FlashSalesComponent implements OnInit, OnDestroy {
  flashSaleProducts: Product[] = [];
  allFlashSaleProducts: Product[] = [];
  showAllDeals: boolean = false;
  categories: string[] = [
    'Power Tools',
    'Paint & Supplies',
    'Electrical Materials',
    'Plumbing Supplies',
    'Gardening Tools',
    'Hand Tools',
    'Building Materials'
  ];
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  selectedSort: string = 'Popular';
  cartItemCount: number = 0;
  totalPrice: number = 0;
  countdown: string = '';
  private countdownSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;

  promoCallouts: { icon: string; message: string }[] = [
    { icon: '🎁', message: 'FREE Faucet Installation on ₱1,500 Plumbing Orders!' }
  ];

  // Quick Buy modal state
  quickBuyProduct: Product | null = null;
  quickBuyQuantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}


  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadAllFlashSaleProducts(): void {
    this.allFlashSaleProducts = this.productService.getFlashSalesProducts();
  }

  toggleViewAllDeals(): void {
    this.showAllDeals = !this.showAllDeals;
    if (this.showAllDeals) {
      this.loadAllFlashSaleProducts();
    }
  }


ngOnInit(): void {
  this.loadFlashSaleProducts();
  console.log('Flash sales products loaded:', this.flashSaleProducts);
  this.cartItemCount = this.cartService.getItemCount();
  this.totalPrice = this.cartService.getCartItems().reduce((acc, item) => acc + item.subtotal, 0);

  this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
    this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    this.totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0);
  });

  this.startCountdown();
}


  openQuickBuyModal(product: Product): void {
    this.quickBuyProduct = product;
    this.quickBuyQuantity = 1;
  }

  closeQuickBuyModal(): void {
    this.quickBuyProduct = null;
    this.quickBuyQuantity = 1;
  }

  confirmQuickBuy(): void {
    if (!this.quickBuyProduct) return;
    const quantity = this.quickBuyQuantity > 0 ? this.quickBuyQuantity : 1;
    const cartItem: CartItem = {
      id: this.quickBuyProduct.id,
      name: this.quickBuyProduct.name,
      thumbnail: this.quickBuyProduct.image ?? '',
      price: this.quickBuyProduct.salePrice ?? this.quickBuyProduct.price,
      quantity: quantity,
      stock: this.quickBuyProduct.stock ?? 0,
      subtotal: (this.quickBuyProduct.salePrice ?? this.quickBuyProduct.price) * quantity
    };
    this.cartService.addItem(cartItem);
    this.closeQuickBuyModal();
    // Optionally navigate to checkout or show confirmation
  }

  loadFlashSaleProducts(): void {
    let products = this.productService.getFlashSalesProducts();

    // Add location availability and delivery estimate for flash sale products
    products = products.map(p => {
      // If product already has availableLocations and deliveryEstimate, keep them
      let availableLocations: string[] = p.availableLocations ?? [];
      let deliveryEstimate: string = p.deliveryEstimate ?? '';

      // For products without these fields, add example data based on id
      if (availableLocations.length === 0 && deliveryEstimate === '') {
        if (p.id === 101) {
          availableLocations = ['Maya'];
          deliveryEstimate = 'Delivers by Friday in Maya';
        } else if (p.id === 102) {
          availableLocations = ['Tapilon'];
          deliveryEstimate = 'Delivers by Monday in Tapilon';
        } else if (p.id === 103) {
          availableLocations = ['Daanbantayan'];
          deliveryEstimate = 'Delivers by Saturday in Daanbantayan';
        } else if (p.id === 104) {
          availableLocations = ['Paypay'];
          deliveryEstimate = 'Delivers by Thursday in Paypay';
        } else if (p.id === 105) {
          availableLocations = ['Daanbantayan'];
          deliveryEstimate = 'Delivers by Friday in Daanbantayan';
        } else if (p.id === 106) {
          availableLocations = ['Calape'];
          deliveryEstimate = 'Delivers by Friday in Calape';
        } else if (p.id === 107) {
          availableLocations = ['Maya'];
          deliveryEstimate = 'Delivers by Tuesday in Maya';
        }
      }

      return { ...p, availableLocations, deliveryEstimate };
    });


    if (this.selectedCategory) {
      const normalizedCategory = this.selectedCategory.toLowerCase().replace(/\s+/g, '-');
      products = products.filter(p => p.category === normalizedCategory);
    }

    if (this.selectedPriceRange) {
      const [minStr, maxStr] = this.selectedPriceRange.split('-');
      const min = parseInt(minStr, 10);
      const max = maxStr === '+' ? Number.MAX_SAFE_INTEGER : parseInt(maxStr, 10);
      products = products.filter(p => p.salePrice !== undefined && p.salePrice >= min && p.salePrice <= max);
    }

    if (this.selectedSort === 'PriceLowHigh') {
      products = products.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0));
    } else if (this.selectedSort === 'PriceHighLow') {
      products = products.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0));
    } else {
      // Default sort by Popular or other criteria if available
      products = products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    this.flashSaleProducts = products;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loadFlashSaleProducts();
  }

  onPriceRangeChange(priceRange: string): void {
    this.selectedPriceRange = priceRange;
    this.loadFlashSaleProducts();
  }

  onSortChange(sort: string): void {
    this.selectedSort = sort;
    this.loadFlashSaleProducts();
  }

  addToCart(product: Product): void {
    console.log('addToCart called for product:', product);
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      thumbnail: product.image ?? '',
      price: product.salePrice ?? product.price,
      quantity: 1,
      stock: product.stock ?? 0,
      subtotal: product.salePrice ?? product.price
    };
    this.cartService.addItem(cartItem);
    alert(`Product "${product.name}" has been added to your cart.`);
    // Update cart item count immediately after adding
    this.cartItemCount = this.cartService.getItemCount();
    console.log('Updated cart item count:', this.cartItemCount);
  }

  startCountdown(): void {
    const saleEnd = new Date();
    saleEnd.setHours(saleEnd.getHours() + 3);

    this.countdownSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const distance = saleEnd.getTime() - now;

      if (distance < 0) {
        this.countdown = '00:00:00';
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      } else {
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        this.countdown = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    });
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  goBack(): void {
    window.history.back();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
}
