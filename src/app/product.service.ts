import { Injectable } from '@angular/core';

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
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Power Drill', description: 'Cordless power drill', price: 99.99, category: 'power-tools', image: '/assets/power tools.jpg' },
    { id: 2, name: 'Hammer', description: 'Steel claw hammer', price: 19.99, category: 'hand-tools', image: '/assets/stanley-hammer.webp' },
    { id: 3, name: 'Screwdriver Set', description: 'Set of 6 screwdrivers', price: 29.99, category: 'hand-tools', image: '/assets/bosch-screwdriver.webp' },
    { id: 4, name: 'Electric Sander', description: 'Orbital electric sander', price: 49.99, category: 'power-tools', image: '/assets/power tools.jpg' },
    { id: 5, name: 'Paint Brush', description: '3-inch paint brush', price: 5.99, category: 'paint-supplies', image: '/assets/spray gun.webp' },
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
      image: '/assets/Holcim-Excel.jpg'
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
      image: '/assets/spray gun.webp'
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
      image: '/assets/wrench.webp'
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
      image: '/assets/kitchenfaucet.jpg'
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
      image: '/assets/tolsen-drill.webp'
    },
    {
      id: 202,
      name: 'Bosch Paint Sprayer',
      description: 'High efficiency, easy to use',
      price: 4999,
      category: 'paint-supplies',
      rating: 4.7,
      dateAdded: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      image: '/assets/bosch-paint-sprayer.jpg'
    },
    {
      id: 203,
      name: 'Makita Angle Grinder',
      description: 'Powerful motor, ergonomic grip',
      price: 2999,
      category: 'power-tools',
      rating: 4.3,
      dateAdded: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
      image: '/assets/makita-grinder.jpg'
    },
    {
      id: 204,
      name: 'DeWalt Safety Glasses',
      description: 'Durable, anti-fog lenses',
      price: 499,
      category: 'safety-tools',
      rating: 4.5,
      dateAdded: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      image: '/assets/dewalt-glasses.webp'
    },
    {
      id: 205,
      name: 'Stanley Claw Hammer',
      description: 'Heavy-duty steel hammer for all your construction needs',
      price: 799,
      category: 'hand-tools',
      rating: 4.4,
      dateAdded: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      image: '/assets/stanley-hammer.webp'
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
      image: '/assets/bosch-screwdriver.webp'
    }
  ];

  searchProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  getProductsByCategory(category: string) {
    return this.products.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }

  getFlashSalesProducts(): Product[] {
    const now = new Date();
    return this.products.filter(product => product.salePrice !== undefined && product.dealEndTime !== undefined && product.dealEndTime > now);
  }

  getNewArrivalsProducts(): Product[] {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.products.filter(product => product.dateAdded !== undefined && product.dateAdded > sevenDaysAgo);
  }
}
