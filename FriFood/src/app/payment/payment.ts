import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { ReviewService } from '../services/review.service';
import { UserService } from '../services/user.service';

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

  ngOnInit() {
    console.log('Starting payment processing...');
    setTimeout(() => {
      this.loading = false;
      this.confirm();
    }, 3000); // simulate loading delay
  }

  confirm() {
    console.log('Confirming payment...');
    // for now: hardcoded / coming from route / backend later
    const paymentId = 1;

    this.paymentService.confirmPayment(paymentId).subscribe({
      next: () => {
        this.status = 'Payment confirmed ✅';
        this.loading = false;
        console.log('Payment confirmed successfully.');
        this.paymentConfirmed = true;
        this.cdr.detectChanges();
      },
      error: () => {
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
