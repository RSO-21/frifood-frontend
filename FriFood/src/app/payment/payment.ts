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
  externalIds: string[] = [];

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    //  Defer to next microtask (after initial CD)
    queueMicrotask(() => {
      const state = window.history.state as { orderIds?: number[]; externalIds?: string[] };

      this.orderIds = state?.orderIds ?? [];
      this.externalIds = state?.externalIds ?? [];
      console.log('orderIds', this.orderIds, 'externalIds', this.externalIds);

      if (this.orderIds.length === 0) {
        setTimeout(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }
  confirm() {
    // if (this.orderIds.length !== this.externalIds.length) {
    //   this.status = 'Payment data mismatch ❌';
    //   return;
    // }

    this.loading = true;

    forkJoin(
      this.orderIds.map((orderId, index) =>
        this.paymentService.confirmPaymentForOrder(orderId, this.externalIds[index]),
      ),
    ).subscribe({
      next: () => {
        this.paymentConfirmed = true;
        this.loading = false;
        this.status = 'Payment confirmed ✅';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Payment confirmation failed', err);
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
