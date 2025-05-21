import { Injectable } from '@angular/core';

export interface Review {
  id: number;
  productId: number;
  author: string;
  comment: string;
  approved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminReviewsService {
  private reviews: Review[] = [];

  constructor() {
    // Initialize with some default reviews if needed
  }

  getReviewsForProduct(productId: number) {
    return this.reviews.filter(r => r.productId === productId && r.approved);
  }

  addReview(review: Review) {
    this.reviews.push(review);
  }

  approveReview(reviewId: number) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review) {
      review.approved = true;
    }
  }

  rejectReview(reviewId: number) {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
  }
}
