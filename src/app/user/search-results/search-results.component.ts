import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { Product, ProductService } from '../../product.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  providers: [ProductService]
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  filteredProducts: Product[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService, private location: Location) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.filteredProducts = this.productService.searchProducts(this.query);
    });
  }

  back(): void {
    this.location.back();
  }
}
