import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminProductService } from '../admin-product.service';
import { AdminProductDetailsService } from '../admin-product-details/admin-product-details.service';
import { FormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  filterCategory: string = '';
  filterStatus: string = '';
  selectedProductIds: Set<number> = new Set<number>();
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  categories = this.getCategories();
  categoryValues = this.categories.map(cat => cat.toLowerCase().replace(/ /g, '-'));

  showProductForm: boolean = false;
  isEditMode: boolean = false;
  productForm: any = {
    id: 0,
    sku: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0,
    status: true,
    lastUpdated: new Date(),
    isNew: false,
    isPromo: false
  };

  badgeSelection: 'none' | 'new' | 'promo' = 'none';

  openModal(): void {
    this.showProductForm = true;
  }

  onBadgeChange(product: any): void {
    if (product.badgeSelection === 'new') {
      product.isNew = true;
      product.isPromo = false;
    } else if (product.badgeSelection === 'promo') {
      product.isNew = false;
      product.isPromo = true;
    } else {
      product.isNew = false;
      product.isPromo = false;
    }
    this.adminProductService.updateProduct(product);
    this.loadProducts();
  }

  addNewProduct(): void {
    this.isEditMode = false;
    this.productForm = {
      id: 0,
      sku: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      stock: 0,
      status: true,
      lastUpdated: new Date(),
      isNew: false,
      isPromo: false
    };
    this.badgeSelection = 'none';
    this.openModal();
  }

  editProduct(product: any): void {
    this.isEditMode = true;
    this.productForm = { ...product };
    if (product.isNew) {
      this.badgeSelection = 'new';
    } else if (product.isPromo) {
      this.badgeSelection = 'promo';
    } else {
      this.badgeSelection = 'none';
    }
    this.openModal();
  }

  saveProduct(): void {
    // Update isNew and isPromo based on badgeSelection
    this.productForm.isNew = this.badgeSelection === 'new';
    this.productForm.isPromo = this.badgeSelection === 'promo';

    if (this.isEditMode) {
      this.adminProductService.updateProduct(this.productForm);
    } else {
      this.adminProductService.createProduct(this.productForm);
    }
    this.showProductForm = false;
    this.loadProducts();
  }

  cancelEdit(): void {
    this.showProductForm = false;
  }

  constructor(
    private adminProductService: AdminProductService,
    private adminProductDetailsService: AdminProductDetailsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  back(): void {
    this.router.navigate(['/admin']);
  }

  getCategories() {
    // Return categories from user categories component or a shared service
    // For now, hardcoded categories similar to user categories component
    return [
      'Power Tools',
      'Hand Tools',
      'Electrical Materials',
      'Building Materials',
      'Gardening Tools',
      'Paint & Supplies',
      'Plumbing Supplies',
      'Safety Tools'
    ];
  }

  loadProducts(): void {
    this.products = this.adminProductService.getProductsByCategory(this.filterCategory); // get products by category filter
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(p => {
        if (this.filterStatus === 'active') return p.status === true;
        if (this.filterStatus === 'inactive') return p.status === false;
        if (this.filterStatus === 'out-of-stock') return p.stock === 0;
        return true;
      });
    }

    this.filteredProducts = this.sortProducts(filtered);
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.currentPage = 1;
  }

  sortProducts(products: any[]): any[] {
    return products.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (aValue === bValue) return 0;
      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  isMobileView(): boolean {
    return window.innerWidth <= 768;
  }

  toggleSelectProduct(productId: number): void {
    if (this.selectedProductIds.has(productId)) {
      this.selectedProductIds.delete(productId);
    } else {
      this.selectedProductIds.add(productId);
    }
  }

  isSelected(productId: number): boolean {
    return this.selectedProductIds.has(productId);
  }

  selectAll(select: boolean): void {
    if (select) {
      this.filteredProducts.forEach(p => this.selectedProductIds.add(p.id));
    } else {
      this.selectedProductIds.clear();
    }
  }

  deselectAll(): void {
    this.selectedProductIds.clear();
  }

  areAllSelected(): boolean {
    return this.filteredProducts.length > 0 && this.filteredProducts.every(p => this.selectedProductIds.has(p.id));
  }

  deleteSelected(): void {
    const ids = Array.from(this.selectedProductIds);
    this.adminProductService.bulkDelete(ids);
    this.selectedProductIds.clear();
    this.loadProducts();
  }

  changeStatusSelected(status: boolean): void {
    const ids = Array.from(this.selectedProductIds);
    this.adminProductService.bulkStatusChange(ids, status);
    this.loadProducts();
  }

  moveCategorySelected(newCategory: string): void {
    const ids = Array.from(this.selectedProductIds);
    this.adminProductService.bulkCategoryMove(ids, newCategory);
    this.loadProducts();
  }

  // Pagination helpers
  get pagedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onStatusChange(product: any): void {
    // Handle status change from dropdown
    if (product.status === null) {
      // Treat null as out of stock, set status false and stock 0
      product.status = false;
      product.stock = 0;
    } else if (product.status === true) {
      // Active status, ensure stock > 0
      if (product.stock === 0) {
        product.stock = 1; // default stock if zero
      }
    } else if (product.status === false) {
      // Inactive status, stock can be any value
    }
    this.adminProductService.updateProduct(product);
    this.loadProducts();
  }
}
