import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SplashComponent } from './splash/splash.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SignupCompleteComponent } from './signup/signup-complete.component';
import { CategoriesComponent } from './categories/categories.component';
import { CartComponent } from './cart/cart.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

import { SearchResultsComponent } from './search-results/search-results.component';
import { ToolboxComponent } from './toolbox/toolbox.component';

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
  { path: 'toolbox', component: ToolboxComponent }
];
