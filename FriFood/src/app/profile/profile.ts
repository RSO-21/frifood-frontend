import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReviewService } from '../services/review.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [FormsModule, DatePipe],
})
export class Profile {
  private readonly userService = inject(UserService);
  private readonly reviewService = inject(ReviewService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  orders: any[] = [];

  // review UI state
  openOrderId: number | null = null;
  rating = 5;
  comment = '';
  submitting = false;

  constructor() {
    effect(() => {
      const userId = this.userService.user_id();
      console.log('profile init, userid', userId);
      if (!userId) return;

      this.userService.getOrderHistory(userId).subscribe({
        next: (res) => {
          console.log('res', res);
          this.orders = res.orders;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load order history', err);
          this.loading = false;
        },
      });
    });
  }

  openReview(orderId: number) {
    this.openOrderId = orderId;
    this.rating = 5;
    this.comment = '';
  }

  submitReview(orderId: number) {
    this.submitting = true;

    this.reviewService
      .createReview({
        order_id: orderId,
        user_id: this.userService.user_id(),
        rating: this.rating,
        comment: this.comment || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.openOrderId = null;
          // mark locally as reviewed
          this.orders = this.orders.map((o) => (o.id === orderId ? { ...o, reviewed: true } : o));
          alert('Review submitted successfully!');
        },
        error: (err) => {
          console.error('Review failed', err);
          this.submitting = false;
        },
      });
  }
}
