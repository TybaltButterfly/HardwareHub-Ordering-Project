import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService, Product } from '../../product.service';

interface Category {
  name: string;
  image: string;
  caption?: string;
  routerLink: string;
  altText: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryName: string | null = null;
  searchTerm: string = '';
  productSearchTerm: string = '';

  categories: Category[] = [
    {
      name: 'Power Tools',
      image: 'assets/power tools.jpg',
      caption: '100+ items',
      routerLink: '/categories/power-tools',
      altText: 'Power Tools'
    },
    {
      name: 'Hand Tools',
      image: 'assets/hand-tools.jpg',
      caption: 'DIY essentials',
      routerLink: '/categories/hand-tools',
      altText: 'Hand Tools'
    },
    {
      name: 'Electrical Materials',
      image: 'assets/electrical.jpg',
      caption: 'Wide selection',
      routerLink: '/categories/electrical-materials',
      altText: 'Electrical Materials'
    },
    {
      name: 'Building Materials',
      image: 'assets/building-materials.jpg',
      caption: 'Quality supplies',
      routerLink: '/categories/building-materials',
      altText: 'Building Materials'
    },
    {
      name: 'Gardening Tools',
      image: 'assets/garden-tools.jpg',
      caption: 'For your garden',
      routerLink: '/categories/gardening-tools',
      altText: 'Gardening Tools'
    },
    {
      name: 'Paint & Supplies',
      image: 'assets/painting-supplies.jpg',
      caption: 'Colors and more',
      routerLink: '/categories/paint-supplies',
      altText: 'Paint and Supplies'
    },
  {
      name: 'Plumbing Supplies',
      image: 'assets/plumbing-tools.jpg',
      caption: 'Pipes and fittings',
      routerLink: '/categories/plumbing-supplies',
      altText: 'Plumbing Supplies'
    },
    {
      name: 'Safety Tools',
      image: 'assets/safety-tools.jpg',
      caption: 'Protective gear and more',
      routerLink: '/categories/safety-tools',
      altText: 'Safety Tools'
    }
  ];

  filteredCategories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  get currentCategoryName(): string {
    return this.filteredCategories.length > 0 ? this.filteredCategories[0].name : '';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName');
      this.route.queryParams.subscribe(queryParams => {
        const mode = queryParams['mode'] || 'all';
        console.log('Selected category:', this.categoryName, 'Mode:', mode);
        if (this.categoryName) {
          this.filteredCategories = this.categories.filter(cat =>
            cat.routerLink.toLowerCase().includes(this.categoryName!.toLowerCase())
          );
          if (mode === 'new') {
            // Filter new products in the category
            this.products = this.productService.getNewArrivalsProducts().filter(product =>
              product.category.toLowerCase() === this.categoryName!.toLowerCase()
            );
          } else {
            // All products in the category
            this.products = this.productService.getProductsByCategory(this.categoryName);
          }
          this.filteredProducts = this.products;
        } else {
          this.filteredCategories = this.categories;
          this.products = [];
          this.filteredProducts = [];
        }
      });
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(cat =>
      cat.name.toLowerCase().includes(term)
    );
  }

  onProductSearchChange(): void {
    const term = this.productSearchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }
}
