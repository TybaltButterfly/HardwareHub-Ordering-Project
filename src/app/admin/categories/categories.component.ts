import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService, Category } from './categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'categories.component.html',
  styleUrls: ['categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = this.resetCategory();
  editCategory: Category | null = null;
  isEditing: boolean = false;

  constructor(private categoriesService: CategoriesService, private router: Router) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  resetCategory(): Category {
    return {
      id: 0,
      name: '',
      image: '',
      caption: '',
      altText: ''
    };
  }

  addCategory(): void {
    if (this.newCategory.name.trim() && this.newCategory.image.trim()) {
      this.categoriesService.addCategory(this.newCategory);
      this.newCategory = this.resetCategory();
    }
  }

  startEdit(category: Category): void {
    this.editCategory = { ...category };
    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editCategory) {
      this.categoriesService.updateCategory(this.editCategory);
      this.editCategory = null;
      this.isEditing = false;
    }
  }

  cancelEdit(): void {
    this.editCategory = null;
    this.isEditing = false;
  }

  deleteCategory(categoryId: number): void {
    this.categoriesService.deleteCategory(categoryId);
  }
    goBack(): void {
    this.router.navigate(['/admin']);
  }
}
