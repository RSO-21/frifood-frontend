import { Component, computed, effect, inject, signal } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { Offer } from './../models';
import { OfferService } from '../services/offers.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.less',
})
export class Cart {
  userService = inject(UserService);
  offerService = inject(OfferService);

  // local state as signals
  loading = signal(true);
  error = signal('');
  offers = signal<Offer[]>([]);

  cartIds = computed(() => this.userService.user_cart());

  cartQuantities = computed(() => {
    const map = new Map<number, number>();
    for (const id of this.cartIds()) {
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    return map;
  });

  cartTotal = computed(() =>
    this.offers().reduce((sum, offer) => {
      const qty = this.cartQuantities().get(offer.id) ?? 0;
      return sum + offer.price_discounted * qty;
    }, 0)
  );

  constructor() {
    effect(() => {
      const cart = this.cartIds();

      this.loading.set(true);
      this.error.set('');

      if (!cart || cart.length === 0) {
        this.offers.set([]);
        this.loading.set(false);
        return;
      }

      this.offerService.getOffersByIds(cart).subscribe({
        next: (offers) => {
          this.offers.set(offers);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load cart');
          this.loading.set(false);
        },
      });
    });
  }
}
