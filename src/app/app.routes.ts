import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { SplashComponent } from './user/splash/splash.component';
import { SignupComponent } from './user/signup/signup.component';
import { HomeComponent } from './user/home/home.component';
import { SignupCompleteComponent } from './user/signup/signup-complete.component';
import { CategoriesComponent } from './user/categories/categories.component';
import { CartComponent } from './user/cart/cart.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';
import { SearchResultsComponent } from './user/search-results/search-results.component';
import { ToolboxComponent } from './user/toolbox/toolbox.component';
import { UserProductsComponent } from './user/user-products/user-products.component';
import { ProductDetailsComponent } from './user/product-details/product-details.component';
import { FlashSalesComponent } from './user/flash-sales/flash-sales.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { MyOrdersComponent } from './user/my-orders/my-orders.component';
import { OrderDetailsComponent } from './user/order-details/order-details.component';

export const routes: Routes = [
  { path: '', component: SplashComponent },   
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup-complete', component: SignupCompleteComponent },
  { path: 'home', component: HomeComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:categoryName', component: CategoriesComponent },
  { path: 'profile', component: UserprofileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'toolbox', component: ToolboxComponent },
  { path: 'products', component: UserProductsComponent },
  { path: 'flash-sales', component: FlashSalesComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'order-details/:id', component: OrderDetailsComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)}
];
