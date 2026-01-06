import { Component, Input } from '@angular/core';

import { DatePipe } from '@angular/common';
import { Offer } from '../models';

@Component({
  selector: 'app-offers',
  standalone: true,
  templateUrl: './offers.html',
  imports: [DatePipe],
})
export class OffersComponent {
  @Input({ required: true }) offers: Offer[] = [];

  // NEW: control how many to show
  @Input() limit: number | null = null;

  get visibleOffers(): Offer[] {
    let activeOffers = this.offers.filter((o) => o.status === 'ACTIVE');

    // sort by biggest discount
    activeOffers = activeOffers.sort((a, b) => {
      const da = a.price_original - a.price_discounted;
      const db = b.price_original - b.price_discounted;
      return db - da;
    });

    // limit only if requested
    if (this.limit !== null) {
      return activeOffers.slice(0, this.limit);
    }

    return activeOffers;
  }

  discountPercent(offer: Offer): number {
    return Math.round(
      ((offer.price_original - offer.price_discounted) / offer.price_original) * 100
    );
  }
}
