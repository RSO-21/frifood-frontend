import { Component, inject } from '@angular/core';

import { Offer } from './../models';
import { OfferService } from '../services/offers.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.less',
})
export class Cart {
  userService = inject(UserService);
  offerService = inject(OfferService);

  loading = true;
  error = '';
  offers: Offer[] = [];

  ngOnInit(): void {
    this.loadCartOffers();
  }

  private loadCartOffers(): void {
    const user = this.userService.user();

    if (!user || !user.cart || user.cart.length === 0) {
      this.loading = false;
      this.offers = [];
      return;
    }

    this.offerService.getOffersByIds(user.cart).subscribe({
      next: (offers) => {
        this.offers = offers;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load cart';
        this.loading = false;
      },
    });
  }
}
