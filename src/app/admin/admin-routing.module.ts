import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { AdminLoginComponent } from './admin-login.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { AdminOrderDetailsComponent } from './orders/admin-order-details.component';

const routes: Routes = [
  { path: 'login', component: AdminLoginComponent },
  { path: '', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/add', component: ProductsComponent }, 
  { path: 'orders', component: AdminOrdersComponent },
  { path: 'orders/:id', component: AdminOrderDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'settings', component: AdminSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
