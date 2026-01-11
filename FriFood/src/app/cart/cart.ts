import { Component, computed, effect, inject, signal } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { Offer } from './../models';
import { OfferService } from '../services/offers.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.less',
})
export class Cart {
  userService = inject(UserService);
  offerService = inject(OfferService);
  orderService = inject(OrderService);
  router = inject(Router);

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

  ordersByPartner = computed(() => {
    const quantities = this.cartQuantities();
    const userId = this.userService.user_id();

    const map = new Map<
      string,
      {
        partnerId: string;
        userId: string;
        items: { offerId: number; quantity: number }[];
        amount: number;
      }
    >();

    for (const offer of this.offers()) {
      const qty = quantities.get(offer.id) ?? 0;
      if (qty === 0) continue;

      const partnerId = offer.partner_id; // string

      if (!map.has(partnerId)) {
        map.set(partnerId, {
          partnerId: partnerId,
          userId: userId,
          items: [],
          amount: 0,
        });
      }

      const order = map.get(partnerId)!;

      order.items.push({
        offerId: offer.id,
        quantity: qty,
      });

      order.amount += offer.price_discounted * qty;
    }

    return Array.from(map.values());
  });

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

  checkout() {
    const orders = this.ordersByPartner();
    if (orders.length === 0) return;

    this.loading.set(true);
    this.error.set('');

    forkJoin(orders.map((order) => this.orderService.createOrder(order))).subscribe({
      next: () => {
        console.log('Created orders:', orders);
        this.loading.set(false);
        this.router.navigate(['/payment']);
      },
      error: () => {
        this.error.set('Checkout failed');
        this.loading.set(false);
      },
    });
  }
}
