import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from '../../user.service';
import { ProductService, Product } from '../../product.service';
import { Subscription, interval } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../cart.service';
import { ToolboxService, ToolboxItem } from '../toolbox/toolbox.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User = { name: '', email: '', profilePicture: '' };
  isAccountOpen = false;
  isCategoriesOpen = false;
  private userSubscription?: Subscription;
  private countdownSubscription?: Subscription;
  flashSales: Product[] = [];
  newArrivals: Product[] = [];

  popularCategories = [
    {
      name: 'Power Tools',
      caption: 'For Heavy-Duty Work',
      image: 'assets/power tools.jpg',
      route: '/categories/power-tools',
      isHot: true
    },
    {
      name: 'Hand Tools',
      caption: 'DIY Must-Haves',
      image: 'assets/hand-tools.jpg',
      route: '/categories/hand-tools'
    },
    {
      name: 'Electrical Materials',
      caption: 'Wiring & Essentials',
      image: 'assets/electrical.jpg',
      route: '/categories/electrical-materials',
      isHot: true
    },
    {
      name: 'Plumbing Supplies',
      caption: 'Leak-Free Solutions',
      image: 'assets/plumbing-tools.jpg',
      route: '/categories/plumbing-supplies'
    }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private toolboxService: ToolboxService
  ) {}

  // Promotional Banner properties
  bannerMessage: string = '🚚 Free delivery on orders over ₱2,000! Limited time offer.';
  bannerCtaLabel: string = 'Shop Now';
  bannerCtaTarget: string = '/categories'; // target route to categories

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.currentUser = user;
    });

    this.flashSales = this.productService.getFlashSalesProducts();
    this.newArrivals = this.productService.getNewArrivalsProducts();

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.countdownSubscription?.unsubscribe();
  }

  toggleAccountDropdown(): void {
    this.isAccountOpen = !this.isAccountOpen;
  }

  toggleCategoriesDropdown(): void {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }

  closeAccountDropdown(): void {
    this.isAccountOpen = false;
  }

  closeCategoriesDropdown(): void {
    this.isCategoriesOpen = false;
  }

  onBannerCtaClick(): void {
    // Navigate to the deals page or scroll to deals section
    this.router.navigate([this.bannerCtaTarget]);
  }

  navigateToProfile(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/profile']);
  }

  getStarClass(rating: number, index: number): string {
    if (index < Math.floor(rating)) {
      return 'fa-star';
    } else if (index < rating) {
      return 'fa-star-half-o';
    } else {
      return 'fa-star-o';
    }
  }

  getDiscountPercent(product: Product): number {
    if (product.price && product.salePrice && product.salePrice < product.price) {
      const discount = ((product.price - product.salePrice) / product.price) * 100;
      return discount > 0 ? Math.round(discount) : 0;
    }
    return 0;
  }

  private startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      this.flashSales.forEach(product => {
        if (product.dealEndTime) {
          const distance = product.dealEndTime.getTime() - now;
          if (distance > 0) {
            if (product.timeLeft) {
              product.timeLeft.hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
              product.timeLeft.minutes = Math.floor((distance / (1000 * 60)) % 60);
              product.timeLeft.seconds = Math.floor((distance / 1000) % 60);
            }
          } else {
            product.timeLeft = { hours: 0, minutes: 0, seconds: 0 };
          }
        }
      });
    });
  }

  scrollToNewArrivals(): void {
    const element = document.querySelector('.new-arrivals');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }  
  
  getProductImage(product: Product): string {
    return (product as any).image ?? '/default-product-image.jpg';
  }
  
  formatCategory(category?: string): string {
    return category ? category.replace(/-/g, ' ') : '';
  }  

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownElement = document.querySelector('.nav-left .dropdown');
    if (dropdownElement && !dropdownElement.contains(target)) {
      this.isCategoriesOpen = false;
    }
  }

  formatTime(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  getProductName(product: Product): string {
    return product.name ?? '';
  }

  addToCart(product: Product): void {
    const cartItem = {
      id: product.id,
      name: product.name,
      thumbnail: (product as any).image ?? '/default-product-image.jpg',
      price: product.salePrice ?? product.price,
      quantity: 1,
      stock: 10,
      subtotal: product.salePrice ?? product.price,
    };
    this.cartService.addItem(cartItem);
    alert(`${product.name} has been added to the cart.`);
  }

  addToToolbox(product: Product): void {
    const toolboxItem: ToolboxItem = {
      id: product.id,
      name: product.name,
      thumbnail: (product as any).image ?? '/default-product-image.jpg',
      price: product.salePrice ?? product.price,
      quantity: 1,
      stock: 10,
      subtotal: product.salePrice ?? product.price,
    };
    this.toolboxService.addItem(toolboxItem);
    alert(`${product.name} has been added to your toolbox.`);
  }
}
