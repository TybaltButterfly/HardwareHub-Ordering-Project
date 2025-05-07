import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../product.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  providers: [ProductService]
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  filteredProducts: Product[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.filteredProducts = this.productService.searchProducts(this.query);
    });
  }
}
