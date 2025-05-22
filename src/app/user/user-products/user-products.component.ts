import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { Product, ProductService } from '../../product.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'] || 'new';
      if (mode === 'all') {
        this.products = this.productService.getProducts();
      } else {
        this.products = this.productService.getNewArrivalsProducts();
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
