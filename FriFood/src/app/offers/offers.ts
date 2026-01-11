import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { Offer, Partner } from '../models';

import { OfferService } from '../services/offers.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  templateUrl: './offers.html',
})
export class OffersComponent {
  @Input({ required: true }) partner: Partner | null = null;
  @Input() isOwnerView: boolean = false;
  offers: Offer[] = [];
  @Input() limit: number | null = null;
  offerService = inject(OfferService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    if (this.partner) {
      this.offerService.listOffersByPartner(this.partner.id).subscribe((offers) => {
        this.offers = offers;
        this.cdr.detectChanges();
      });
    }
  }

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
