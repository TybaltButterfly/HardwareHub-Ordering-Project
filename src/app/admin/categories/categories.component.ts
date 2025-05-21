import { Component } from '@angular/core';
import { CategoriesComponent as UserCategoriesComponent } from '../../user/categories/categories.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [UserCategoriesComponent],
  template: '<app-categories></app-categories>'
})
export class CategoriesComponent {}
