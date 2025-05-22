import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  image: string;
  caption?: string;
  altText: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 1,
      name: 'Power Tools',
      image: 'assets/power tools.jpg',
      caption: '100+ items',
      altText: 'Power Tools'
    },
    {
      id: 2,
      name: 'Hand Tools',
      image: 'assets/hand-tools.jpg',
      caption: 'DIY essentials',
      altText: 'Hand Tools'
    },
    {
      id: 3,
      name: 'Electrical Materials',
      image: 'assets/electrical.jpg',
      caption: 'Wide selection',
      altText: 'Electrical Materials'
    },
    {
      id: 4,
      name: 'Building Materials',
      image: 'assets/building-materials.jpg',
      caption: 'Quality supplies',
      altText: 'Building Materials'
    },
    {
      id: 5,
      name: 'Gardening Tools',
      image: 'assets/garden-tools.jpg',
      caption: 'For your garden',
      altText: 'Gardening Tools'
    },
    {
      id: 6,
      name: 'Paint & Supplies',
      image: 'assets/painting-supplies.jpg',
      caption: 'Colors and more',
      altText: 'Paint and Supplies'
    },
    {
      id: 7,
      name: 'Plumbing Supplies',
      image: 'assets/plumbing-tools.jpg',
      caption: 'Pipes and fittings',
      altText: 'Plumbing Supplies'
    },
    {
      id: 8,
      name: 'Safety Tools',
      image: 'assets/safety-tools.jpg',
      caption: 'Protective gear and more',
      altText: 'Safety Tools'
    }
  ];

  private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject(this.categories);

  constructor() {}

  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  addCategory(category: Category): void {
    category.id = this.generateId();
    this.categories.push(category);
    this.categoriesSubject.next(this.categories);
  }

  updateCategory(updatedCategory: Category): void {
    const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      this.categories[index] = updatedCategory;
      this.categoriesSubject.next(this.categories);
    }
  }

  deleteCategory(categoryId: number): void {
    this.categories = this.categories.filter(cat => cat.id !== categoryId);
    this.categoriesSubject.next(this.categories);
  }

  private generateId(): number {
    return this.categories.length > 0 ? Math.max(...this.categories.map(cat => cat.id)) + 1 : 1;
  }
}
