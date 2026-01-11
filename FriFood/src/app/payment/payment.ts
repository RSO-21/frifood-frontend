import { ChangeDetectorRef, Component, PLATFORM_ID, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { ReviewService } from '../services/review.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrl: './payment.less',
  imports: [FormsModule],
})
export class Payment {
  paymentService = inject(PaymentService);
  userService = inject(UserService);
  reviewService = inject(ReviewService);
  platformId = inject(PLATFORM_ID);
  loading = true;
  paymentConfirmed = false;
  cdr = inject(ChangeDetectorRef);

  status = '';

  // review state
  rating = 5;
  comment = '';
  reviewSubmitting = false;
  reviewSubmitted = false;

  // you must already have this from checkout / route / state
  orderId!: number;

  router = inject(Router);

  orderIds: number[] = [];

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    //  Defer to next microtask (after initial CD)
    queueMicrotask(() => {
      const state = window.history.state as { orderIds?: number[] };

      this.orderIds = state?.orderIds ?? [];
      console.log('orderIds', this.orderIds);

      if (this.orderIds.length === 0) {
        setTimeout(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }
  confirm() {
    forkJoin(
      this.orderIds.map((orderId) => this.paymentService.confirmPaymentForOrder(orderId))
    ).subscribe({
      next: () => {
        this.paymentConfirmed = true;
        this.loading = false;
        this.status = 'Payment confirmed ✅';
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.status = 'Payment failed ❌';
      },
    });
  }

  submitReview() {
    if (!this.orderId) return;

    this.reviewSubmitting = true;

    this.reviewService
      .createReview({
        order_id: this.orderId,
        user_id: this.userService.user_id(),
        rating: this.rating,
        comment: this.comment || undefined,
      })
      .subscribe({
        next: () => {
          this.reviewSubmitted = true;
          this.reviewSubmitting = false;
        },
        error: (err) => {
          console.error('Failed to submit review', err);
          this.reviewSubmitting = false;
        },
      });
  }
}
