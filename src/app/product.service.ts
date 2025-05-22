import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  salePrice?: number;
  dealEndTime?: Date;
  timeLeft?: { hours: number; minutes: number; seconds: number };
  dateAdded?: Date;
  isTrending?: boolean;

  detailsText?: string;
  detailsList?: string[];
  reviews?: Review[];

  stock?: number;
  status?: boolean;

  lastUpdated?: Date;
  isNew?: boolean;
  isPromo?: boolean;
  
  availableLocations?: string[];
  deliveryEstimate?: string;
}

export interface Review {
  author: string;
  comment: string;
  rating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private localStorageKey = 'productList';

  private productsSubject: BehaviorSubject<Product[]>;

  products$: Observable<Product[]>;

  constructor() {
    const savedProducts = localStorage.getItem(this.localStorageKey);
    if (savedProducts) {
      // Parse saved products and convert date strings back to Date objects
      const parsedProducts: Product[] = JSON.parse(savedProducts, (key, value) => {
        if (key === 'dealEndTime' || key === 'dateAdded' || key === 'lastUpdated') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      this.productsSubject = new BehaviorSubject<Product[]>(parsedProducts);
    } else {
      this.productsSubject = new BehaviorSubject<Product[]>([
        { id: 1, name: 'Cordless Jigsaw', description: 'Lightweight cordless jigsaw', price: 189.99, category: 'power-tools', image: 'assets/tolsen-jigsaw.webp', stock: 15, status: true },
        { id: 2, name: 'Adjustable Wrench', description: '12-inch adjustable wrench', price: 234.99, category: 'hand-tools', image: 'assets/adjustable-wrench.jpg', stock: 0, status: false },
        { id: 3, name: 'Paint Roller Set', description: 'Includes roller frame and 3 rollers', price: 325.99, category: 'paint-supplies', image: 'assets/prollerset.jpg', stock: 8, status: true },
        { id: 4, name: 'Cordless Impact Driver', description: 'High torque cordless impact driver', price: 229.99, category: 'power-tools', image: 'assets/cordless-impact-driver.jpg', stock: 5, status: true },
        { id: 5, name: 'Measuring Tape', description: '25-foot retractable measuring tape', price: 50.99, category: 'hand-tools', image: 'assets/measuring-tape.webp', stock: 0, status: false },
        // Flash Sales Products
        {
          id: 101,
          name: 'Holcim Excel Cement (40kg)',
          description: 'Premium quality cement for strong construction.',
          price: 310,
          salePrice: 280,
          category: 'building-materials',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/Holcim-Excel.jpg',
          availableLocations: ['Maya'],
          deliveryEstimate: 'Delivers by Friday in Maya',
          stock: 20,
          status: true,
          detailsText: 'Holcim Excel Cement is perfect for durable concrete works. It offers excellent binding strength and long-lasting quality.',
          detailsList: [
          'High compressive strength',
          'Resistant to environmental factors',
          'Quick setting time',
          'Suitable for all construction types'
          ],
          reviews: [
          { author: 'Christopher Aluba', comment: 'Very reliable cement. Helped my house foundation.', rating: 5 },
          { author: 'Rolando Lima', comment: 'Good quality for the price.', rating: 4 }
          ]
        },
        {
          id: 102,
          name: 'GARDENA Hose Spray Gun',
          description: 'Adjustable nozzle for easy watering and cleaning.',
          price: 1197,
          salePrice: 997,
          category: 'gardening-tools',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/spray gun.webp',
          availableLocations: ['Tapilon'],
          deliveryEstimate: 'Delivers by Monday in Tapilon',
          stock: 0,
          status: false
        },
        {
          id: 103,
          name: 'Tolsen 12-Piece Wrench Set',
          description: 'Durable and rust-resistant wrenches for all tasks.',
          price: 1997,
          salePrice: 1499,
          category: 'hand-tools',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/wrench.webp',
          availableLocations: ['Daanbantayan'],
          deliveryEstimate: 'Delivers by Saturday in Daanbantayan',
          stock: 10,
          status: true
        },
        {
          id: 104,
          name: 'HGC-FS Kitchen Faucet',
          description: 'Durable and sleek stainless steel faucet for modern kitchens.',
          price: 3499,
          salePrice: 2899,
          category: 'plumbing-supplies',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/kitchenfaucet.jpg',
          availableLocations: ['Paypay'],
          deliveryEstimate: 'Delivers by Thursday in Paypay',
          stock: 7,
          status: true
        },
        {
          id: 105,
          name: 'Philips LED Bulb 9W',
          description: 'Energy-saving LED bulb with long lifespan.',
          price: 150,
          salePrice: 120,
          category: 'electrical-materials',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/led-bulb.webp',
          availableLocations: ['Daanbantayan'],
          deliveryEstimate: 'Delivers by Friday in Daanbantayan',
          stock: 0,
          status: false
        },
        {
          id: 106,
          name: 'Schneider Electric Switch',
          description: 'Durable and safe electrical switch for home use.',
          price: 250,
          salePrice: 200,
          category: 'electrical-materials',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/electric-switch.webp',
          availableLocations: ['Calape'],
          deliveryEstimate: 'Delivers by Friday in Calape',
          stock: 12,
          status: true
        },
        {
          id: 107,
          name: 'PVC Pipe 1 inch',
          description: 'High-quality PVC pipe for plumbing applications.',
          price: 100,
          salePrice: 80,
          category: 'plumbing-supplies',
          dealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          image: 'assets/pvc-pipe.jpg',
          availableLocations: ['Maya'],
          deliveryEstimate: 'Delivers by Tuesday in Maya',
          stock: 0,
          status: false
        },
        // New Arrivals Products
        {
          id: 201,
          name: 'Tolsen Cordless Drill 12V',
          description: 'Compact design, 2-speed settings',
          price: 3499,
          category: 'power-tools',
          rating: 4.5,
          dateAdded: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          isTrending: true,
          image: 'assets/tolsen-drill.webp',
          stock: 5,
          status: true
        },
        {
          id: 202,
          name: 'Bosch Paint Sprayer',
          description: 'High efficiency, easy to use',
          price: 4999,
          category: 'paint-supplies',
          rating: 4.7,
          dateAdded: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          image: 'assets/bosch-paint-sprayer.jpg',
          stock: 0,
          status: false
        },
        {
          id: 203,
          name: 'Makita Angle Grinder',
          description: 'Powerful motor, ergonomic grip',
          price: 2999,
          category: 'power-tools',
          rating: 4.3,
          dateAdded: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
          image: 'assets/makita-grinder.jpg',
          stock: 7,
          status: true
        },
        {
          id: 204,
          name: 'DeWalt Safety Glasses',
          description: 'Durable, anti-fog lenses',
          price: 499,
          category: 'safety-tools',
          rating: 4.5,
          dateAdded: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          image: 'assets/dewalt-glasses.webp',
          stock: 0,
          status: false
        },
        {
          id: 205,
          name: 'Stanley Claw Hammer',
          description: 'Heavy-duty steel hammer for all your construction needs',
          price: 799,
          category: 'hand-tools',
          rating: 4.4,
          dateAdded: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          image: 'assets/stanley-hammer.webp',
          stock: 10,
          status: true
        },
        {
          id: 206,
          name: 'Bosch Cordless Screwdriver',
          description: 'Compact and powerful cordless screwdriver',
          price: 2599,
          category: 'hand-tools',
          rating: 4.6,
          dateAdded: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          isTrending: true,
          image: 'assets/bosch-screwdriver.webp',
          stock: 0,
          status: false
        }
      ]);
    }
    this.products$ = this.productsSubject.asObservable();
  }

  getProducts(): Product[] {
    return this.productsSubject.getValue();
  }

  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.getProducts().filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  getProductsByCategory(category: string): Product[] {
    return this.getProducts().filter(product => product.category.toLowerCase() === category.toLowerCase());
  }

  getFlashSalesProducts(): Product[] {
    const now = new Date();
    return this.getProducts().filter(product => product.salePrice !== undefined && product.dealEndTime !== undefined && product.dealEndTime > now);
  }

  getMainFlashSalesProducts(): Product[] {
    const now = new Date();
    const mainFlashSaleIds = [101, 102, 103, 104];
    return this.getProducts().filter(product => mainFlashSaleIds.includes(product.id) && product.salePrice !== undefined && product.dealEndTime !== undefined && product.dealEndTime > now);
  }

  getNewArrivalsProducts(): Product[] {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.getProducts().filter(product => product.dateAdded !== undefined && product.dateAdded > sevenDaysAgo);
  }

  updateProducts(products: Product[]): void {
    this.setProducts(products);
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  }
}
